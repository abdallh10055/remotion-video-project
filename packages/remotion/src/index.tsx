import { Composition, registerRoot } from 'remotion';
import { SimpleVideo } from './SimpleVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SimpleVideo"
      component={SimpleVideo}
      durationInFrames={900} // 30 seconds at 30fps
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'Hello World',
        subtitle: 'Welcome to Video Studio',
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
      }}
    />
  );
};

registerRoot(RemotionRoot);
