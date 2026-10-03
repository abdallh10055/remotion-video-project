import type { InMemoryRenderQueue, RenderJob } from '@remotion-video-studio/queue';

export interface WorkerHandler {
  (job: RenderJob): Promise<{ outputPath: string } | void>;
}

export class RenderWorker {
  private readonly queue: InMemoryRenderQueue;
  private readonly handler: WorkerHandler;
  private running = false;

  constructor(queue: InMemoryRenderQueue, handler: WorkerHandler) {
    this.queue = queue;
    this.handler = handler;
  }

  async start() {
    if (this.running) return;
    this.running = true;

    while (this.running) {
      const job = this.queue.startNext();
      if (!job) {
        await this.wait(500);
        continue;
      }

      try {
        const result = await this.handler(job);
        if (result?.outputPath) {
          this.queue.markCompleted(job.id, result.outputPath);
        } else {
          this.queue.markCompleted(job.id, `outputs/${job.projectId}.mp4`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown render error';
        this.queue.markFailed(job.id, message);
      }
    }
  }

  stop() {
    this.running = false;
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const createWorker = (queue: InMemoryRenderQueue, handler: WorkerHandler) => new RenderWorker(queue, handler);
