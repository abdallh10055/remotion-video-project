#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { parseSrtToJson, createEmptyProject, validateProjectSchema } from '@remotion-video-studio/core';

function printHelp() {
  console.log(`
Video Studio CLI

Commands:
  video-studio run "topic"
  video-studio srt-to-json input.srt output.json
  video-studio render-tsx --file my-component.tsx --component MyComponent
  video-studio create --topic "topic" --language ar --format vertical --duration 60
  video-studio help
`);
}

function commandRun(topic: string) {
  const project = createEmptyProject(topic || 'Generated Project');
  const validation = validateProjectSchema(project);

  console.log(`Generating project for topic: ${topic}`);
  console.log(JSON.stringify({ projectId: project.project.id, validation }, null, 2));
}

function commandSrtToJson(input: string, output: string) {
  const content = fs.readFileSync(input, 'utf8');
  const parsed = parseSrtToJson(content);
  fs.writeFileSync(output, JSON.stringify(parsed, null, 2), 'utf8');
  console.log(`Converted SRT to JSON: ${output} (${parsed.length} entries)`);
}

function commandCreate(args: Record<string, string>) {
  const topic = args.topic || 'Untitled';
  const project = createEmptyProject(topic);
  project.video.aspectRatio = args.format === 'vertical' ? '9:16' : '16:9';
  project.video.duration = Number(args.duration || 30);
  project.project.name = topic;

  console.log(JSON.stringify(project, null, 2));
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item.startsWith('--')) {
      const key = item.slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      args[key] = value;
    }
  }
  return args;
}

const [, , command, ...rest] = process.argv;

if (!command || command === 'help' || command === '--help') {
  printHelp();
  process.exit(0);
}

if (command === 'run') {
  const topic = rest.join(' ') || 'untitled topic';
  commandRun(topic);
  process.exit(0);
}

if (command === 'srt-to-json') {
  const [input, output] = rest;
  if (!input || !output) {
    console.error('Usage: video-studio srt-to-json <input.srt> <output.json>');
    process.exit(1);
  }
  commandSrtToJson(input, output);
  process.exit(0);
}

if (command === 'create') {
  const args = parseArgs(rest);
  commandCreate(args);
  process.exit(0);
}

if (command === 'render-tsx') {
  const args = parseArgs(rest);
  const file = args.file || args['file-path'];
  const componentName = args.component || 'DefaultComponent';
  const output = args.output || path.resolve(process.cwd(), 'rendered-output.mp4');

  if (!file) {
    console.error('Usage: video-studio render-tsx --file my-component.tsx --component MyComponent');
    process.exit(1);
  }

  const resolved = path.resolve(file);
  console.log(`Preparing TSX render for: ${resolved}`);
  console.log(`Component: ${componentName}`);
  console.log(`Output: ${output}`);
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
printHelp();
process.exit(1);
