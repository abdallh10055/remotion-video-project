#!/usr/bin/env node
/**
 * Build script for Remotion videos
 * Reads SRT files and generates corresponding video files
 */

const { renderMedia } = require('@remotion/cli/renderer');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const SRT_DIR = path.join(BASE_DIR, 'srt_output');
const OUT_DIR = path.join(__dirname, 'out');
const PUBLIC_ASSETS = path.join(BASE_DIR, 'projects_for_kyfanoud', 'kayfa-naoud-remotion-assets', 'public', 'assets');

// Create output directory
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('🚀 بدء بناء الفيديوهات...');

async function buildVideos() {
  if (!fs.existsSync(SRT_DIR)) {
    console.log('❌ لا توجد ملفات SRT. شغل أولاً: python scripts/transcribe_arabic.py');
    process.exit(1);
  }
  
  // نسخ الأصول
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const assetsDest = path.join(publicDir, 'assets');
  if (fs.existsSync(PUBLIC_ASSETS)) {
    const walk = (dir, dest) => {
      fs.readdirSync(dir).forEach(file => {
        const srcPath = path.join(dir, file);
        const destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          walk(srcPath, destPath);
        } else {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };
    walk(PUBLIC_ASSETS, assetsDest);
    console.log('✅ تم نسخ الأصول');
  }
  
  const srtFiles = fs.readdirSync(SRT_DIR)
    .filter(f => f.endsWith('.srt'))
    .map(f => f.replace('.srt', ''));
  
  if (srtFiles.length === 0) {
    console.log('❌ لا توجد ملفات SRT للبناء');
    process.exit(1);
  }
  
  console.log(`📂 وجدت ${srtFiles.length} ملف SRT: ${srtFiles.join(', ')}`);
  
  for (const srtName of srtFiles) {
    const videoName = `${srtName}.mp4`;
    const videoPath = path.join(OUT_DIR, videoName);
    
    console.log(`\n🎬 جاري بناء الفيديو: ${srtName}`);
    
    try {
      const { renderFile } = require('@remotion/cli/renderer');
      
      await renderFile({
        entryPoint: path.join(__dirname, '..', 'src', 'index.tsx'),
        outputFile: videoPath,
        envPrefix: {
          VIDEO_NAME: srtName
        },
        // تغيير الإعدادات للـ Shorts (9:16)
        width: 1080,
        height: 1920,
        fps: 30,
        // تحسين الضغط
        codec: 'h264',
        bitrate: 4000,
      });
      
      const stats = fs.statSync(videoPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`✅ تم حفظ الفيديو: ${videoName} (${sizeMB} MB)`);
      
      if (stats.size > 500 * 1024 * 1024) {
        console.warn('⚠️ حجم الفيديو يتجاوز 500MB، سيتم ضغطه إضافياً');
      }
    } catch (err) {
      console.error(`❌ فشل في الفيديو ${srtName}:`, err.message);
    }
  }
  
  console.log('\n📊 تم بناء الفيديوهات جميعها!');
}

buildVideos().catch(e => {
  console.error('❌ خطأ في البناء:', e);
  process.exit(1);
});