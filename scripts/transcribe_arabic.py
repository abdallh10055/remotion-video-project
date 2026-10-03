#!/usr/bin/env python3
"""
Arabic Audio-to-Video Pipeline
Stage 1: Transcribe audio to SRT
"""

import os
import sys
import json
from pathlib import Path

def format_timestamp(seconds: float) -> str:
    """Convert seconds to SRT timestamp."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def main():
    base_dir = Path(__file__).parent.parent
    audio_dir = base_dir / "require_sounds"
    srt_dir = base_dir / "srt_output"
    
    srt_dir.mkdir(exist_ok=True)
    
    # Find all audio files
    audio_files = []
    for ext in ['*.m4a', '*.mp3', '*.wav', '*.aac']:
        audio_files.extend(audio_dir.glob(ext))
    
    if not audio_files:
        print(f"❌ لا توجد ملفات صوتية في: {audio_dir}")
        sys.exit(1)
    
    print(f"🎙️  وجدت {len(audio_files)} ملف صوت")
    
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("❌ تثبيت faster-whisper غير متوفر")
        print("   sh: pip install faster-whisper torch")
        sys.exit(1)
    
    model = WhisperModel("small", device="cpu", compute_type="int8")
    
    success = 0
    for audio_file in sorted(audio_files):
        srt_path = srt_dir / f"{audio_file.stem}.srt"
        
        print(f"⏳ جاري تحويل: {audio_file.name}")
        
        try:
            segments, _ = model.transcribe(
                str(audio_file),
                language="ar",
                vad_filter=True,
                temperature=0.0
            )
            
            with open(srt_path, "w", encoding="utf-8") as f:
                for i, seg in enumerate(segments, 1):
                    f.write(f"{i}\n")
                    f.write(f"{format_timestamp(seg.start)} --> {format_timestamp(seg.end)}\n")
                    f.write(f"{seg.text.strip()}\n\n")
            
            print(f"✅ حفظ: {srt_path.name}")
            success += 1
        except Exception as e:
            print(f"❌ فشل: {audio_file.name} - {e}")
    
    print(f"\n📊 انتهى: {success}/{len(audio_files)} تمت معالجتها")
    return 0 if success == len(audio_files) else 1


if __name__ == "__main__":
    sys.exit(main())