export type JobStatus = 'queued' | 'processing' | 'rendering' | 'completed' | 'failed' | 'cancelled' | 'retrying';

export interface RenderJobInput {
  projectId: string;
  topic?: string;
  filePath?: string;
  config?: Record<string, unknown>;
  props?: Record<string, unknown>;
  attempts?: number;
}

export interface RenderJob {
  id: string;
  projectId: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  input: RenderJobInput;
  outputPath?: string;
  progress: number;
  error?: string;
  attempts: number;
}

export interface QueueOptions {
  maxConcurrent?: number;
}

export class InMemoryRenderQueue {
  private jobs = new Map<string, RenderJob>();
  private active = 0;
  private readonly maxConcurrent: number;

  constructor(options: QueueOptions = {}) {
    this.maxConcurrent = options.maxConcurrent ?? 2;
  }

  enqueue(input: RenderJobInput): RenderJob {
    const job: RenderJob = {
      id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId: input.projectId,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      input,
      progress: 0,
      attempts: input.attempts ?? 0,
    };

    this.jobs.set(job.id, job);
    return job;
  }

  list(): RenderJob[] {
    return [...this.jobs.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  get(id: string): RenderJob | undefined {
    return this.jobs.get(id);
  }

  startNext(): RenderJob | undefined {
    if (this.active >= this.maxConcurrent) return undefined;

    const next = [...this.jobs.values()].find((job) => job.status === 'queued');
    if (!next) return undefined;

    this.active += 1;
    next.status = 'processing';
    next.updatedAt = new Date().toISOString();
    this.jobs.set(next.id, next);
    return next;
  }

  markProgress(id: string, progress: number): RenderJob | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    job.progress = Math.max(0, Math.min(100, progress));
    job.updatedAt = new Date().toISOString();
    this.jobs.set(id, job);
    return job;
  }

  markCompleted(id: string, outputPath: string): RenderJob | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    job.status = 'completed';
    job.outputPath = outputPath;
    job.progress = 100;
    job.updatedAt = new Date().toISOString();
    this.active = Math.max(0, this.active - 1);
    this.jobs.set(id, job);
    return job;
  }

  markFailed(id: string, error: string): RenderJob | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    job.status = 'failed';
    job.error = error;
    job.updatedAt = new Date().toISOString();
    this.active = Math.max(0, this.active - 1);
    this.jobs.set(id, job);
    return job;
  }

  cancel(id: string): RenderJob | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    job.status = 'cancelled';
    job.updatedAt = new Date().toISOString();
    this.active = Math.max(0, this.active - 1);
    this.jobs.set(id, job);
    return job;
  }
}

export const createQueue = (options?: QueueOptions) => new InMemoryRenderQueue(options);
