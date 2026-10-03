# Video Operation Manager
مشروع أتمتة إنتاج فيديوهات الوثائقية بالعربية من الصوت فقط

## الملفات الصوتية المتوفرة
- a6.m4a
- a7.m4a  
- a8.m4a
- a9.m4a
- a10.m4a
- a11.m4a

## كيفية البدء

### GitHub Actions (الأفضل)
1. اضغط على زر "Run workflow" في صفحة Actions
2. سيبدأ المشروع:
   - تحويل الصوت إلى SRT (Whisper)
   - بناء الفيديو (Remotion)  
   - ضغط الفيديو (FFmpeg)
   - رفع النتيجة كـ Artifact

### محلياً (للاختبار)
```bash
pip install -r requirements.txt
python scripts/transcribe_arabic.py
cd remotion && npm install && npm run build
```

## بنية المشروع
```
video_operation_manager/
├── require_sounds/        # ملفات الصوت (6 ملفات)
├── srt_output/            # ملفات SRT المُولدة
├── scripts/
│   └── transcribe_arabic.py
├── remotion/
│   ├── src/index.tsx
│   ├── src/ArabicMotionLesson.tsx
│   ├── scripts/build.js
│   └── package.json
├── .github/workflows/
│   └── video_pipeline.yml
└── README.md
```

## حدود الموارد
- الحد الأقصى للوقت: 90 دقيقة
- الحد الأقصى للذاكرة: 7 GB RAM
- الحد الأقصى للتخزين: 14 GB SSD