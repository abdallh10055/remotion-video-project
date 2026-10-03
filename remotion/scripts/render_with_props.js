#!/usr/bin/env node
/**
 * Render Remotion video with props from JSON file
 * Usage: node scripts/render_with_props.js [props.json] [output.mp4]
 */

const {renderMedia} = require('@remotion/cli/renderer');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const propsPath = process.argv[2] || path.join(BASE_DIR, 'props', 'video_props.json');
const outputPath = process.argv[3] || path.join(BASE_DIR, 'out', 'video.mp4');

if (!fs.existsSync(propsPath)) {
  console.error(`❌ Props file not found: ${propsPath}`);
  console.log('Creating default props...');
  
  const defaultProps = {
    title: 'درس جديد',
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
  };
  
  const propsDir = path.dirname(propsPath);
  if (!fs.existsSync(propsDir)) {
    fs.mkdirSync(propsDir, {recursive: true});
  }
  fs.writeFileSync(propsPath, JSON.stringify(defaultProps, null, 2));
  console.log(`✅ Default props created at: ${propsPath}`);
}

const props = JSON.parse(fs.readFileSync(propsPath, 'utf-8'));
console.log('📋 Props:', JSON.stringify(props, null, 2));

// Ensure output directory exists
const outDir = path.dirname(outputPath);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, {recursive: true});
}

console.log(`\n🎬 Rendering video to: ${outputPath}`);

renderMedia({
  entryPoint: path.join(BASE_DIR, 'src', 'index.tsx'),
  outputFile: outputPath,
  props: props,
  codec: 'h264',
  crf: 18,
  concurrency: 2,
  onProgress: ({progress}) => {
    process.stdout.write(`\r⏳ Rendering: ${Math.round(progress * 100)}%`);
  },
})
  .then(() => {
    console.log(`\n✅ Video rendered: ${outputPath}`);
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`📦 Size: ${sizeMB} MB`);
  })
  .catch((err) => {
    console.error(`\n❌ Render failed:`, err.message);
    process.exit(1);
  });
