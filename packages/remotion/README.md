# Simple 30-Second Video Component

A basic Remotion composition showcasing:
- Title animation (fade in + scale)
- Subtitle animation (slide up + fade in)
- Animated background elements
- Floating particles effect
- Smooth ending fade out

## Usage

### View in Remotion Studio
```bash
npm run dev
```

### Render to MP4
```bash
npm run render
```

### Custom props
You can pass custom properties when rendering:
```bash
npx remotion render src/index.tsx SimpleVideo out/custom.mp4 \
  --props '{"title":"Custom Title","subtitle":"Custom Subtitle"}'
```

## Structure
- **Title Section**: Animates in during first second with scale effect
- **Subtitle Section**: Slides up from bottom and fades in at 0.5s
- **Background Effects**: Animated circles and particles
- **Duration**: 30 seconds (900 frames at 30fps)
- **Resolution**: 1080x1920 (vertical/mobile format)

## Animation Timeline
- 0-1s: Title fade in and scale
- 0.5-1.5s: Subtitle slides up
- Throughout: Particles float up
- 28-30s: Fade out to black
