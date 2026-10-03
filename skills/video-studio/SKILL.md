# Video Studio Agent Skill

## Purpose
This agent skill explains how to create, modify, render, publish, and debug video projects built on top of Remotion and a structured JSON-based workflow.

## Core workflow
1. Inspect project structure.
2. Understand existing Remotion composition and assets.
3. Create or validate a `VideoProject` JSON.
4. Convert subtitle input to structured JSON.
5. Generate scenes and effects.
6. Render through the local or queue-based pipeline.
7. Store output and schedule/publish if required.

## Commands the agent should know
- `video-studio run "topic"`
- `video-studio create --topic "..." --language ar --format vertical --duration 60`
- `video-studio srt-to-json input.srt output.json`
- `video-studio render-tsx --file my-component.tsx --component MyComponent`

## Reference architecture
- Core project definitions live in `packages/core`.
- CLI lives in `packages/cli`.
- Remotion remains the rendering engine.
- JSON is the main source of truth.

## Agent instructions
When asked to generate a video:
- Create or load a `VideoProject` JSON.
- Validate it before render.
- Ensure scenes, audio, subtitles, and effects are represented in structured objects.
- Prefer JSON-driven generation over hardcoded compositions.
- Preserve the original project functionality and extend it instead of replacing it.

## Example
```
Create an Arabic 45-second vertical reel about the benefits of walking.
Use a modern template, generate Arabic subtitles, add background music,
then render the final MP4.
```

The agent should create a valid `VideoProject`, add scenes with timing, then invoke the CLI or batch workflow.
