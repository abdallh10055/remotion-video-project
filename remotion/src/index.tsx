import {Composition} from 'remotion';
import {ArabicMotionLesson} from './ArabicMotionLesson';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ArabicMotionLesson"
        component={ArabicMotionLesson}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'درس جديد',
          subtitle: 'مرحباً بكم في قناة عقلاني',
          srtContent: '',
          audioSrc: '',
          backgroundColor: '#0f4c3a',
          textColor: '#ffffff',
          accentColor: '#ffd700',
          fontFamily: 'Cairo, sans-serif',
          fontSize: 48,
          showCharacter: true,
          showTitle: true,
          showSubtitles: true,
        }}
      />
    </>
  );
};
