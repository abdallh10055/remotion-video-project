import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { VideoProject, VideoScene, TextLayer, EffectConfig } from '@remotion-video-studio/core';

export interface DynamicVideoProps {
  project: VideoProject;
}

export function getSceneProgress(frame: number, scene: VideoScene, fps: number): number {
  return Math.min(1, Math.max(0, (frame - scene.start * fps) / (scene.duration * fps)));
}

function renderTextLayer(layer: TextLayer, frame: number) {
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      key={layer.id}
      style={{
        position: 'absolute',
        left: layer.x ?? 50,
        top: layer.y ?? 50,
        color: layer.color ?? '#ffffff',
        fontSize: layer.fontSize ?? 48,
        fontWeight: layer.bold ? 700 : 500,
        opacity,
        transform: 'translate(-50%, -50%)',
        textAlign: layer.align ?? 'center',
        direction: layer.direction ?? 'ltr',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {layer.text}
    </div>
  );
}

function renderEffect(effect: EffectConfig, frame: number): Record<string, string | number> {
  switch (effect.type) {
    case 'fade':
      return { opacity: `${interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}` };
    case 'zoom':
      return { transform: `scale(${interpolate(frame, [0, 30], [1, 1.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` };
    case 'slide':
      return { transform: `translateX(${interpolate(frame, [0, 30], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)` };
    default:
      return { opacity: '1' };
  }
}

export const DynamicVideoComposition: React.FC<DynamicVideoProps> = ({ project }) => {
  const frame = useCurrentFrame();
  const fps = project.video.fps ?? 30;
  const currentScene = project.scenes.find((scene) => {
    const startFrame = scene.start * fps;
    const endFrame = (scene.start + scene.duration) * fps;
    return frame >= startFrame && frame <= endFrame;
  }) ?? project.scenes[0];

  const activeEffects = currentScene?.effects ?? [];

  const effectStyle = activeEffects.reduce<Record<string, string | number>>((acc, effect) => {
    const value = renderEffect(effect, frame);
    return { ...acc, ...value };
  }, {});

  return (
    <AbsoluteFill
      style={{
        background: currentScene?.background?.type === 'gradient'
          ? `linear-gradient(135deg, ${currentScene.background.gradient?.[0] ?? '#0f172a'}, ${currentScene.background.gradient?.[1] ?? '#2563eb'})`
          : currentScene?.background?.color ?? '#0f172a',
        overflow: 'hidden',
        ...effectStyle,
      }}
    >
      {currentScene?.texts?.map((layer) => renderTextLayer(layer, frame))}
      {currentScene?.images?.map((image) => (
        <img
          key={image.id}
          src={image.src}
          alt={image.id}
          style={{
            position: 'absolute',
            left: image.x ?? 50,
            top: image.y ?? 50,
            width: image.width ?? 200,
            height: image.height ?? 200,
            opacity: image.opacity ?? 1,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.25))',
        }}
      />
    </AbsoluteFill>
  );
};

export default DynamicVideoComposition;
