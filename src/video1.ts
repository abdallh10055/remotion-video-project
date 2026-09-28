/**
 * عقلانة — الدرس الثالث
 * الذكاء الاصطناعي في الحياة اليومية والصناعة
 *
 * 1920×1080 · 30fps · 14:33 (26190 frames)
 *
 * الاستخدام:
 *   1. أنشئ مشروعاً: npm create video@latest
 *   2. ضع هذا الملف في src/AqlanaLesson.tsx
 *   3. (اختياري) ضع صوت الدرس: public/lesson.mp3 ثم فعّل سطر Audio
 *   4. npx remotion render AqlanaLesson out/aqlana-lesson.mp4
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  registerRoot,
  Composition,
  // Audio,
  // staticFile,
} from "remotion";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_FRAMES = 14 * 60 * 30 + 33 * 30;

const palette = {
  bg: "#0B1018",
  bg2: "#121A28",
  bg3: "#182233",
  fg: "#F3F5F8",
  muted: "#9AA6B5",
  subtle: "#6D7A8C",
  accent: "#5CE0B4",
  accentDim: "rgba(92, 224, 180, 0.16)",
  warn: "#E8A87C",
  line: "rgba(243, 245, 248, 0.10)",
  lineStrong: "rgba(243, 245, 248, 0.18)",
};

const fonts = {
  display: '"Cairo", "IBM Plex Sans Arabic", sans-serif',
  body: '"IBM Plex Sans Arabic", "Cairo", sans-serif',
};

type Caption = { start: number; end: number; text: string };
const captions: Caption[] = [
  {
    "start": 0.59,
    "end": 4.13,
    "text": "السلام عليكم ورحمة الله وبركاته أهلا بكم في"
  },
  {
    "start": 4.13,
    "end": 7.95,
    "text": "الدرس الثالث من الوحدة وحدة الذكاء الاصطناعي في"
  },
  {
    "start": 7.95,
    "end": 12.85,
    "text": "الحياة اليومية والصناعة في الدرس هذا سنتعرف على"
  },
  {
    "start": 12.85,
    "end": 17.85,
    "text": "مفاهيم مهمة في الحياة اليومية وفي الصناعة لإستخدامنا"
  },
  {
    "start": 17.85,
    "end": 21.07,
    "text": "للالذكاء الاصطناعي إن شاء الله في الفيديو هذا"
  },
  {
    "start": 21.75,
    "end": 26.93,
    "text": "سنشرح الدرس بكل بساطة وسهولة وإن شاء الله"
  },
  {
    "start": 26.93,
    "end": 31.15,
    "text": "سنركز على المفاهيم الصعبة أنا عبدالله جريتم وهذه"
  },
  {
    "start": 31.15,
    "end": 36.63,
    "text": "قناتي عقلانة نحن نستخدم الذكاء الاصطناعي في حالتنا"
  },
  {
    "start": 36.63,
    "end": 42.79,
    "text": "اليومية وليس من قريب نستخدمها منذ زمان ولكننا"
  },
  {
    "start": 42.79,
    "end": 46.73,
    "text": "لم نكن نعرف أنها الذكاء الاصطناعي كنا نستخدمها"
  },
  {
    "start": 46.73,
    "end": 51.73,
    "text": "في خدمات اليومية كثير فمثلا منصة فيديو مثل"
  },
  {
    "start": 51.73,
    "end": 56.87,
    "text": "فيسبوك أو يوتيوب تستخدم الذكاء الاصطناعي لترشح لك"
  },
  {
    "start": 56.87,
    "end": 61.67,
    "text": "وتصنف لك فيديوهات تناسب احتياجاتك في الفيديوهات التي"
  },
  {
    "start": 61.67,
    "end": 66.47,
    "text": "تحبها أنت فقط وكمان ممكن نعتمد عليه في"
  },
  {
    "start": 66.47,
    "end": 71.65,
    "text": "المساعد الصوتي أن تسأل المساعد الصوتي في تليفونك"
  },
  {
    "start": 71.65,
    "end": 77.43,
    "text": "أن ينفذ لك مهمة معينة أو يحول لك"
  },
  {
    "start": 77.43,
    "end": 84.21,
    "text": "الصوت لنص أو نستخدم الذكاء الاصطناعي في الترجمة"
  },
  {
    "start": 84.21,
    "end": 88.81,
    "text": "مثل ترجمة جوجل تدله نص يحوله لك لأي"
  },
  {
    "start": 88.81,
    "end": 93.55,
    "text": "لغة تانية أما في الصناعة فنستخدم الذكاء الاصطناعي"
  },
  {
    "start": 93.55,
    "end": 98.81,
    "text": "فعشان نتنبأ ونتوقع الآلات هتعطل امتى وايه أسباب"
  },
  {
    "start": 98.81,
    "end": 105.21,
    "text": "التعطيل ونحلل أدائها وكمان في التجارة والتوصيل عشان"
  },
  {
    "start": 105.21,
    "end": 110.01,
    "text": "نحسن مثلا المسارات التوصيل ونخلي الذكاء الاصطناعي يقترح"
  },
  {
    "start": 110.01,
    "end": 116.03,
    "text": "لنا طريق أكثر وكمان سهل في الوصول وكمان"
  },
  {
    "start": 116.03,
    "end": 119.73,
    "text": "ممكن نستخدم الذكاء الاصطناعي في الرعاية الصحية وفي"
  },
  {
    "start": 119.73,
    "end": 124.89,
    "text": "المستشفيات عن طريق مثلا أن نحلل صور للشاعات"
  },
  {
    "start": 124.89,
    "end": 129.789,
    "text": "الطبية باستخدام الذكاء الاصطناعي فالذكاء الاصطناعي مش موجود"
  },
  {
    "start": 129.789,
    "end": 133.01,
    "text": "من يوم وليلة الذكاء الاصطناعي موجود من زمان"
  },
  {
    "start": 133.01,
    "end": 137.99,
    "text": "بس احنا معرفناهوش غير لما شفنا شات جي"
  },
  {
    "start": 137.99,
    "end": 142.21,
    "text": "بي تي ولأنها نماذج الذكاء الاصطناعي"
  },
  {
    "start": 142.21,
    "end": 144.69,
    "text": "التوليدية اللي هي بتولد نصوص وصور وصوت زي"
  },
  {
    "start": 144.69,
    "end": 149.51,
    "text": "ما اتكلمنا في الدرس التاني ولكن الكتاب بيقولك"
  },
  {
    "start": 149.51,
    "end": 153.41,
    "text": "وبيحذرك من نقطة مهمة أن الذكاء الاصطناعي ممكن"
  },
  {
    "start": 153.41,
    "end": 157.85,
    "text": "يطلع أخطاء عادي خالص وبيقولك أن احنا لازم"
  },
  {
    "start": 158.55,
    "end": 162.71,
    "text": "نتحقق من مخرجات الذكاء الاصطناعي وخصوصا كمان لما"
  },
  {
    "start": 162.71,
    "end": 169.71,
    "text": "بنستخدمه زي مثلا زي مثلا لما بنستخدمه في"
  },
  {
    "start": 169.71,
    "end": 175.45,
    "text": "الأخلاق أو الأشياء المتعلقة بالخلق مثلا زي تحكم"
  },
  {
    "start": 175.45,
    "end": 180.01,
    "text": "الذكاء الاصطناعي بأنظمة الصواريخ فمش من المعقول اللي"
  },
  {
    "start": 180.01,
    "end": 183.51,
    "text": "احنا نخلي الذكاء الاصطناعي يتحكم في أنظمة الصواريخ"
  },
  {
    "start": 183.51,
    "end": 187.89,
    "text": "أو مثلا ندخل الذكاء الاصطناعي في حياتنا الشخصية"
  },
  {
    "start": 187.89,
    "end": 193.35,
    "text": "أو في القانون مثلا والسؤال الرئيسي بتاع الدرس"
  },
  {
    "start": 193.35,
    "end": 196.69,
    "text": "دا واللي تقدر تتعرف عليه بعدما تخلص الدرس"
  },
  {
    "start": 196.69,
    "end": 199.33,
    "text": "واحنا بنستخدم الزكاة للصنائع في حياتنا في الحال"
  },
  {
    "start": 199.33,
    "end": 204.01,
    "text": "يومية ايه وفين الذكاء الاصطناعي في الصناعة"
  },
  {
    "start": 204.01,
    "end": 208.49,
    "text": "وايه الأشياء اللي الذكاء الاصطناعي بيعملها احسن من"
  },
  {
    "start": 208.49,
    "end": 213.59,
    "text": "الانسان وايه الأشياء اللي احنا لازم نحضر منها"
  },
  {
    "start": 213.59,
    "end": 217.87,
    "text": "واحنا بنستخدم الذكاء الاصطناعي إن شاء الله الكسم"
  },
  {
    "start": 217.87,
    "end": 221.65,
    "text": "الأول هو استخدام الذكاء الاصطناعي في الحياة اليومية"
  },
  {
    "start": 223.28,
    "end": 227.24,
    "text": "ونحن كما شرحنا أن هناك تقنيات زكاية اصطناعية"
  },
  {
    "start": 227.24,
    "end": 231.64,
    "text": "كثيرة مستخدمة حولنا ولكننا لم نكن نأخذ بالنا"
  },
  {
    "start": 231.64,
    "end": 236.16,
    "text": "منها وقد جاء الكتاب المدرسي الثاني باكالوريا ليوضح"
  },
  {
    "start": 236.16,
    "end": 240.64,
    "text": "لنا هذه الأمور لدينا أربع خدمات شهيرة في"
  },
  {
    "start": 240.64,
    "end": 247.6,
    "text": "الحياة اليومية أولها أنظمة التوصية والأنظمة تتنبّأ بالتفضيلات"
  },
  {
    "start": 247.6,
    "end": 253.54,
    "text": "أو بالحاجات المفضلة التي يحبها الإنسان من خلال"
  },
  {
    "start": 253.54,
    "end": 261.16,
    "text": "سلوكه مثلا عندما تضع لايك في فيسبوك على"
  },
  {
    "start": 261.16,
    "end": 266.58,
    "text": "منشور أو تتابع إنفلونسر أو تعمل شير لفيديو"
  },
  {
    "start": 266.58,
    "end": 271.28,
    "text": "فهذا يجعل الذكاء الاصطناعي تجلب لك محتوى منه"
  },
  {
    "start": 271.28,
    "end": 275.3,
    "text": "أكثر فهذا اسمه أنظمة التوصية يجلب لك فيديوهات"
  },
  {
    "start": 275.3,
    "end": 279.18,
    "text": "عن طريق أنظمة التوصية والفيديوهات هذه تكون مخصصة"
  },
  {
    "start": 279.18,
    "end": 283.58,
    "text": "لك أنت فقط مثلا نعطيك أمثلة مثل يوتيوب"
  },
  {
    "start": 283.58,
    "end": 291.2,
    "text": "وامازون وبرنامج سبوتيفاي وغيرها أما ثاني خدمة"
  },
  {
    "start": 291.2,
    "end": 296.28,
    "text": "شهيرة نستخدمها كل يوم تعتبر المساعدات الصوتية وهي"
  },
  {
    "start": 296.28,
    "end": 301.64,
    "text": "الذكاء الاصطناعي يتعرف على الصوت ويحوله لنص ويفهم"
  },
  {
    "start": 301.64,
    "end": 306.9,
    "text": "الأوامر مثلا عندما تقول للمساعدة جوجل أعمل لي"
  },
  {
    "start": 306.9,
    "end": 311.46,
    "text": "منبه لصحيني الساعة كذا فهي هذه الفكرة بالضبط"
  },
  {
    "start": 311.46,
    "end": 314.94,
    "text": "ومن ذلك أمثلة للكتاب مثل مساعد سيري في"
  },
  {
    "start": 314.94,
    "end": 320.68,
    "text": "أبل ومساعد جوجل عندنا في أندرويد الترجمة الآلية"
  },
  {
    "start": 320.68,
    "end": 327.32,
    "text": "ترجمة النصوص تلقائيا إلى لغات مختلفة يعني الترجمة"
  },
  {
    "start": 327.32,
    "end": 331.56,
    "text": "العادية التي نستخدمها مثل ترجمة جوجل الصوت النص"
  },
  {
    "start": 331.56,
    "end": 335.9,
    "text": "يتحول تلقائيا إلى لغات مختلفة عبر الذكاء الاصطناعي"
  },
  {
    "start": 335.9,
    "end": 340.26,
    "text": "مثل جوجل ترانسليت وديب إل وهذه برامج شهيرة"
  },
  {
    "start": 341.02,
    "end": 345.94,
    "text": "التعرف على الوجه هذه رابع خدمة أو تقنية"
  },
  {
    "start": 345.94,
    "end": 350.78,
    "text": "شهيرة نستخدمها كل يوم ونستخدمها كلما نفتح الهاتف"
  },
  {
    "start": 351.74,
    "end": 357.38,
    "text": "عندما نفتح الهاتف نقول لها بصمة الوجه بصمة"
  },
  {
    "start": 357.38,
    "end": 362.14,
    "text": "الوجه هي تقنية الذكاء الاصطناعي ولكننا لم نكن"
  },
  {
    "start": 362.14,
    "end": 366.2,
    "text": "نعلم ذلك وهذه الوقت تستخدم في التعرف على"
  },
  {
    "start": 366.2,
    "end": 369.9,
    "text": "الصور عندما تتحدث ChatGPT ويصنف"
  },
  {
    "start": 369.9,
    "end": 376.54,
    "text": "لك الصور ثاني استخدام الذكاء الاصطناعي هو الاستخدام"
  },
  {
    "start": 376.54,
    "end": 381.06,
    "text": "في الصناعة وأول خدمة شهيرة نستخدمها في الصناعة"
  },
  {
    "start": 381.06,
    "end": 386.72,
    "text": "هي الرعاية الصحية في الرعاية الصحية نستخدم الذكاء"
  },
  {
    "start": 386.72,
    "end": 391.44,
    "text": "الاصطناعي لتشخيص الصور مثل الكشف عن الأمراض من"
  },
  {
    "start": 391.44,
    "end": 396.12,
    "text": "صور الأشعة السينية تعطيه صور أشعة وهو يشخص"
  },
  {
    "start": 396.12,
    "end": 401.28,
    "text": "لك المرض ومثلا دعم اكتشاف الأدوية يساعدنا في"
  },
  {
    "start": 401.28,
    "end": 405.42,
    "text": "اكتشاف أدوية المرض معين أما في الزراعة فنتنبأ"
  },
  {
    "start": 405.42,
    "end": 409.7,
    "text": "بموعد الحصاد والكشف عن الأفات والأمراض في مجال"
  },
  {
    "start": 409.7,
    "end": 416.4,
    "text": "الزراعة نستخدمه لنرى موعد حصاد الزراعة عن طريق"
  },
  {
    "start": 416.4,
    "end": 420.82,
    "text": "معلومات الطقس ومعلومات أخرى والكشف عن الأفات والأمراض"
  },
  {
    "start": 420.82,
    "end": 428.22,
    "text": "من خلال صور النبات هو يعرف خصائص الصورة"
  },
  {
    "start": 428.22,
    "end": 433.24,
    "text": "وويتعرّف عليها ويكتشف لنا في الصورة الأمراض في"
  },
  {
    "start": 433.24,
    "end": 439.18,
    "text": "النبات ثالث مجال نستخدمه في الذكاء الاصطناعي هو"
  },
  {
    "start": 439.18,
    "end": 444.38,
    "text": "مجال التصنيع ونعمل فيه أتمتة فحص جودة المنتج"
  },
  {
    "start": 444.38,
    "end": 448.96,
    "text": "يعني بدل أن نتحقق من المنتج هل هناك"
  },
  {
    "start": 448.96,
    "end": 452.98,
    "text": "أخطاء أم لا نجعل الذكاء الاصطناعي تفعل هذا"
  },
  {
    "start": 452.98,
    "end": 458.72,
    "text": "عن طريق خاصية الأتمتة والأتمتة هي جعل الكمبيوتر"
  },
  {
    "start": 459.44,
    "end": 465.5,
    "text": "جعل الكمبيوتر يستخدم جعل الكمبيوتر ينفذ عدة مهام"
  },
  {
    "start": 465.5,
    "end": 476.16,
    "text": "بشكل آلي كامل بدون تدخل البشر وصيانة"
  },
  {
    "start": 476.16,
    "end": 482.02,
    "text": "التنبؤية من خلال أن نجعل الذكاء الاصطناعي يتنبأ"
  },
  {
    "start": 482.02,
    "end": 487.86,
    "text": "إحنا إمتى نعمل الصيانة للمكان والآلات إمتى أما"
  },
  {
    "start": 487.86,
    "end": 492.16,
    "text": "رابع مجال نستخدمه فيه الذكاء الاصطناعي هو الخدمات"
  },
  {
    "start": 492.16,
    "end": 496.66,
    "text": "اللوجستية ودية لها خاصة بالتجارة وإلى نحو ذلك"
  },
  {
    "start": 497.28,
    "end": 504.04,
    "text": "مثلا تحسين مسارات التوصيل ثالث قسم نشرحه اليوم"
  },
  {
    "start": 504.04,
    "end": 509.84,
    "text": "هو خصائص الذكاء الاصطناعي وإحتياجات الاستخدام وهنا نعرف"
  },
  {
    "start": 509.84,
    "end": 514.96,
    "text": "أي الأشياء للزكاية الصناعية يبرع فيها ويتفوق على"
  },
  {
    "start": 514.96,
    "end": 521.74,
    "text": "البشر الذكاء الاصطناعي يمتاز بأنه يقدر يعمل تصنيف"
  },
  {
    "start": 521.74,
    "end": 527.3,
    "text": "للصور والبيانات والأنماط وأنماط البيانات المختلفة بس البيانات"
  },
  {
    "start": 527.3,
    "end": 532.44,
    "text": "المعقدة لو مثلا ممكن يصنف لك ألف صورة"
  },
  {
    "start": 532.44,
    "end": 536.3,
    "text": "مثلا أنت تقول له أعوزك تصنف للصور بيه"
  },
  {
    "start": 536.3,
    "end": 539.82,
    "text": "الصور الشخصية وصور تعليمية هو يصنف لك ممكن"
  },
  {
    "start": 539.82,
    "end": 546.9,
    "text": "يصنف لك ألاف الصور تاني ميزة تجعل الزكاية"
  },
  {
    "start": 546.9,
    "end": 556.04,
    "text": "الصناعية يبرع فيها تاني ميزة تجعل الذكاء الاصطناعي"
  },
  {
    "start": 556.04,
    "end": 560.14,
    "text": "يتفوق على البشر في التعرف على الصور والأصوات"
  },
  {
    "start": 560.14,
    "end": 563.56,
    "text": "والنصوص بس بشكل بيانات ضخمة يعني يتعرف على"
  },
  {
    "start": 563.56,
    "end": 568.24,
    "text": "مئات وألاف الصور وبشكل دقيق وكمان يولد بعض"
  },
  {
    "start": 568.24,
    "end": 571.68,
    "text": "أنواع المحتوى يعني ممكن يولد صورة يولّد نصاً"
  },
  {
    "start": 571.68,
    "end": 576.72,
    "text": "أو يولد فيديو تالت ميزة للزكاية الصناعية هو"
  },
  {
    "start": 576.72,
    "end": 582.04,
    "text": "يقدر يعمل خاصية الاستدلال الاحتمالي يعني هو عنده"
  },
  {
    "start": 582.04,
    "end": 587.82,
    "text": "بيانات بس بيانات نقصة هو ممكن يتوقع نتيجة"
  },
  {
    "start": 587.82,
    "end": 591.28,
    "text": "احتمالية او شيء احتمالي بناء على البيانات دي"
  },
  {
    "start": 591.28,
    "end": 595.58,
    "text": "حتى لو هي نقصة ويقدر يتنبأ استنادا إلى"
  },
  {
    "start": 595.58,
    "end": 598.9,
    "text": "البيانات يعني استنادا إلى البيانات اللي عنده يعني"
  },
  {
    "start": 598.9,
    "end": 601.12,
    "text": "ما بيعملش من خياله هو كل حاجة من"
  },
  {
    "start": 601.12,
    "end": 606.36,
    "text": "البيانات تاني قسم في قسم خصائص الذكاء الاصطناعي"
  },
  {
    "start": 606.36,
    "end": 610.86,
    "text": "واحتياطات الاستخدام هو ايه الاشياء اللي احنا لازم"
  },
  {
    "start": 610.86,
    "end": 614.06,
    "text": "نحذر منها لما نستخدم الذكاء الاصطناعي احنا لما"
  },
  {
    "start": 614.06,
    "end": 618.14,
    "text": "نستخدم الذكاء الاصطناعي لازم نحذر من القرارات اللي"
  },
  {
    "start": 618.14,
    "end": 622.66,
    "text": "لها بعد أخلاقي يعني لما نستخدم الذكاء الاصطناعي"
  },
  {
    "start": 622.66,
    "end": 627.58,
    "text": "في ان هو يعمل توصية للناس اللي هتدخل"
  },
  {
    "start": 627.58,
    "end": 634.08,
    "text": "قسم العناية المركزة مثلا فالذكاء الاصطناعي ممكن يخطئ"
  },
  {
    "start": 634.08,
    "end": 637.7,
    "text": "فحالها فتؤدي إلى الموت فما ينفعش ان احنا"
  },
  {
    "start": 637.7,
    "end": 641.92,
    "text": "نستخدم الذكاء الاصطناعي في حالة اخلاقية تاني شيء"
  },
  {
    "start": 641.92,
    "end": 645.78,
    "text": "التعامل مع المعلومات الشخصية والبيانات الحساسة اللي انت"
  },
  {
    "start": 645.78,
    "end": 648.56,
    "text": "يجب تكون حذر بشأن المعلومات اللي انت بتدخلها"
  },
  {
    "start": 648.56,
    "end": 653.04,
    "text": "للزكاية الصناعية ما تدخلوش معلومات شخصية ومعلومات حساسة"
  },
  {
    "start": 653.04,
    "end": 658.5,
    "text": "ممكن تضر بيك ثالث شيء القرارات عليها تأثر"
  },
  {
    "start": 658.5,
    "end": 662.34,
    "text": "وتحديد المسؤولية عن نتائجها القرارات اللي ممكن تأثر"
  },
  {
    "start": 662.34,
    "end": 665.3,
    "text": "عليك وعلى مستقبلك مش لازم تخلص الذكاء الاصطناعي"
  },
  {
    "start": 665.3,
    "end": 668.9,
    "text": "هو اللي قرر مكانك وانا كان عندي تجربة"
  },
  {
    "start": 668.9,
    "end": 676.04,
    "text": "خلتني افقد شهور واضيع شهور من التعلم اللي"
  },
  {
    "start": 676.04,
    "end": 681.76,
    "text": "ما نفعنيش بشكل كويس انا استخدمت خلاتي الزكاية"
  },
  {
    "start": 681.76,
    "end": 687.56,
    "text": "الصناعية اقترح لي مكتبة في بايثون اتعلمها واتعلمتها"
  },
  {
    "start": 687.56,
    "end": 691.22,
    "text": "وتمت نتعلم فيها وفي الاخر اتضح لي ان"
  },
  {
    "start": 691.22,
    "end": 697.3,
    "text": "المكتبة دي مش بتناسبني ولا بتناسب احتياجاتي فوقتها"
  },
  {
    "start": 697.3,
    "end": 701.02,
    "text": "ندمت وقررت ان ما عادش نستخدم الذكاء الاصطناعي بطريقة"
  },
  {
    "start": 701.02,
    "end": 706.88,
    "text": "مطلقة رابع شيء هي دقة النتائج خليك فاكر"
  },
  {
    "start": 706.88,
    "end": 711.3,
    "text": "ان الذكاء الاصطناعي ممكن يدخلك معلومات غلط بناء"
  },
  {
    "start": 711.3,
    "end": 713.86,
    "text": "على بيانات التدريب مثلا ممكن بيانات التدريب اللي"
  },
  {
    "start": 713.86,
    "end": 717.44,
    "text": "عنده ما تكونش كافية او ممكن بيانات التدريب"
  },
  {
    "start": 717.44,
    "end": 721.08,
    "text": "تكون متحيزة يعني ممكن بيانات التدريب اللي عنده"
  },
  {
    "start": 721.08,
    "end": 724.86,
    "text": "تكون متحيزة لرأي معين يعني لو سألته مين"
  },
  {
    "start": 724.86,
    "end": 730.2,
    "text": "اللي انتصر في اكتوبر 1973 ممكن يجاوبك بطريقة"
  },
  {
    "start": 730.2,
    "end": 733.32,
    "text": "انت ما تتوقعهاش اصلا على حسب بيانات التدريب اللي"
  },
  {
    "start": 733.32,
    "end": 738.84,
    "text": "عنده ممكن يولد معلومات غير صحيحة ممكن مثلا"
  },
  {
    "start": 738.84,
    "end": 742.38,
    "text": "يستخدم بيانات او صور مش من القانون اللي"
  },
  {
    "start": 742.38,
    "end": 748.7,
    "text": "هو يستخدمه ممكن يطلع لك نتيجة نتيجة بس"
  },
  {
    "start": 748.7,
    "end": 753.46,
    "text": "مش واضحة هو طلعها ازاي بمعنى اخر اذا"
  },
  {
    "start": 753.46,
    "end": 757.14,
    "text": "الذكاء الاصطناعي ممكن يطلع لك رد او نتيجة"
  },
  {
    "start": 757.14,
    "end": 762.16,
    "text": "وانت ولا حد فاهم هو طلعها ازاي ودي"
  },
  {
    "start": 762.16,
    "end": 767.9,
    "text": "اسمها مشكلة الصندوق الأسود ومعناها انه عندما يكون"
  },
  {
    "start": 767.9,
    "end": 771.02,
    "text": "من غير الواضح كيف توصل الذكاء الاصطناعي الى"
  },
  {
    "start": 771.02,
    "end": 774.96,
    "text": "حكمة يعني ببساطة الذكاء الاصطناعي بيديك رد او"
  },
  {
    "start": 774.96,
    "end": 778.64,
    "text": "بيديك صورة او بيديك بيانات مش من الواضح"
  },
  {
    "start": 778.64,
    "end": 784,
    "text": "اللي هو يديها لك ازاي وده مشكلة شهيرة"
  },
  {
    "start": 784,
    "end": 789.92,
    "text": "جدا حتى المبرمجين والمهندسين اللي عملوا الذكاء الاصطناعي"
  },
  {
    "start": 789.92,
    "end": 793.26,
    "text": "ما بيقدروش يعرفوا المشكلة دي هي تحصلت ازاي"
  },
  {
    "start": 793.26,
    "end": 797.74,
    "text": "او الرد ده طلع ازاي والمشكلة دي عالجناها ببعض"
  },
  {
    "start": 797.74,
    "end": 802.48,
    "text": "بعض الادوات يعني خليك فاكر ان الذكاء الاصطناعي"
  },
  {
    "start": 802.48,
    "end": 805.7,
    "text": "ممكن يطلع لك رد او نتيجة بس مش"
  },
  {
    "start": 805.7,
    "end": 810.14,
    "text": "واضح جابها ازاي أو جابها منين الفكرة الرئيسية"
  },
  {
    "start": 810.14,
    "end": 813.2,
    "text": "بتاعت الدرس اللي هيتخليك فاكرها طول التدريبات وانت"
  },
  {
    "start": 813.2,
    "end": 817.88,
    "text": "بتحلها ان الذكاء الاصطناعي بارع في ايجاد انماط"
  },
  {
    "start": 817.88,
    "end": 820.84,
    "text": "من البيانات يعني بارع اللي هو يتعلم من"
  },
  {
    "start": 820.84,
    "end": 826.2,
    "text": "البيانات وشاطر جدا لكن حكم البشري لا يزال"
  },
  {
    "start": 826.2,
    "end": 830.2,
    "text": "ضروريا يعني البشر ليهم دور ولازم ياخدوا رأي"
  },
  {
    "start": 830.2,
    "end": 835.02,
    "text": "ويفكروا في نتيجة الذكاء الاصطناعي وكمان خصوصا بالاشياء"
  },
  {
    "start": 835.02,
    "end": 840.62,
    "text": "دي تتعلق بالاخلاق والخصوصية والمسؤولية في نهاية الدرس"
  },
  {
    "start": 840.62,
    "end": 843.32,
    "text": "ده احب اوضحلك ان ان شاء الله السنة"
  },
  {
    "start": 843.32,
    "end": 846.04,
    "text": "دي هتكون اسهل سنة بالنسبة لك مع مادة"
  },
  {
    "start": 846.04,
    "end": 850.44,
    "text": "البرمجة وان شاء الله هنزل لك التقييمات وحل"
  },
  {
    "start": 850.44,
    "end": 854.4,
    "text": "تدريبات الكتب الخارجية وان شاء الله في الوصف"
  },
  {
    "start": 854.4,
    "end": 857.9,
    "text": "بتاع الفيديو اكتب صلى على النبي وان شاء"
  },
  {
    "start": 857.9,
    "end": 862.64,
    "text": "الله هنكسر حسنات انا وياك وشارك المعلومات دي"
  },
  {
    "start": 862.64,
    "end": 865.56,
    "text": "مع اي حد فالهدف من انشاء هذه القناة"
  },
  {
    "start": 865.56,
    "end": 870.66,
    "text": "هو المشاركة فقط لا الارباح والسلام عليكم ورحمة"
  },
  {
    "start": 870.66,
    "end": 872.36,
    "text": "الله وبركاته في رعاية الله"
  }
];

type Item = { title: string; text: string };
type Scene = {
  id: string;
  start: number;
  end: number;
  layout: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Item[];
  bullets?: string[];
  quote?: string;
  quoteNote?: string;
  highlights?: Array<{ at: number; index: number }>;
};

const scenes: Scene[] = [
  { id: "hero", start: 0, end: 37.8, layout: "hero", kicker: "قناة عقلانة  ·  الدرس الثالث", title: "الذكاء الاصطناعي", subtitle: "في الحياة اليومية والصناعة" },
  { id: "daily-hook", start: 37.8, end: 86.4, layout: "cards", kicker: "حولك الآن", title: "تستخدمه كل يوم… دون أن تسمّيه", items: [
    { title: "أنظمة التوصية", text: "يوتيوب وفيسبوك يرشّحان ما يناسبك من سلوكك." },
    { title: "المساعد الصوتي", text: "سري وجوجل يفهمان الأمر ويحوّلان الصوت إلى نص." },
    { title: "الترجمة الآلية", text: "جوجل ترانسليت وDeepL ينقلان النص بين اللغات." },
  ]},
  { id: "industry-hook", start: 86.4, end: 133, layout: "cards", kicker: "في الميدان", title: "وكذلك في الصناعة", items: [
    { title: "صيانة تنبؤية", text: "توقّع تعطّل الآلات وأسباب العطل قبل حدوثه." },
    { title: "التوصيل والتجارة", text: "اقتراح مسارات أقصر وأسهل للوصول." },
    { title: "الرعاية الصحية", text: "تحليل صور الأشعة الطبية لدعم التشخيص." },
  ]},
  { id: "caution", start: 133, end: 193.3, layout: "warning", kicker: "تنبيه الكتاب", title: "قد يخطئ… وهذا طبيعي", subtitle: "تحقّق دائماً من المخرجات، خاصة حين يتعلّق الأمر بالأخلاق أو القانون أو حياتك الشخصية.", bullets: [
    "الذكاء الاصطناعي موجود منذ زمن — شهرة ChatGPT جعلتنا نلاحظه.",
    "النماذج التوليدية تنتج نصاً وصوراً وصوتاً، لكنها ليست معصومة.",
    "لا يُترك التحكّم بأنظمة حسّاسة — مثل الصواريخ — للآلة وحدها.",
  ]},
  { id: "questions", start: 193.3, end: 223.2, layout: "questions", kicker: "بعد هذا الدرس ستجيب", title: "أسئلة الدرس", items: [
    { title: "أين نستخدمه يومياً؟", text: "الحياة اليومية" },
    { title: "وأين في الصناعة؟", text: "أربعة مجالات" },
    { title: "فيمَ يتفوّق على الإنسان؟", text: "التصنيف والتعرّف" },
    { title: "ممّ نحذر عند استخدامه؟", text: "أخلاق · خصوصية · مسؤولية" },
  ]},
  { id: "section-daily", start: 223.2, end: 376.5, layout: "cards", kicker: "القسم 01  ·  الحياة اليومية", title: "أربع خدمات شهيرة", items: [
    { title: "أنظمة التوصية", text: "يوتيوب · أمازون · سبوتيفاي — محتوى مخصص لك من لايك ومتابعة ومشاركة." },
    { title: "المساعدات الصوتية", text: "«اعمل لي منبّهاً» — سيري في آبل ومساعد جوجل في أندرويد." },
    { title: "الترجمة الآلية", text: "نص أو صوت يتحوّل تلقائياً إلى لغة أخرى — ترجمة جوجل وDeepL." },
    { title: "التعرّف على الوجه", text: "بصمة الوجه لفتح الهاتف، وتصنيف الصور في ChatGPT." },
  ], highlights: [{ at: 223.2, index: 0 }, { at: 291.2, index: 1 }, { at: 320.6, index: 2 }, { at: 341, index: 3 }]},
  { id: "section-industry", start: 376.5, end: 504, layout: "cards", kicker: "القسم 02  ·  الصناعة", title: "أربعة مجالات تطبيق", items: [
    { title: "الرعاية الصحية", text: "تشخيص من صور الأشعة السينية ودعم اكتشاف الأدوية." },
    { title: "الزراعة", text: "التنبؤ بموعد الحصاد من الطقس، وكشف الآفات من صورة النبات." },
    { title: "التصنيع", text: "أتمتة فحص الجودة وصيانة تنبؤية للآلات دون تدخل بشري مستمر." },
    { title: "الخدمات اللوجستية", text: "تحسين مسارات التوصيل في التجارة والنقل." },
  ], highlights: [{ at: 376.5, index: 0 }, { at: 405.4, index: 1 }, { at: 433.2, index: 2 }, { at: 487.8, index: 3 }]},
  { id: "strengths", start: 504, end: 606.3, layout: "feature", kicker: "القسم 03  ·  الخصائص", title: "فيمَ يبرع ويتفوّق؟", items: [
    { title: "تصنيف البيانات", text: "آلاف الصور والأنماط المعقّدة في ثوانٍ." },
    { title: "التعرّف والتوليد", text: "صور وأصوات ونصوص بحجم ضخم، مع توليد محتوى." },
    { title: "الاستدلال الاحتمالي", text: "يتوقّع نتيجة حتى من بيانات ناقصة، استناداً إلى ما لديه." },
  ], highlights: [{ at: 504, index: 0 }, { at: 546.9, index: 1 }, { at: 576.7, index: 2 }]},
  { id: "ethics", start: 606.3, end: 641.9, layout: "warning", kicker: "احتياطات  ·  01", title: "قرارات لها بعد أخلاقي", subtitle: "توصية من يدخل قسم العناية المركّزة قد تخطئ. لا تُسلَّم القرارات الأخلاقية للآلة وحدها.", bullets: [
    "الذكاء الاصطناعي أداة مساعدة لا قاضياً أخلاقياً.",
    "أي قرار يمسّ حياة إنسان يحتاج حكماً بشرياً.",
  ]},
  { id: "privacy", start: 641.9, end: 653, layout: "feature", kicker: "احتياطات  ·  02", title: "البيانات الشخصية", items: [
    { title: "لا تُدخل معلومات حسّاسة", text: "ما تكتبه للنموذج قد لا يبقى خاصاً. احمِ بياناتك." },
  ]},
  { id: "story", start: 653, end: 706.8, layout: "quote", kicker: "احتياطات  ·  03", title: "قرارات تؤثّر على مستقبلك", quote: "اقترح لي مكتبة في بايثون، تعلّمتها شهوراً، ثم تبيّن أنها لا تناسب احتياجي. ندمت، وقرّرت ألا أستخدمه استخداماً مطلقاً.", quoteNote: "عبدالله جريتم — تجربة شخصية" },
  { id: "bias", start: 706.8, end: 733.4, layout: "warning", kicker: "احتياطات  ·  04", title: "دقة النتائج والتحيّز", subtitle: "قد يُخرج معلومات خاطئة لأن بيانات التدريب ناقصة أو متحيّزة.", bullets: [
    "اسأله: من انتصر في أكتوبر 1973؟ — قد يُجيب بما لا تتوقّعه.",
    "النتيجة الواثقة ليست دليلاً على الصحة.",
  ]},
  { id: "blackbox", start: 733.4, end: 810.1, layout: "quote", kicker: "مشكلة شهيرة", title: "الصندوق الأسود", quote: "يعطيك رداً أو صورة دون أن يتّضح كيف توصّل إليه — حتى مهندسوه قد لا يفسّرون الخطوة.", quoteNote: "Black box" },
  { id: "key-idea", start: 810.1, end: 840.6, layout: "quote", kicker: "الفكرة الرئيسة", title: "ما تتذكّره في كل تمرين", quote: "الذكاء الاصطناعي بارع في إيجاد أنماط من البيانات… لكن الحكم البشري لا يزال ضرورياً.", quoteNote: "خصوصاً في الأخلاق والخصوصية والمسؤولية" },
  { id: "outro", start: 840.6, end: 873, layout: "outro", kicker: "عقلانة", title: "السنة ستكون أسهل", subtitle: "تقييمات · حل تدريبات الكتب · شارك المعرفة" },
];

function sceneAt(t: number): Scene {
  return scenes.find((s) => t >= s.start && t < s.end) ?? scenes[scenes.length - 1];
}
function captionAt(t: number): Caption | null {
  return captions.find((c) => t >= c.start && t < c.end) ?? null;
}
function hi(scene: Scene, t: number): number {
  if (!scene.highlights?.length) return 0;
  let idx = scene.highlights[0].index;
  for (const h of scene.highlights) if (t >= h.at) idx = h.index;
  return idx;
}
function appear(frame: number, delay = 0, duration = 18) {
  const t = interpolate(frame, [delay, delay + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const e = 1 - Math.pow(1 - t, 3);
  return { opacity: e, y: (1 - e) * 28 };
}

const In: React.FC<{ frame: number; delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ frame, delay = 0, children, style }) => {
  const a = appear(frame, delay);
  return <div style={{ opacity: a.opacity, transform: `translateY(${a.y}px)`, ...style }}>{children}</div>;
};

export const AqlanaLesson: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const scene = sceneAt(time);
  const local = Math.round((time - scene.start) * fps);
  const cap = captionAt(time);
  const progress = time / (DURATION_FRAMES / fps);
  const glow = scene.layout === "warning" ? palette.warn : palette.accent;
  const gx = 220 + Math.sin(frame / 90) * 140;
  const gy = -160 + Math.cos(frame / 120) * 90;
  const grid = (frame * 0.35) % 80;
  let capOp = 0;
  if (cap) {
    const localC = time - cap.start;
    const remain = cap.end - time;
    capOp = Math.min(1, localC / 0.22, remain / 0.18);
  }
  const active = hi(scene, time);
  const items = scene.items ?? [];
  const cols = items.length === 4 ? 2 : Math.max(1, items.length);

  return (
    <AbsoluteFill style={{ background: palette.bg, overflow: "hidden", direction: "rtl", fontFamily: fonts.body }}>
      {/* <Audio src={staticFile("lesson.mp3")} /> */}
      <div style={{ position: "absolute", inset: 0, background: palette.bg }}>
        <div style={{ position: "absolute", width: 980, height: 980, borderRadius: "50%", left: gx, top: gy, background: `radial-gradient(circle, ${glow}24 0%, transparent 62%)` }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${palette.line} 1px, transparent 1px), linear-gradient(90deg, ${palette.line} 1px, transparent 1px)`, backgroundSize: "80px 80px", backgroundPosition: `${grid}px ${grid * 0.4}px`, maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)" }} />
      </div>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 88, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: palette.accent }} />
          <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 28, color: palette.fg }}>عقلانة</span>
          <span style={{ color: palette.muted, fontSize: 20 }}>الدرس 03</span>
        </div>
        <span style={{ color: palette.muted, fontSize: 18 }}>{scene.kicker}</span>
      </div>
      <div style={{ position: "absolute", top: 88, left: 56, right: 56, height: 3, background: palette.line, borderRadius: 99 }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", background: palette.accent, borderRadius: 99 }} />
      </div>

      <div style={{ position: "absolute", inset: "140px 72px 200px" }}>
        {scene.layout === "hero" && (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 24 }}>
            <In frame={local}><div style={{ color: palette.accent, fontWeight: 600, fontSize: 22 }}>{scene.kicker}</div></In>
            <In frame={local} delay={8}><div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 108, lineHeight: 1.15, color: palette.fg }}>{scene.title}</div></In>
            <In frame={local} delay={14}><div style={{ fontSize: 32, color: palette.muted }}>{scene.subtitle}</div></In>
            <In frame={local} delay={24}><div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {["الثانية باكالوريا", "علوم الحاسوب", "عبدالله جريتم", "14:33"].map((t) => (
                <span key={t} style={{ border: `1px solid ${palette.lineStrong}`, background: palette.bg2, color: palette.muted, padding: "10px 16px", borderRadius: 999, fontSize: 20, fontWeight: 600 }}>{t}</span>
              ))}
            </div></In>
          </div>
        )}

        {(scene.layout === "cards") && (
          <div>
            <In frame={local}><div style={{ color: palette.accent, fontWeight: 600, fontSize: 22, marginBottom: 10 }}>{scene.kicker}</div></In>
            <In frame={local} delay={6}><div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: palette.fg, marginBottom: 24 }}>{scene.title}</div></In>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 20 }}>
              {items.map((item, i) => {
                const on = active === i;
                return (
                  <In key={item.title} frame={local} delay={12 + i * 5}>
                    <div style={{ background: on ? palette.bg3 : palette.bg2, border: `1px solid ${on ? palette.accent : palette.line}`, borderRadius: 28, padding: 28, minHeight: 200 }}>
                      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: palette.fg, marginBottom: 10 }}>{item.title}</div>
                      <div style={{ fontSize: 22, lineHeight: 1.5, color: palette.muted }}>{item.text}</div>
                    </div>
                  </In>
                );
              })}
            </div>
          </div>
        )}

        {scene.layout === "feature" && (
          <div>
            <In frame={local}><div style={{ color: palette.accent, fontWeight: 600, fontSize: 22 }}>{scene.kicker}</div></In>
            <In frame={local} delay={6}><div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: palette.fg, margin: "12px 0 24px" }}>{scene.title}</div></In>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((item, i) => {
                const on = items.length === 1 || active === i;
                return (
                  <In key={item.title} frame={local} delay={12 + i * 6}>
                    <div style={{ display: "flex", gap: 20, alignItems: "center", background: on ? palette.bg3 : "transparent", border: `1px solid ${on ? palette.accent : palette.line}`, borderRadius: 24, padding: "22px 28px" }}>
                      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color: on ? palette.accent : palette.subtle, width: 72 }}>{String(i + 1).padStart(2, "0")}</div>
                      <div>
                        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: palette.fg }}>{item.title}</div>
                        <div style={{ fontSize: 22, color: palette.muted, marginTop: 6 }}>{item.text}</div>
                      </div>
                    </div>
                  </In>
                );
              })}
            </div>
          </div>
        )}

        {scene.layout === "warning" && (
          <div>
            <In frame={local}><div style={{ color: palette.warn, fontWeight: 600, fontSize: 22 }}>{scene.kicker}</div></In>
            <In frame={local} delay={6}><div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: palette.fg, margin: "12px 0" }}>{scene.title}</div></In>
            {scene.subtitle ? <In frame={local} delay={10}><div style={{ fontSize: 28, color: palette.muted, marginBottom: 24, lineHeight: 1.55 }}>{scene.subtitle}</div></In> : null}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(scene.bullets ?? []).map((b, i) => (
                <In key={b} frame={local} delay={16 + i * 6}>
                  <div style={{ background: palette.bg2, border: `1px solid ${palette.line}`, borderRadius: 20, padding: "18px 22px", fontSize: 26, color: palette.fg, lineHeight: 1.5 }}>{b}</div>
                </In>
              ))}
            </div>
          </div>
        )}

        {scene.layout === "questions" && (
          <div>
            <In frame={local}><div style={{ color: palette.accent, fontWeight: 600, fontSize: 22 }}>{scene.kicker}</div></In>
            <In frame={local} delay={6}><div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: palette.fg, margin: "12px 0 24px" }}>{scene.title}</div></In>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {items.map((item, i) => (
                <In key={item.title} frame={local} delay={12 + i * 5}>
                  <div style={{ background: palette.bg2, border: `1px solid ${palette.line}`, borderRadius: 24, padding: 28, minHeight: 180 }}>
                    <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 36, color: palette.accent }}>{String(i + 1).padStart(2, "0")}</div>
                    <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: palette.fg, marginTop: 8 }}>{item.title}</div>
                    <div style={{ fontSize: 22, color: palette.muted, marginTop: 8 }}>{item.text}</div>
                  </div>
                </In>
              ))}
            </div>
          </div>
        )}

        {scene.layout === "quote" && (
          <div>
            <In frame={local}><div style={{ color: palette.accent, fontWeight: 600, fontSize: 22 }}>{scene.kicker}</div></In>
            <In frame={local} delay={6}><div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 56, color: palette.fg, margin: "12px 0 28px" }}>{scene.title}</div></In>
            <In frame={local} delay={14}>
              <div style={{ background: palette.bg2, border: `1px solid ${palette.lineStrong}`, borderRight: `8px solid ${palette.accent}`, borderRadius: 28, padding: "48px 52px" }}>
                <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 44, lineHeight: 1.45, color: palette.fg }}>{scene.quote}</div>
                {scene.quoteNote ? <div style={{ marginTop: 24, fontSize: 22, color: palette.accent, fontWeight: 600 }}>{scene.quoteNote}</div> : null}
              </div>
            </In>
          </div>
        )}

        {scene.layout === "outro" && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18 }}>
            <In frame={local}><div style={{ color: palette.accent, fontWeight: 600, fontSize: 22 }}>{scene.kicker}</div></In>
            <In frame={local} delay={8}><div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 80, color: palette.fg }}>{scene.title}</div></In>
            <In frame={local} delay={14}><div style={{ fontSize: 28, color: palette.muted }}>{scene.subtitle}</div></In>
            <In frame={local} delay={22}><div style={{ fontSize: 24, color: palette.muted, lineHeight: 1.7 }}>صلّ على النبي · شارك الدرس · الهدف المشاركة لا الأرباح<br/>السلام عليكم ورحمة الله وبركاته</div></In>
          </div>
        )}
      </div>

      {cap ? (
        <div style={{ position: "absolute", bottom: 48, left: 80, right: 80, opacity: capOp, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "rgba(11,16,24,0.78)", border: `1px solid ${palette.lineStrong}`, borderRight: `6px solid ${palette.accent}`, borderRadius: 20, padding: "18px 32px", maxWidth: 1600, fontSize: 36, lineHeight: 1.55, fontWeight: 600, color: palette.fg, textAlign: "center" }}>
            {cap.text}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Root: React.FC = () => (
  <Composition
    id="AqlanaLesson"
    component={AqlanaLesson}
    durationInFrames={26190}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);

export default AqlanaLesson;
