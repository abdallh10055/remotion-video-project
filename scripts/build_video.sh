#!/bin/bash
set -e

AUDIO_FILE="$1"
SRT_FILE="$2"
OUTPUT_FILE="$3"
TITLE="${4:-درس جديد}"

if [ ! -f "$AUDIO_FILE" ] || [ ! -f "$SRT_FILE" ]; then
    echo "Usage: $0 <audio.m4a> <subtitles.srt> <output.mp4> [title]"
    exit 1
fi

# إنشاء خلفية متحركة باستخدام FFmpeg
# خلفية باللون الأخضر الداكن مع تأثيرات ضوئية
ffmpeg -y -f lavfi -i "color=c=0x0f4c3a:s=1080x1920:d=1" \
    -filter_complex "\
        [0:v]format=rgba,geq=0:0:0:0.8[bg]; \
        [0:v]geq=0:0:0:0.9[bg2]; \
        [0:v]geq=0:0:0:0.7[bg3]; \
        [bg][bg2]fade=t=in:st=0:d=1,fade=t=out:st=30:d=1[out]" \
    -frames:v 1 temp_bg.png 2>/dev/null || true

# بناء الفيديو مع الصوت والنصوص
ffmpeg -y -i "$AUDIO_FILE" \
    -f lavfi -i "color=c=0x0f4c3a:s=1080x1920:d=1" \
    -vf "subtitles='$SRT_FILE':charenc=utf-8:force_style='FontName=Cairo,FontSize=48,Bold=1,Outline=2,Shadow=1'", \
       "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k \
    -movflags +faststart -shortest "$OUTPUT_FILE"

echo "✅ تم إنشاء الفيديو: $OUTPUT_FILE"