import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Simple render script for testing
const projectDir = process.cwd();
const outputDir = path.join(projectDir, 'out');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Starting render of SimpleVideo...');
console.log(`📁 Output directory: ${outputDir}`);

try {
  const cmd = `npx remotion render src/index.tsx SimpleVideo out/simple-video.mp4 --concurrency=2`;
  console.log(`\n🚀 Executing: ${cmd}\n`);
  execSync(cmd, { cwd: projectDir, stdio: 'inherit' });
  console.log('\n✅ Render completed successfully!');
} catch (error) {
  console.error('❌ Render failed:', error);
  process.exit(1);
}
