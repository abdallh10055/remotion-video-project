# Video Operation Manager - Arabic Motion Videos

🎬 **أتمتة إنتاج فيديوهات الوثائقية بالعربية من الصوت فقط**

## المميزات
- تحويل تلقائي: صوت مسجل → SRT → فيديو احترافي
- يعمل بالكامل على GitHub Actions (لا يضطر جهازك)
- يدعم الموشن جرافيكس والأنيميشن
- ضغط ذكي لل bandwidth (500MB كحد أقصى)

## البدء السريع

### الطريقة الأسهل: GitHub Actions
1. اضغط `Generate workflows from template` في GitHub
2. ضع ملفات الصوت في `require_sounds/`
3. شغّل الـ workflow يدوياً أو تركه يشتغل عند كل push
4. لاقي الفيديو في `Actions > Artifacts`

### للتطوير محلياً
```bash
# محاكاة الـ workflow محلياً
python scripts/transcribe_arabic.py  # صوت → SRT
cd remotion && npm install && npm run build  # SRT → فيديو
```

## بنية المشروع
```
video_operation_manager/
├── require_sounds/           # ملفات الصوت (m4a/mp3)
├── srt_output/               # الناتج: ملفات SRT
├── scripts/
│   └── transcribe_arabic.py  # كود التحويل
├── remotion/
│   ├── src/                  # مكونات React للفيديو
│   ├── public/assets/        # الصور والشكل
│   ├── package.json           # Dependencies
│   └── remotion.config.ts     # إعدادات الفيديو
├── .github/workflows/
│   └── video_pipeline.yml    # workflow CI/CD
└── README.md
```

## التخصيص
- عدل `remotion/remotion.config.ts` لتغيير الأبعاد أو الفريم رايت
- عدل `remotion/src/ArabicMotionLesson.tsx` لإضافة محتوى جديد
- استخدم assets من `projects_for_kyfanoud/kayfa-naoud-remotion-assets/`

## نصائح
- كل فيديو يصلح لمدة 60-90 ثانية
- استخدم صيغة M4A أو MP3 ذو جودة جيدة
- الـ workflow يتوقف بعد 90 دقيقة لو احتجت أطول