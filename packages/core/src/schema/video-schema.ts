export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export interface VideoProject {
  schemaVersion: number;
  project: {
    id: string;
    name: string;
    version: number;
    createdAt?: string;
    updatedAt?: string;
  };
  video: {
    width: number;
    height: number;
    fps: number;
    duration: number;
    aspectRatio: AspectRatio;
    codec?: string;
  };
  scenes: VideoScene[];
  audio?: AudioConfig;
  subtitles?: SubtitleConfig;
  brand?: BrandKit;
  metadata?: Record<string, unknown>;
}

export interface VideoScene {
  id: string;
  start: number;
  duration: number;
  name?: string;
  background?: BackgroundLayer;
  texts?: TextLayer[];
  images?: ImageLayer[];
  effects?: EffectConfig[];
  transitions?: TransitionConfig[];
  voice?: AudioLayer;
  music?: AudioLayer[];
  sfx?: AudioLayer[];
}

export interface BackgroundLayer {
  type: 'solid' | 'video' | 'image' | 'gradient';
  src?: string;
  color?: string;
  gradient?: string[];
}

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  direction?: 'ltr' | 'rtl';
  bold?: boolean;
}

export interface ImageLayer {
  id: string;
  src: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
}

export interface AudioLayer {
  src?: string;
  volume?: number;
  start?: number;
  duration?: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
  trimStart?: number;
  trimEnd?: number;
}

export interface AudioConfig {
  voice?: AudioLayer[];
  music?: AudioLayer[];
  sfx?: AudioLayer[];
}

export interface SubtitleConfig {
  src?: string;
  format?: 'srt' | 'vtt' | 'json';
  style?: SubtitleStyle;
  entries?: SubtitleEntry[];
}

export interface SubtitleStyle {
  color?: string;
  fontSize?: number;
  stroke?: string;
  background?: string;
  position?: 'bottom' | 'top' | 'center';
  rtl?: boolean;
}

export interface SubtitleEntry {
  id?: string;
  start: number;
  end: number;
  text: string;
  style?: Partial<SubtitleStyle>;
}

export interface EffectConfig {
  id?: string;
  type: 'zoom' | 'pan' | 'fade' | 'blur' | 'glow' | 'shake' | 'ken-burns' | 'slide' | 'typewriter';
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
  intensity?: number;
}

export interface TransitionConfig {
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'blur' | 'crossfade' | 'push' | 'spin' | 'none';
  duration?: number;
}

export interface BrandKit {
  logo?: string;
  intro?: string;
  outro?: string;
  colors?: string[];
  fontFamily?: string;
  watermark?: string;
}

export const DEFAULT_VIDEO_PROJECT: VideoProject = {
  schemaVersion: 1,
  project: {
    id: 'project-id',
    name: 'New Video',
    version: 1,
  },
  video: {
    width: 1080,
    height: 1920,
    fps: 30,
    duration: 30,
    aspectRatio: '9:16',
    codec: 'h264',
  },
  scenes: [],
  audio: { voice: [], music: [], sfx: [] },
  subtitles: { format: 'srt', entries: [] },
};

export function createEmptyProject(name = 'New Project'): VideoProject {
  return {
    ...DEFAULT_VIDEO_PROJECT,
    project: {
      ...DEFAULT_VIDEO_PROJECT.project,
      id: `project-${Date.now()}`,
      name,
      version: 1,
    },
    scenes: [
      {
        id: 'scene-1',
        start: 0,
        duration: DEFAULT_VIDEO_PROJECT.video.duration,
        background: { type: 'gradient', gradient: ['#0f172a', '#1d4ed8'] },
        texts: [
          {
            id: 'text-1',
            text: 'Hello World',
            x: 0,
            y: 0,
            fontSize: 56,
            color: '#ffffff',
            align: 'center',
            direction: 'ltr',
          },
        ],
      },
    ],
  };
}

export function validateProjectSchema(project: Partial<VideoProject>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!project.project?.id) errors.push('Missing project.id');
  if (!project.video?.width || !project.video?.height) errors.push('Missing video dimensions');
  if (!project.video?.fps || project.video.fps <= 0) errors.push('Invalid video fps');
  if (!project.scenes || !Array.isArray(project.scenes)) errors.push('Scenes must be an array');

  return { valid: errors.length === 0, errors };
}
