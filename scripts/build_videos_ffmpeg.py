#!/usr/bin/env python3
"""
FFmpeg Video Builder - Arabic Motion Graphics
Creates 9:16 vertical videos from audio + SRT with proper Arabic typography
"""

import os
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
AUDIO_DIR = BASE_DIR / "require_sounds"
SRT_DIR = BASE_DIR / "srt_output"
OUT_DIR = BASE_DIR / "output_videos"
ASSETS_DIR = BASE_DIR / "projects_for_kyfanoud" / "kayfa-naoud-remotion-assets" / "public" / "assets"

# ألوان القناة
GREEN_PRIMARY = "0x0f4c3a"  # أخضر داكن
GREEN_SECONDARY = "0x1a6b4a"  # أخضر فاتح
GOLD_ACCENT = "0xffd700"
WHITE = "0xffffff"

def run_cmd(cmd, description=""):
    """Run shell command."""
    print(f"▶️  {description}" if description else "")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Error: {result.stderr[:500]}")
        return False
    return True


def build_video(audio_file: str, srt_file: str, output_file: str, title: str = ""):
    """Build video from audio and SRT."""
    
    # Duration of audio
    duration = get_audio_duration(audio_file)
    if not duration:
        print(f"❌ لا يمكن استخراج مدة الصوت")
        return False
    
    print(f"⏱️  المدة: {duration:.1f} ثانية")
    
    # FFmpeg command with Arabic subtitle support
    cmd = [
        "ffmpeg", "-y",
        "-i", audio_file,
        
        # Create animated gradient background
        "-f", "lavfi", "-i", (
            f"color=c={GREEN_PRIMARY}:s=1080x1920:d={duration}:rate=30,"
            f"colorchannelmixer=aa=0.9:r=0.1:g=0.05:b=0.02,"
            f"noise=alls=10:allf=t"
        ),
        
        # Video filters
        "-filter_complex", (
            f"[1:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuva420p[bg];"
            f"[bg]subtitles='{srt_file}':charenc=utf-8:"
            f"force_style='FontName=Cairo,FontSize=48,Bold=1,Outline=2,Shadow=0,Alignment=2,'[video]"
        ),
        
        "-map", "[video]",
        "-map", "0:a",
        
        # Video encoding - optimized for web
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-profile:v", "baseline",
        "-level", "3.0",
        "-pix_fmt", "yuv420p",
        
        # Audio encoding
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        
        # Optimizations
        "-movflags", "+faststart",
        
        output_file
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            print(f"❌ FFmpeg failed: {result.stderr[:500]}")
            return False
        return True
    except subprocess.TimeoutExpired:
        print("⏰ Timeout")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def get_audio_duration(audio_file: str) -> float:
    """Get audio duration in seconds."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", audio_file],
            capture_output=True, text=True
        )
        return float(result.stdout.strip()) if result.returncode == 0 else 0
    except:
        return 0


def main():
    OUT_DIR.mkdir(exist_ok=True)
    SRT_DIR.mkdir(exist_ok=True)
    
    srt_files = list(SRT_DIR.glob("*.srt"))
    if not srt_files:
        print("❌ لا توجد ملفات SRT")
        print("   شغل أولاً: python scripts/transcribe_arabic.py")
        return 1
    
    print(f"📂 وجدت {len(srt_files)} ملف SRT")
    
    success = 0
    for srt_file in sorted(srt_files):
        name = srt_file.stem
        
        # Find matching audio
        audio_file = AUDIO_DIR / f"{name}.m4a"
        if not audio_file.exists():
            for ext in ['mp3', 'wav', 'aac', 'm4a']:
                alt = AUDIO_DIR / f"{name}.{ext}"
                if alt.exists():
                    audio_file = alt
                    break
        
        if not audio_file.exists():
            print(f"⚠️  لا يوجد صوت لـ {name}")
            continue
        
        output_file = OUT_DIR / f"{name}.mp4"
        print(f"\n🎬 بناء: {name}")
        
        if build_video(str(audio_file), str(srt_file), str(output_file), name):
            size_mb = output_file.stat().st_size / 1024 / 1024
            print(f"✅ حفظ: {output_file.name} ({size_mb:.1f} MB)")
            success += 1
    
    print(f"\n📊 النجاح: {success}/{len(srt_files)} فيديو")
    return 0 if success > 0 else 1


if __name__ == "__main__":
    sys.exit(main())