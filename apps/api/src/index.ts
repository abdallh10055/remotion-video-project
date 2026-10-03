import http from 'node:http';
import { createEmptyProject, parseSrtToJson, validateProjectSchema } from '@remotion-video-studio/core';
import { createQueue } from '@remotion-video-studio/queue';
import { createWorker } from '@remotion-video-studio/worker';

const queue = createQueue({ maxConcurrent: 2 });

const worker = createWorker(queue, async (job) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { outputPath: `outputs/${job.projectId}.mp4` };
});

void worker.start();

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, status: 'healthy' }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/projects') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const project = payload.projectName ? createEmptyProject(payload.projectName) : createEmptyProject('New Project');
        const validation = validateProjectSchema(project);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ project, validation }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid project payload' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/render') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const job = queue.enqueue({
          projectId: payload.projectId || `project-${Date.now()}`,
          topic: payload.topic,
          config: payload.config || {},
          props: payload.props || {},
        });

        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jobId: job.id, status: job.status }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid render payload' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/subtitles/convert') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const result = parseSrtToJson(payload.content || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ entries: result }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid subtitle payload' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/queue') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ jobs: queue.list() }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`Video Studio API listening on http://localhost:${port}`);
});
