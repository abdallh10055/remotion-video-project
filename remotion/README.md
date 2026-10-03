# 🎬 Remotion Video Builder

## ماذا يعني؟
هذا المشروع يستخدم منصة Remotion لتحويل النصوص والصوت إلى فيديوهات موشن جرافيكس احترافية.

## كيفية الاستخدام

### التحضير
```bash
cd remotion
npm install
```

### بناء الفيديو
```bash
# الأسلوب 1: تلقائي (يبني كل ملفات SRT)
npm run build

# الأسلوب 2: فيديو مفرد
npx remotion render src/index.tsx Out/MY_VIDEO.mp4 -s YOUR_SRT_NAME
```

## الإعدادات الحالية
- **الأبعاد**: 1080x1920 (للـ Shorts)
- **الإطارات في الثانية**: 30
- **جودة الفيديو**: 4000 kbps
- **جودة الصوت**: 128 kbps AAC

## الخلفية (Background)
- اللون الأساسي: `#0f4c3a` (أخضر داكن)
- اللون الثانوي: `#1a6b4a` (أخضر فاتح)
- اللون المميز: `#ffd700` (ذهبي)

## بنية الملفات
```
remotion/
├── src/
│   ├── index.tsx          # نقطة الدخول
│   └── ArabicMotionLesson.tsx  # مكون الفيديو
├── public/
│   └── assets/            # الصور والشكل
├── scripts/
│   └── build.js           # سكربت البناء
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── README.md
```