import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface ArabicMotionLessonProps {
  title?: string;
  subtitle?: string;
  srtContent?: string;
  audioSrc?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  fontFamily?: string;
  fontSize?: number;
  showCharacter?: boolean;
  showTitle?: boolean;
  showSubtitles?: boolean;
}

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

const timeToFrames = (timeStr: string): number => {
  const match = timeStr.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
  if (!match) return 0;
  const [, h, m, s, ms] = match;
  return Math.round((parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000) * 30);
};

const parseSRT = (srtContent: string): Subtitle[] => {
  if (!srtContent) return [];
  const blocks = srtContent.split(/\n\n+/);
  return blocks.map(block => {
    const lines = block.trim().split('\n');
    if (lines.length >= 3) {
      const timeMatch = lines[1]?.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
      if (timeMatch) {
        return {
          start: timeToFrames(timeMatch[1]),
          end: timeToFrames(timeMatch[2]),
          text: lines.slice(2).join(' '),
        };
      }
    }
    return null;
  }).filter(Boolean) as Subtitle[];
};

const AnimatedBackground: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  const progress = frame / 150;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${color} ${Math.floor(progress * 50)}%, ${color}dd 50%, ${color}aa ${Math.ceil(50 + progress * 50)}%)`,
        overflow: 'hidden',
      }}
    />
  );
};

const TeacherCharacter: React.FC<{frame: number}> = ({frame}) => {
  const opacity = interpolate(frame, [45, 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(frame, [45, 75], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(frame, [45, 75], [100, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 150,
        left: '50%',
        transform: `translate(-50%, ${y}%) scale(${scale})`,
        opacity,
        width: 280,
        height: 280,
        clipPath: 'circle(50% at 50% 50%)',
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
      }}
    >
      <img
        src="/assets/characters/char_man_azhari_black_scholar__sit_think__tan.svg"
        style={{width: '100%', height: '100%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'}}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
};

const Title: React.FC<{frame: number; title: string; color: string; fontFamily: string}> = ({frame, title, color, fontFamily}) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 30], [100, 0], {extrapolateLeft: 'clamp'});
  const scale = spring({frame, fps: 30, config: {damping: 15, stiffness: 100}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        fontFamily,
        fontWeight: 800,
        fontSize: 52,
        color,
        textShadow: '0 4px 12px rgba(0,0,0,0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        textOrientation: 'mixed',
      }}
    >
      {title}
    </div>
  );
};

const LessonContent: React.FC<{
  subtitle: string;
  frame: number;
  startTime: number;
  endTime: number;
  color: string;
  fontFamily: string;
  fontSize: number;
}> = ({subtitle, frame, startTime, endTime, color, fontFamily, fontSize}) => {
  const isActive = frame >= startTime && frame <= endTime;
  const opacity = isActive
    ? interpolate(frame, [startTime, startTime + 15], [0, 1], {extrapolateLeft: 'clamp'})
    : 0;
  const y = isActive
    ? interpolate(frame, [startTime, startTime + 10], [100, 0], {extrapolateLeft: 'clamp'})
    : 0;
  const bgOpacity = isActive
    ? interpolate(frame, [startTime, startTime + 10], [0, 0.8], {extrapolateLeft: 'clamp'})
    : 0;
  if (!subtitle) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 200,
        left: 100,
        right: 100,
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.4,
        textAlign: 'center',
        color,
        textShadow: '0 2px 6px rgba(0,0,0,0.4)',
        padding: '0 30px',
        backgroundColor: `rgba(15, 76, 58, ${bgOpacity})`,
        borderRadius: 16,
        backdropFilter: 'blur(10px)',
        textAlign: 'right',
      }}
    >
      {subtitle}
    </div>
  );
};

const HighlightBox: React.FC<{frame: number; accentColor: string; fontFamily: string}> = ({frame, accentColor, fontFamily}) => {
  const opacity = interpolate(frame, [200, 230], [0, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        padding: '12px 30px',
        background: `linear-gradient(135deg, ${accentColor} 0%, #ffcc00 100%)`,
        borderRadius: 30,
        fontFamily,
        fontWeight: 700,
        fontSize: 28,
        color: '#0d3b2e',
        boxShadow: `0 4px 15px ${accentColor}55`,
      }}
    >
      استمر معنا في الدرس التالي!
    </div>
  );
};

export const ArabicMotionLesson: React.FC<ArabicMotionLessonProps> = ({
  title = 'درس جديد',
  subtitle,
  srtContent = '',
  audioSrc,
  backgroundColor = '#0f4c3a',
  textColor = '#ffffff',
  accentColor = '#ffd700',
  fontFamily = 'Cairo, sans-serif',
  fontSize = 48,
  showCharacter = true,
  showTitle = true,
  showSubtitles = true,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const subtitles = parseSRT(srtContent);
  const currentSubtitle = subtitles.find(s => frame >= s.start && frame <= s.end);

  return (
    <AbsoluteFill>
      <AnimatedBackground color={backgroundColor} />
      {showTitle && <Title frame={frame} title={title} color={textColor} fontFamily={fontFamily} />}
      {showCharacter && <TeacherCharacter frame={frame} />}
      {showSubtitles && currentSubtitle && (
        <LessonContent
          subtitle={currentSubtitle.text}
          frame={frame}
          startTime={currentSubtitle.start}
          endTime={currentSubtitle.end}
          color={textColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
        />
      )}
      {frame > 240 && <HighlightBox frame={frame} accentColor={accentColor} fontFamily={fontFamily} />}
      {audioSrc && <Audio src={audioSrc} />}
    </AbsoluteFill>
  );
};
