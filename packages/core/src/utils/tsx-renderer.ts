import fs from 'node:fs';
import path from 'node:path';

export interface TsxRenderOptions {
  filePath?: string;
  code?: string;
  componentName: string;
  props?: Record<string, unknown>;
  width?: number;
  height?: number;
  fps?: number;
  duration?: number;
}

export interface TsxRenderResult {
  ok: boolean;
  componentName: string;
  filePath?: string;
  outputPath?: string;
  message: string;
}

export async function renderTsxFile(options: TsxRenderOptions): Promise<TsxRenderResult> {
  const {
    filePath,
    code,
    componentName,
    props = {},
    width = 1080,
    height = 1920,
    fps = 30,
    duration = 30,
  } = options;

  const resolvedFile = filePath ? path.resolve(filePath) : undefined;

  if (!resolvedFile && !code) {
    return {
      ok: false,
      componentName,
      message: 'Either filePath or code must be provided.',
    };
  }

  if (resolvedFile && !fs.existsSync(resolvedFile)) {
    return {
      ok: false,
      componentName,
      filePath: resolvedFile,
      message: `File not found: ${resolvedFile}`,
    };
  }

  const source = code ?? fs.readFileSync(resolvedFile!, 'utf8');

  return {
    ok: true,
    componentName,
    filePath: resolvedFile,
    outputPath: 'rendered-output.mp4',
    message: `TSX component "${componentName}" is accepted for render. Source length: ${source.length}. Config: ${width}x${height} @ ${fps}fps for ${duration}s.`,
  };
}
