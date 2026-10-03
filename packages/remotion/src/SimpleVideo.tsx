import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export interface SimpleVideoProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const SimpleVideo: React.FC<SimpleVideoProps> = ({
  title = 'Hello World',
  subtitle = 'Welcome to Video Studio',
  backgroundColor = '#0f172a',
  textColor = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const duration = 30;
  const totalFrames = duration * fps;

  // Title animation - fade in and scale
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleScale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle animation - slide up and fade in
  const subtitleOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleY = interpolate(frame, [15, 45], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ending fade out
  const endingOpacity = interpolate(frame, [totalFrames - 30, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #1e3a8a 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: endingOpacity,
      }}
    >
      {/* Animated background circles */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          top: '10%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          bottom: '10%',
          right: '10%',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* Main content */}
      <div
        style={{
          zIndex: 10,
          textAlign: 'center',
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          transition: 'all 0.1s ease-out',
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: textColor,
            margin: 0,
            marginBottom: 20,
            textShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            letterSpacing: '-2px',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            textShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            fontWeight: 300,
            letterSpacing: '1px',
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Animated accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: '30%',
          width: 200,
          height: 4,
          background: `linear-gradient(90deg, transparent, #fbbf24, transparent)`,
          borderRadius: 2,
          opacity: interpolate(frame, [10, 60], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />

      {/* Floating particles effect */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
            top: `${20 + i * 15}%`,
            left: `${10 + i * 18}%`,
            opacity: interpolate(frame, [0, 20, totalFrames - 20, totalFrames], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `translateY(${interpolate(frame, [0, totalFrames], [0, -200], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}px)`,
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </AbsoluteFill>
  );
};
