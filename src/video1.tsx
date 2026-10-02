/**
 * A4Video.tsx — فيديو a4 (عمودي 1080×1920، 30fps)
 * الاتجاه البصري: مخطوطة ورقية دافئة (بيج / بني / زيتي / قرمزي)
 * كل التوقيتات مأخوذة من a4.srt (بالثواني).
 *
 * الملفات المطلوبة في public/ :
 *   a4.m4a                      (الصوت)
 *   sfx/*.mp3                   (المؤثرات + الأجواء)
 *
 * التركيب: id = "A4Video" — صدّر RemotionRoot من هذا الملف وسجّله في index.ts:
 *   registerRoot(RemotionRoot)
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';
import {loadFont as loadRuqaa} from '@remotion/google-fonts/ArefRuqaa';

const amiri = loadAmiri('normal', {weights: ['400', '700'], subsets: ['arabic']}).fontFamily;
const ruqaa = loadRuqaa('normal', {weights: ['400', '700'], subsets: ['arabic']}).fontFamily;

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL_SEC = 826;
const TOTAL = Math.ceil(TOTAL_SEC * FPS);

const C = {
  paper: '#efe2c3',
  paper2: '#dcc896',
  cream: '#f8efd9',
  ink: '#3a2a1c',
  brown: '#6b4423',
  olive: '#656b36',
  crimson: '#9b2335',
  gold: '#b8893a',
};

/* ───────────────────────── البيانات ───────────────────────── */

type Kind = 'ayah' | 'hadith' | 'key' | 'a' | 'p' | 'n' | 'x';
type CueT = {s: number; e: number; text: string; kind?: Kind; ref?: string};
type Visual =
  | 'crescent'
  | 'book'
  | 'qmark'
  | 'evidence'
  | 'daynight'
  | 'scale'
  | 'stamp'
  | 'pillars'
  | 'dialog';
type SceneT = {
  t0: number;
  t1: number;
  tag: string;
  title: string;
  visual: Visual;
  stamp?: string;
  marks?: [number, string][];
  cues: CueT[];
};

const q = (s: number, e: number, text: string, kind?: Kind, ref?: string): CueT => ({s, e, text, kind, ref});

const SCENES: SceneT[] = [
  {
    t0: 0, t1: 30.3, tag: 'مقدمة', title: 'بسم الله', visual: 'crescent',
    cues: [
      q(1.0, 8.0, 'بسم الله والحمد لله، والصلاة والسلام على رسول الله وعلى آله وصحبه ومن والاه'),
      q(8.0, 14.9, 'اللهم لا سهل إلا ما جعلته سهلًا، وأنت تجعل الحزن إذا شئت سهلًا'),
      q(14.9, 22.1, 'نسأل الله العظيم أن يجعلنا ممن يستمعون القول فيتبعون أحسنه'),
      q(22.1, 30.3, 'وأن يرزقنا الإخلاص في القول والعمل، إنه ولي ذلك والقادر عليه'),
    ],
  },
  {
    t0: 30.3, t1: 70.7, tag: 'تذكير', title: 'طلب العلم فريضة', visual: 'book',
    cues: [
      q(30.3, 37.9, 'كان التسجيل الأول عن فضل ومكانة طلب العلم الشرعي'),
      q(37.9, 46.5, 'وقلنا إن طلب العلم الشرعي فرض على كل مسلم ومسلمة'),
      q(46.5, 55.0, 'قال النبي ﷺ: «طلب العلم فريضة على كل مسلم» وزاد ابن مسعود: «ومسلمة»', 'hadith'),
      q(55.0, 66.6, 'لأن النساء شقائق الرجال في الأحكام، إلا ما اختص الله به النساء'),
      q(66.6, 70.7, 'وكما وعدنا، سنبدأ في أحكام الصيام'),
    ],
  },
  {
    t0: 70.7, t1: 117.5, tag: 'سؤال وجواب', title: 'أحكام الصيام', visual: 'book',
    cues: [
      q(70.7, 84.5, 'أحكام الصيام في صورة سؤال وجواب، حتى تتضح الأحكام الشرعية التي بيّنها النبي ﷺ'),
      q(84.5, 96.8, 'في سنته، وما ورد في كتاب الله، لتكون على دراية كافية وعلم'),
      q(96.8, 102.7, '﴿وَقُلْ رَبِّ زِدْنِي عِلْمًا﴾', 'ayah', 'طه: ١١٤'),
      q(102.7, 113.7, 'فما طلب الله الزيادة في شيء إلا في العلم'),
      q(113.7, 117.5, 'وهو طلب العلم الشرعي'),
    ],
  },
  {
    t0: 117.5, t1: 158.3, tag: 'الهدف', title: 'صيام صحيح ١٠٠٪', visual: 'crescent',
    cues: [
      q(117.5, 125.5, 'نحتاج أن نركّز مع رمضان، ونخرج منه من الفائزين لا من الخاسرين'),
      q(125.5, 131.6, 'نحتاج أن نحصّل أعلى الدرجات'),
      q(131.6, 138.9, 'فكيف؟ نبدأ بما يرفع الدرجات: أن نخرج بصيام صحيح مئة بالمئة'),
      q(138.9, 150.3, 'صيام خالٍ من العيوب، خالٍ مما يشوبه ويكدّره وينقص الأجر', 'key'),
      q(150.3, 155.6, '﴿هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ﴾', 'ayah', 'الزمر: ٩'),
      q(155.6, 158.3, 'لا في العمل، ولا في الأداء، ولا في الهمة'),
    ],
  },
  {
    t0: 158.3, t1: 226.7, tag: 'حكم صوم رمضان', title: 'السؤال الأول', visual: 'qmark',
    cues: [
      q(158.3, 168.6, 'السؤال الأول الذي نطرحه عليكم: ما حكم الصيام؟'),
      q(168.6, 181.2, 'ما حكم صيام رمضان؟ ما حكم من سيصوم عند الله؟ وما حكم من سيترك؟'),
      q(181.2, 192.8, 'أي: سيكون في الآخرة من أهل الجنة والفوز، أو من أهل الخسران'),
      q(192.8, 200.0, 'لأن الحكم الشرعي يترتب عليه: إما جنة وإما نار', 'key'),
      q(200.0, 208.7, 'فلا بد أن نُصغي ونستمع استماعًا جيدًا لنعرف الحكم الشرعي'),
      q(209.2, 217.0, 'الموجود في كتاب الله وسنة النبي محمد ﷺ'),
      q(217.0, 226.7, 'وهذه ميزة منهج السلف: الاستدلال في كل كبيرة وصغيرة بالقرآن والسنة'),
    ],
  },
  {
    t0: 226.7, t1: 274.4, tag: 'الجواب', title: 'فرض واجب', visual: 'evidence',
    marks: [[238.2, 'الكتاب'], [241.8, 'السنة'], [245.0, 'الإجماع']],
    cues: [
      q(226.7, 237.0, 'صوم رمضان فرض واجب، وركن من أركان الإسلام', 'key'),
      q(237.0, 244.3, 'والأصل في وجوبه: الكتاب، والسنة، أي سنة النبي محمد ﷺ'),
      q(244.3, 249.3, 'والإجماع: إجماع علماء الأمة'),
      q(249.3, 258.5, 'على أن الصيام معلوم من الدين بالضرورة'),
      q(258.5, 267.7, 'ومنكر فرضية الصيام: كافر مرتد خالد مخلّد في جهنم'),
      q(267.7, 274.4, 'ما معنى هذه العبارات؟ نفسّرها واحدة واحدة، ونذكر الآيات والأحاديث الدالة عليها'),
    ],
  },
  {
    t0: 274.4, t1: 338.1, tag: 'رمضان كله عبادة', title: 'فرض بالنهار وبالليل', visual: 'daynight',
    marks: [[299.7, 'day'], [303.7, 'night']],
    cues: [
      q(274.4, 282.1, 'رمضان شهر من اثني عشر شهرًا، افترضه الله عز وجل'),
      q(282.1, 291.2, 'صيام نهاري، مع المحافظة فيه على بقية العبادات'),
      q(292.1, 299.7, 'ماذا نقصد بالمحافظة على بقية العبادات؟ كثير من الناس يظن أن رمضان هو النهار فقط'),
      q(299.7, 308.3, 'لا! رمضان فرض بالنهار، وفرض بالليل', 'key'),
      q(308.3, 320.6, 'واجب أن تصوم بالنهار، وواجب أن تفطر بالليل؛ واجب أن تمسك، وواجب ألا تمسك'),
      q(320.6, 327.2, 'من الذي حدّد لك ذلك؟ الله ورسوله — هو الذي قال لك: افعل ولا تفعل'),
      q(327.2, 338.1, '﴿وَمَا كَانَ لِمُؤْمِنٍ وَلَا مُؤْمِنَةٍ إِذَا قَضَى اللَّهُ وَرَسُولُهُ أَمْرًا أَن يَكُونَ لَهُمُ الْخِيَرَةُ مِنْ أَمْرِهِمْ﴾', 'ayah', 'الأحزاب: ٣٦'),
    ],
  },
  {
    t0: 338.1, t1: 406.9, tag: 'احذر', title: 'خطورة الإنكار والترك', visual: 'stamp', stamp: 'تحذير',
    cues: [
      q(338.1, 348.7, 'فرمضان فرض، فرضه الله على كل مسلم ومسلمة'),
      q(348.7, 358.7, 'ومن قال: نصوم أو لا نصوم، ليس فارقًا… لأنه يقول: ليس فرضًا'),
      q(359.4, 371.9, 'وهذا من منكري السنة في هذه الأيام، وقد كثروا — عياذًا بالله — ومن قال ذلك فهو مرتد'),
      q(372.6, 380.5, 'وإن قال: نفسي أصوم لكن الظروف… فقد ارتكب جرمًا عظيمًا'),
      q(380.5, 391.7, 'ارتكب من أعظم الكبائر — عياذًا بالله — وقد يُختم له بخاتمة السوء'),
      q(391.7, 406.9, 'من أدرك رمضان فلم يصم، أو أفطر بعض الأيام بلا عذر: مصيبة والعياذ بالله', 'key'),
    ],
  },
  {
    t0: 406.9, t1: 507.1, tag: 'متى يجب؟', title: 'البلوغ والتكليف', visual: 'stamp', stamp: 'تكليف',
    cues: [
      q(406.9, 417.9, 'مع كثرة الجهل بكتاب الله وسنة النبي ﷺ في بيوت المسلمين، للأسف الشديد'),
      q(417.9, 425.1, 'هذه الأمور تحتاج إلى تبيين وتوضيح وتكرار على أذهان الناس'),
      q(425.1, 436.2, 'فرض: يعني ألزمك الله بصيامه، متى بلغت البنت مرحلة البلوغ'),
      q(436.2, 450.1, 'وعلامة البلوغ عند النساء: نزول الحيض وإنبات الشعر', 'key'),
      q(450.1, 461.9, 'فأصبح واجبًا عليها كل ما أوجبه الله على المسلمين'),
      q(461.9, 469.1, 'الحجاب، والصيام، والصلاة'),
      q(469.1, 478.7, 'لأنها تُحاسَب؛ لو ماتت الصبح: إما الجنة وإما النار — مفيش هزار'),
      q(478.7, 491.0, 'إذا بلغ العبد أصبح مكلَّفًا، وإذا بلغت البنت أصبحت مكلَّفة بكل شعائر الإسلام الواجبة'),
      q(491.0, 497.1, 'والفرض والواجب بمعنى واحد عند جمهور العلماء'),
      q(497.1, 507.1, 'فإن تركت الصيام عوقبت، وإن تركت الحجاب عوقبت'),
    ],
  },
  {
    t0: 507.1, t1: 574.9, tag: 'مسؤولية الأهل', title: 'أيهما أولى؟', visual: 'scale',
    marks: [[546.8, 'dunya'], [555.6, 'akhira']],
    cues: [
      q(507.1, 517.5, 'من يشتري لها الملابس؟ أنتم وأبوها! فهل تُجبَر على الصلاة؟'),
      q(517.5, 522.7, 'قال النبي ﷺ: «واضربوهم عليها لعشر»', 'hadith'),
      q(522.7, 533.6, 'لو لم تذهب إلى درسها تقول: لا بأس؟ لا! بل تأخذها غصبًا عنها'),
      q(535.1, 546.8, 'وتوصلها إلى درسها لتتعلم علومًا دنيوية… فماذا عن الآخرة وأوامر الله؟'),
      q(546.8, 555.6, 'لو تعبت ولم تأخذ الدواء، تجبرها عليه — لماذا؟ حتى لا تموت'),
      q(555.6, 564.2, 'فهل ندعها تدخل جهنم؟ أيهما أولى؟', 'key'),
      q(564.2, 574.9, 'أيهما يُقدَّم عند الله، وعند أصحاب العقول والمروءة؟ الموضوع كبير: الله أوجب الصيام'),
    ],
  },
  {
    t0: 574.9, t1: 637.8, tag: 'شروط الوجوب', title: 'كُتِب عليكم الصيام', visual: 'stamp', stamp: 'كُتِب',
    cues: [
      q(574.9, 586.3, 'شروط وجوب الصيام: إذا بلغت البنت أو بلغ الولد وجبت عليه كل العبادات الشرعية بلا استثناء'),
      q(586.3, 592.8, 'ولو مات بعد البلوغ دخل الجنة'),
      q(592.8, 603.0, '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ﴾', 'ayah', 'البقرة: ١٨٣'),
      q(603.0, 610.1, 'يا من آمنتم بالله ورسوله… يا من ترجون الدار الآخرة'),
      q(610.1, 613.2, 'يا من تخافون عقاب الله'),
      q(613.2, 620.8, 'الله مَلِك السماوات والأرض، الذي بيده ملكوت كل شيء'),
      q(620.8, 629.7, 'الذي بيده الخفض والرفع، والتقديم والتأخير، والسعادة والشقاء'),
      q(629.7, 637.8, 'فرض عليكم الصيام لتكونوا من السعداء في الدنيا والآخرة', 'key'),
    ],
  },
  {
    t0: 637.8, t1: 693.9, tag: 'الحكمة', title: 'لعلكم تتقون', visual: 'crescent',
    cues: [
      q(637.8, 642.3, '﴿كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ﴾', 'ayah', 'البقرة: ١٨٣'),
      q(642.4, 646.0, 'خذ بالك: الله فرضه على الذين من قبلكم'),
      q(646.2, 650.6, 'ليه يا رب فرضت عليّ الصيام؟ لتزداد قربًا من الله عز وجل'),
      q(650.9, 655.9, 'لتزداد قربًا من الله تبارك وتعالى'),
      q(656.0, 658.6, '﴿لَعَلَّكُمْ تَتَّقُونَ﴾', 'ayah', 'البقرة: ١٨٣'),
      q(658.8, 662.3, 'لعلكم تجعلون بينكم وبين المعاصي حاجبًا'),
      q(662.6, 665.3, 'لعلكم تتركون ما نهى الله عز وجل عنه'),
      q(665.5, 669.6, 'لعلكم يحدث في نفوسكم أثرًا'),
      q(670.0, 677.6, 'يؤدي إلى القرب من الله، والبعد عن مسالك الشيطان — عياذًا بالله'),
      q(677.9, 687.2, 'وما الدليل الآخر على أن الصيام فرض على كل بنت بالغة، وكل ولد بالغ، وعلى كل مسلم عاقل؟'),
      q(688.0, 693.9, 'من حديث ابن عمر رضي الله عنهما، قال: قال رسول الله ﷺ'),
    ],
  },
  {
    t0: 693.9, t1: 726.7, tag: 'حديث ابن عمر', title: 'بُني الإسلام على خمس', visual: 'pillars',
    marks: [[696.0, 'p0'], [699.7, 'p1'], [700.9, 'p2'], [702.7, 'p3'], [703.9, 'p4'], [716.3, 'crack']],
    cues: [
      q(693.9, 695.8, '«بُني الإسلام على خمس»', 'hadith'),
      q(696.0, 699.4, 'شهادة أن لا إله إلا الله، وأن محمدًا رسول الله'),
      q(699.7, 700.7, 'وإقام الصلاة', 'key'),
      q(700.9, 702.0, 'وإيتاء الزكاة', 'key'),
      q(702.7, 703.6, 'والحج', 'key'),
      q(703.9, 706.6, 'وصوم رمضان', 'key'),
      q(706.9, 713.2, 'فربنا عز وجل جعل الصيام من بناء الإسلام'),
      q(713.5, 718.1, 'فمن لم يُقم الصيام حقّه فقد هدم الإسلام'),
      q(719.4, 726.7, 'من لا يصوم حق الصيام ولا يؤدي حق رمضان فقد هدم الإسلام — عياذًا بالله'),
    ],
  },
  {
    t0: 726.7, t1: 776.4, tag: 'حديث طلحة بن عبيد الله', title: 'الأعرابي والنبي ﷺ', visual: 'dialog',
    cues: [
      q(726.7, 728.5, 'عن طلحة بن عبيد الله:', 'n'),
      q(728.6, 733.7, 'أن أعرابيًّا جاء إلى النبي ﷺ ثائر الرأس', 'n'),
      q(734.0, 737.1, 'يا رسول الله، أخبرني ماذا فرض الله عليّ من الصلاة؟', 'a'),
      q(737.4, 740.0, 'الصلوات الخمس، إلا أن تطّوّع شيئًا', 'p'),
      q(740.8, 743.7, 'فأخبرني ما فرض الله عليّ من الصيام؟', 'a'),
      q(743.9, 746.6, 'شهر رمضان، إلا أن تطّوّع شيئًا', 'p'),
      q(746.9, 749.5, 'فأخبرني بما فرض الله عليّ من الزكاة؟', 'a'),
      q(749.6, 753.5, 'فأخبره النبي ﷺ بشرائع الإسلام', 'n'),
      q(753.7, 756.8, 'والذي أكرمك، لا أتطوّع شيئًا', 'a'),
      q(756.9, 759.3, 'ولا أنقص مما فرض الله عليّ شيئًا', 'a'),
      q(759.5, 763.8, '«أفلح إن صدق» أو «دخل الجنة إن صدق»', 'p'),
      q(763.9, 765.6, 'إن صدق في هذا الكلام', 'x'),
      q(765.9, 776.4, 'وأدّى الفرائض التي عليه، فكان سببًا في نجاته ودخوله الجنة', 'x'),
    ],
  },
  {
    t0: 776.4, t1: 818.1, tag: 'الخلاصة', title: 'الإجماع والخلاصة', visual: 'evidence',
    marks: [[777.0, 'الإجماع'], [812.4, 'الكتاب'], [815.2, 'السنة']],
    cues: [
      q(776.4, 786.0, 'وأما الإجماع: فقد أجمع المسلمون على وجوب صيام شهر رمضان، ولا يجب صوم غيره بأصل الشرع'),
      q(788.1, 797.0, 'الخلاصة: شهر رمضان فرض واجب، لا بد أن يؤدّيه المسلم', 'key'),
      q(797.1, 803.3, 'ومن لم يؤدِّ الصيام فقد ارتكب كبيرة من الكبائر'),
      q(803.5, 811.3, 'ومن أنكر وجوب الصيام فقد كفر، وأصبح مرتدًّا عن دين الله'),
      q(811.4, 814.4, 'لماذا؟ لأن الصيام فرض من كتاب الله'),
      q(814.8, 818.1, 'وفرض بسنة النبي محمد ﷺ'),
    ],
  },
  {
    t0: 818.1, t1: TOTAL_SEC, tag: 'ختام', title: 'استغفر الله', visual: 'crescent',
    cues: [
      q(818.1, 820.1, 'أقول قولي هذا وأستغفر الله لكم'),
      q(820.2, 824.4, 'سبحانك اللهم وبحمدك، أشهد أن لا إله إلا أنت، أستغفرك وأتوب إليك', 'key'),
    ],
  },
];

/* ───────────────────────── أدوات ───────────────────────── */

const ease = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

const pop = (t: number, a: number, damping = 11) =>
  spring({
    frame: Math.max(0, (t - a) * FPS),
    fps: FPS,
    config: {damping, mass: 0.6, stiffness: 140},
  });

const markT = (sc: SceneT, key: string): number | null => {
  const m = sc.marks?.find((x) => x[1] === key);
  return m ? m[0] : null;
};

type Entry = 'rise' | 'wipe' | 'page' | 'pop';
const ENTRIES: Entry[] = ['rise', 'page', 'wipe', 'pop'];

/* المؤثرات الصوتية */
type Sfx = {t: number; f: string; v: number};
const buildSfx = (): Sfx[] => {
  const out: Sfx[] = [];
  SCENES.forEach((sc, i) => {
    const en = ENTRIES[i % ENTRIES.length];
    out.push({t: sc.t0 + 0.02, f: en === 'page' ? 'page' : en === 'pop' ? 'pop' : 'whoosh', v: 0.5});
    out.push({t: sc.t0 + 0.2, f: 'pen', v: 0.25});
    if (sc.visual === 'stamp') out.push({t: sc.t0 + 0.55, f: 'stamp', v: 0.7});
    sc.cues.forEach((c) => {
      if (c.kind === 'ayah') out.push({t: c.s, f: 'chime', v: 0.35});
      else if (c.kind === 'key') out.push({t: c.s, f: 'stamp', v: 0.45});
      else if (c.kind === 'a' || c.kind === 'p') out.push({t: c.s, f: 'pop', v: 0.4});
    });
    (sc.marks ?? []).forEach((m) => {
      const crack = m[1] === 'crack';
      out.push({t: m[0], f: crack ? 'stamp' : sc.visual === 'daynight' || sc.visual === 'scale' ? 'whoosh' : 'pop', v: crack ? 0.9 : 0.5});
    });
  });
  return out.sort((a, b) => a.t - b.t);
};
const SFX = buildSfx();

/* ───────────────────────── الخلفية ───────────────────────── */

const Star8: React.FC<{size: number; stroke: string; w?: number}> = ({size, stroke, w = 3}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" fill="none" stroke={stroke} strokeWidth={w}>
    <rect x="-70" y="-70" width="140" height="140" />
    <rect x="-70" y="-70" width="140" height="140" transform="rotate(45)" />
    <circle r="40" />
    <circle r="20" />
  </svg>
);

const Background: React.FC<{t: number}> = ({t}) => {
  const seed = Math.floor(t * 6) % 9;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 38%, ${C.cream} 0%, ${C.paper} 52%, ${C.paper2} 100%)`,
      }}
    >
      {/* نجمة كبيرة تدور ببطء (طبقة بعيدة) */}
      <div
        style={{
          position: 'absolute',
          left: W / 2 - 700,
          top: 640 - 700 + Math.sin(t * 0.15) * 30,
          opacity: 0.22,
          transform: `rotate(${t * 2.5}deg)`,
        }}
      >
        <Star8 size={1400} stroke={C.brown} w={1.4} />
      </div>
      <Dust t={t} />
      {/* حبيبات الورق */}
      <svg width={W} height={H} style={{position: 'absolute', opacity: 0.32, mixBlendMode: 'multiply'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0.55 0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
      {/* تعتيم الحواف */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(80,50,20,0.38) 100%)'}} />
      <Frame />
    </AbsoluteFill>
  );
};

const Dust: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: 26}, (_, i) => {
      const sp = 14 + random(`sp${i}`) * 40;
      const y = H + 40 - ((t * sp + random(`y${i}`) * H) % (H + 80));
      const x = random(`x${i}`) * W + Math.sin(t * 0.6 + i) * 24;
      const r = 3 + random(`r${i}`) * 7;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: r,
            height: r,
            borderRadius: '50%',
            background: i % 3 === 0 ? C.gold : C.brown,
            opacity: 0.12 + random(`o${i}`) * 0.22,
          }}
        />
      );
    })}
  </>
);

const Frame: React.FC = () => (
  <svg width={W} height={H} style={{position: 'absolute'}} fill="none" stroke={C.brown}>
    <rect x="34" y="34" width={W - 68} height={H - 68} strokeWidth="5" opacity="0.8" />
    <rect x="52" y="52" width={W - 104} height={H - 104} strokeWidth="2" stroke={C.gold} />
    {[
      [52, 52, 1, 1],
      [W - 52, 52, -1, 1],
      [52, H - 52, 1, -1],
      [W - 52, H - 52, -1, -1],
    ].map(([x, y, sx, sy], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${sx} ${sy})`} stroke={C.gold} strokeWidth="3">
        <path d="M0 0 H90 M0 0 V90 M18 18 H64 M18 18 V64" />
        <circle cx="40" cy="40" r="8" fill={C.crimson} stroke="none" />
      </g>
    ))}
  </svg>
);

/* ───────────────────────── الرسومات (Visuals) ───────────────────────── */

const Crescent: React.FC<{lt: number}> = ({lt}) => {
  const p = pop(lt, 0.15, 14);
  return (
    <svg viewBox="0 0 800 800" width={800} height={800} style={{transform: `scale(${p})`}}>
      <defs>
        <mask id="cmask">
          <rect width="800" height="800" fill="#fff" />
          <circle cx="470" cy="350" r="170" fill="#000" />
        </mask>
      </defs>
      <g transform={`rotate(${lt * 6} 400 400)`} stroke={C.gold} fill="none" strokeWidth="3" opacity="0.7">
        <circle cx="400" cy="400" r="340" />
        <circle cx="400" cy="400" r="312" strokeDasharray="4 16" />
        {Array.from({length: 16}, (_, i) => (
          <line key={i} x1="400" y1="40" x2="400" y2="84" transform={`rotate(${i * 22.5} 400 400)`} />
        ))}
      </g>
      <circle cx="380" cy="410" r="210" fill={C.gold} mask="url(#cmask)" />
      <circle cx="380" cy="410" r="210" fill="none" stroke={C.brown} strokeWidth="5" mask="url(#cmask)" />
      <g transform={`translate(540 300) rotate(${-lt * 20}) scale(${0.5 + 0.08 * Math.sin(lt * 2)})`}>
        <rect x="-60" y="-60" width="120" height="120" fill={C.crimson} />
        <rect x="-60" y="-60" width="120" height="120" fill={C.crimson} transform="rotate(45)" />
      </g>
    </svg>
  );
};

const Book: React.FC<{lt: number}> = ({lt}) => {
  const p = pop(lt, 0.15, 14);
  const ph = (lt % 7) / 7;
  const sx = ph < 0.22 ? Math.cos((ph / 0.22) * Math.PI) : 1;
  const draw = (i: number, off: number) => ease(lt, 0.6 + i * 0.35 + off, 1.4 + i * 0.35 + off);
  return (
    <svg viewBox="0 0 800 700" width={800} height={700} style={{transform: `scale(${p}) rotate(${Math.sin(lt * 0.7) * 1.2}deg)`}}>
      <path d="M400 620 C300 585 160 585 70 625 L70 250 C160 210 300 210 400 250 Z" fill={C.cream} stroke={C.brown} strokeWidth="6" />
      <path d="M400 620 C500 585 640 585 730 625 L730 250 C640 210 500 210 400 250 Z" fill={C.cream} stroke={C.brown} strokeWidth="6" />
      <path d="M30 640 C150 600 300 600 400 640 C500 600 650 600 770 640" fill="none" stroke={C.brown} strokeWidth="10" />
      {Array.from({length: 7}, (_, i) => (
        <g key={i} stroke={C.ink} strokeWidth="5" strokeLinecap="round" opacity="0.7">
          <line x1="350" y1={300 + i * 45} x2={350 - 220 * draw(i, 0)} y2={300 + i * 45} />
          <line x1="750" y1={300 + i * 45} x2={750 - 230 * draw(i, 0.2)} y2={300 + i * 45} transform="translate(-40 0)" />
        </g>
      ))}
      <g transform={`translate(400 0) scale(${sx} 1) translate(-400 0)`}>
        <path d="M400 620 C500 585 640 585 730 625 L730 250 C640 210 500 210 400 250 Z" fill={sx < 0 ? C.paper2 : C.cream} stroke={C.brown} strokeWidth="6" opacity={ph < 0.22 ? 1 : 0} />
      </g>
      <text x="400" y="150" textAnchor="middle" fontFamily={ruqaa} fontSize="120" fill={C.crimson} opacity={ease(lt, 0.3, 1)}>
        عِلْم
      </text>
      <circle cx="400" cy="195" r="10" fill={C.gold} />
    </svg>
  );
};

const QMark: React.FC<{lt: number}> = ({lt}) => {
  const p = pop(lt, 0.15, 10);
  return (
    <svg viewBox="0 0 800 800" width={800} height={800} style={{transform: `scale(${p})`}}>
      <circle cx="400" cy="400" r="330" fill={C.cream} stroke={C.brown} strokeWidth="8" />
      <circle cx="400" cy="400" r="296" fill="none" stroke={C.gold} strokeWidth="3" strokeDasharray={`${ease(lt, 0.3, 1.6) * 1860} 2000`} />
      {Array.from({length: 8}, (_, i) => {
        const a = lt * 0.8 + (i * Math.PI) / 4;
        return <circle key={i} cx={400 + Math.cos(a) * 362} cy={400 + Math.sin(a) * 362} r="12" fill={i % 2 ? C.olive : C.crimson} />;
      })}
      <text x="400" y="560" textAnchor="middle" fontFamily={ruqaa} fontSize="560" fill={C.crimson} transform={`rotate(${Math.sin(lt * 1.6) * 4} 400 400)`}>
        ؟
      </text>
    </svg>
  );
};

const LABELS = ['الكتاب', 'السنة', 'الإجماع'];
const SUBS = ['القرآن الكريم', 'سنة النبي ﷺ', 'إجماع العلماء'];
const Evidence: React.FC<{sc: SceneT; t: number}> = ({sc, t}) => (
  <div style={{display: 'flex', direction: 'rtl', gap: 22, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    {LABELS.map((lb, i) => {
      const mt = markT(sc, lb);
      if (mt === null) return null;
      const p = pop(t, mt, 9);
      const scale = 2.6 - 1.6 * p;
      return (
        <div key={lb} style={{width: 300, height: 300, opacity: Math.min(1, p * 2), transform: `scale(${scale}) rotate(${(i - 1) * 6 + (1 - p) * -20}deg)`, position: 'relative'}}>
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill={C.cream} stroke={i === 2 ? C.crimson : C.olive} strokeWidth="9" />
            <circle cx="150" cy="150" r="120" fill="none" stroke={C.gold} strokeWidth="3" strokeDasharray="3 9" />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'rtl'}}>
            <div style={{fontFamily: ruqaa, fontSize: 64, color: i === 2 ? C.crimson : C.olive, lineHeight: 1.1}}>{lb}</div>
            <div style={{fontFamily: amiri, fontSize: 28, color: C.brown, marginTop: 8}}>{SUBS[i]}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const DayNight: React.FC<{sc: SceneT; t: number; lt: number}> = ({sc, t, lt}) => {
  const d = pop(t, markT(sc, 'day') ?? 1e9, 10);
  const n = pop(t, markT(sc, 'night') ?? 1e9, 10);
  const p = pop(lt, 0.15, 14);
  return (
    <svg viewBox="0 0 800 800" width={800} height={800} style={{transform: `scale(${p})`}}>
      <defs>
        <clipPath id="top"><rect x="0" y="0" width="800" height="400" /></clipPath>
        <clipPath id="bot"><rect x="0" y="400" width="800" height="400" /></clipPath>
      </defs>
      <circle cx="400" cy="400" r="330" fill="#f3d98a" clipPath="url(#top)" />
      <circle cx="400" cy="400" r="330" fill={C.ink} clipPath="url(#bot)" />
      <circle cx="400" cy="400" r="330" fill="none" stroke={C.brown} strokeWidth="9" />
      <line x1="70" y1="400" x2="730" y2="400" stroke={C.gold} strokeWidth="5" strokeDasharray="14 10" />
      {/* الشمس */}
      <g transform={`translate(400 215) scale(${d})`}>
        <g transform={`rotate(${lt * 30})`} stroke={C.crimson} strokeWidth="9" strokeLinecap="round">
          {Array.from({length: 12}, (_, i) => (
            <line key={i} x1="0" y1="-92" x2="0" y2="-128" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle r="70" fill={C.gold} stroke={C.crimson} strokeWidth="7" />
      </g>
      {/* القمر والنجوم */}
      <g transform={`translate(400 590) scale(${n})`}>
        <circle r="78" fill={C.cream} />
        <circle cx="38" cy="-22" r="68" fill={C.ink} />
        {[[-190, -20], [170, 40], [-120, 70], [120, -60]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5 + Math.sin(lt * 3 + i) * 2} fill={C.cream} />
        ))}
      </g>
      <text x="400" y="368" textAnchor="middle" fontFamily={ruqaa} fontSize="58" fill={C.ink} opacity={d}>النهار: صيام</text>
      <text x="400" y="450" textAnchor="middle" fontFamily={ruqaa} fontSize="58" fill={C.cream} opacity={n}>الليل: إفطار</text>
    </svg>
  );
};

const Scale: React.FC<{sc: SceneT; t: number; lt: number}> = ({sc, t, lt}) => {
  const ad = markT(sc, 'akhira') ?? 1e9;
  const tilt = 10 - 24 * pop(t, ad, 9) + Math.sin(lt * 1.5) * 1.2;
  const rad = (tilt * Math.PI) / 180;
  const L = 250;
  const ex = Math.cos(rad) * L;
  const ey = Math.sin(rad) * L;
  const p = pop(lt, 0.15, 14);
  const pan = (x: number, y: number, label: string, col: string) => (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="0" x2="-110" y2="150" stroke={C.brown} strokeWidth="4" />
      <line x1="0" y1="0" x2="110" y2="150" stroke={C.brown} strokeWidth="4" />
      <path d="M-130 150 H130 C110 215 -110 215 -130 150 Z" fill={col} stroke={C.brown} strokeWidth="5" />
      <text x="0" y="262" textAnchor="middle" fontFamily={ruqaa} fontSize="50" fill={C.ink}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 800 700" width={800} height={700} style={{transform: `scale(${p})`}}>
      <path d="M400 640 L400 150" stroke={C.brown} strokeWidth="14" strokeLinecap="round" />
      <path d="M300 650 H500" stroke={C.brown} strokeWidth="18" strokeLinecap="round" />
      <circle cx="400" cy="150" r="26" fill={C.gold} stroke={C.brown} strokeWidth="6" />
      <line x1={400 - ex} y1={150 - ey} x2={400 + ex} y2={150 + ey} stroke={C.brown} strokeWidth="14" strokeLinecap="round" />
      {pan(400 + ex, 150 + ey, 'علوم دنيوية', C.paper2)}
      {pan(400 - ex, 150 - ey, 'أوامر الله', C.olive)}
    </svg>
  );
};

const StampArt: React.FC<{word: string; lt: number}> = ({word, lt}) => {
  const p = pop(lt, 0.45, 8);
  const sc = 2.8 - 1.8 * p;
  const shake = lt > 0.5 && lt < 0.8 ? Math.sin(lt * 90) * 6 * (0.8 - lt) : 0;
  return (
    <div style={{width: 700, height: 700, transform: `translateX(${shake}px) scale(${sc}) rotate(-9deg)`, opacity: Math.min(1, p * 2)}}>
      <svg viewBox="0 0 700 700" width="700" height="700">
        <circle cx="350" cy="350" r="320" fill="none" stroke={C.crimson} strokeWidth="16" />
        <circle cx="350" cy="350" r="285" fill="none" stroke={C.crimson} strokeWidth="5" />
        <circle cx="350" cy="350" r="250" fill="none" stroke={C.crimson} strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
        <text x="350" y="410" textAnchor="middle" fontFamily={ruqaa} fontSize={word.length > 5 ? 160 : 210} fill={C.crimson} fontWeight="700">{word}</text>
      </svg>
    </div>
  );
};

const PILLARS = ['الشهادتان', 'الصلاة', 'الزكاة', 'الحج', 'الصيام'];
const Pillars: React.FC<{sc: SceneT; t: number; lt: number}> = ({sc, t, lt}) => {
  const crack = markT(sc, 'crack') ?? 1e9;
  const fall = ease(t, crack + 0.15, crack + 2.2);
  const shake = t > crack && t < crack + 0.5 ? Math.sin(t * 120) * 8 : 0;
  const lastUp = ease(t, markT(sc, 'p4') ?? 1e9, (markT(sc, 'p4') ?? 1e9) + 0.5);
  return (
    <svg viewBox="0 0 900 760" width={900} height={760} style={{transform: `translateX(${shake}px)`}}>
      {/* السقف */}
      <g transform={`translate(450 ${230 + fall * 10}) rotate(${fall * -7}) translate(-450 -230)`} opacity={ease(t, (markT(sc, 'p4') ?? 1e9) + 0.5, (markT(sc, 'p4') ?? 1e9) + 1.1)}>
        <path d="M60 230 L450 60 L840 230 Z" fill={C.paper2} stroke={C.brown} strokeWidth="8" strokeLinejoin="round" />
        <text x="450" y="205" textAnchor="middle" fontFamily={ruqaa} fontSize="62" fill={C.crimson}>الإسلام</text>
      </g>
      {PILLARS.map((nm, i) => {
        const mt = markT(sc, `p${i}`) ?? 1e9;
        const grow = ease(t, mt, mt + 0.45);
        const isLast = i === 4;
        const h = 400 * grow;
        const x = 790 - i * 160; // من اليمين لليسار
        const rot = isLast ? fall * 38 : 0;
        const dy = isLast ? fall * 120 : 0;
        const dx = isLast ? fall * -50 : 0;
        return (
          <g key={nm} transform={`translate(${x - 60} ${700 - h}) translate(${dx} ${dy}) rotate(${rot} 60 ${h})`}>
            <rect width="120" height={h} fill={isLast ? C.crimson : C.cream} stroke={C.brown} strokeWidth="6" />
            <rect x="-12" y="-14" width="144" height="22" fill={C.gold} stroke={C.brown} strokeWidth="4" />
            <text transform={`translate(70 ${h - 20}) rotate(-90)`} fontFamily={ruqaa} fontSize="50" fill={isLast ? C.cream : C.ink} opacity={grow > 0.7 ? 1 : 0}>{nm}</text>
            {isLast && t > crack && (
              <path d={`M60 0 L45 ${h * 0.25} L75 ${h * 0.45} L40 ${h * 0.7} L68 ${h}`} fill="none" stroke={C.ink} strokeWidth="6" strokeLinejoin="round" opacity={ease(t, crack, crack + 0.2)} />
            )}
          </g>
        );
      })}
      <rect x="20" y="700" width="860" height="26" fill={C.brown} />
      <text x="450" y="752" textAnchor="middle" fontFamily={amiri} fontSize="1" fill="none">{lastUp}</text>
    </svg>
  );
};

const Dialog: React.FC<{sc: SceneT; t: number; lt: number}> = ({sc, t, lt}) => {
  const active = sc.cues.find((c) => t >= c.s && t < c.e + 0.2)?.kind;
  const p = pop(lt, 0.2, 12);
  const med = (label: string, col: string, on: boolean) => (
    <div style={{width: 330, height: 330, borderRadius: '50%', background: C.cream, border: `10px solid ${col}`, boxShadow: on ? `0 0 0 14px ${col}33, 0 0 80px ${col}88` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 1.14 : 0.94})`, transition: 'none', fontFamily: ruqaa, fontSize: 70, color: col, textAlign: 'center', direction: 'rtl', lineHeight: 1.2}}>
      {label}
    </div>
  );
  return (
    <div style={{display: 'flex', direction: 'rtl', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 0, transform: `scale(${p})`}}>
      {med('الأعرابي', C.olive, active === 'a')}
      <svg width="170" height="80" viewBox="0 0 170 80">
        <line x1="10" y1="40" x2="160" y2="40" stroke={C.gold} strokeWidth="5" strokeDasharray="10 10" />
        <circle cx={160 - ((lt * 90) % 150)} cy="40" r="9" fill={C.crimson} />
      </svg>
      {med('النبي ﷺ', C.crimson, active === 'p')}
    </div>
  );
};

const VisualView: React.FC<{sc: SceneT; t: number; lt: number}> = ({sc, t, lt}) => {
  switch (sc.visual) {
    case 'crescent': return <Crescent lt={lt} />;
    case 'book': return <Book lt={lt} />;
    case 'qmark': return <QMark lt={lt} />;
    case 'evidence': return <Evidence sc={sc} t={t} />;
    case 'daynight': return <DayNight sc={sc} t={t} lt={lt} />;
    case 'scale': return <Scale sc={sc} t={t} lt={lt} />;
    case 'stamp': return <StampArt word={sc.stamp ?? ''} lt={lt} />;
    case 'pillars': return <Pillars sc={sc} t={t} lt={lt} />;
    case 'dialog': return <Dialog sc={sc} t={t} lt={lt} />;
    default: return null;
  }
};

/* ───────────────────────── العنوان ───────────────────────── */

const Header: React.FC<{sc: SceneT; lt: number}> = ({sc, lt}) => {
  const p = ease(lt, 0.15, 1.0);
  const u = ease(lt, 0.9, 1.5);
  return (
    <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', direction: 'rtl'}}>
      <div style={{fontFamily: amiri, fontSize: 36, color: C.olive, opacity: ease(lt, 0, 0.4), fontWeight: 700}}>❖ {sc.tag} ❖</div>
      <div style={{fontFamily: ruqaa, fontSize: sc.title.length > 16 ? 78 : 96, color: C.crimson, lineHeight: 1.35, clipPath: `inset(-30% 0 -30% ${(1 - p) * 100}%)`, fontWeight: 700}}>
        {sc.title}
      </div>
      <svg width="620" height="26" viewBox="0 0 620 26" style={{display: 'block', margin: '0 auto'}}>
        <path d="M610 13 C500 0 420 26 310 13 C200 0 120 26 10 13" fill="none" stroke={C.gold} strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - u} />
      </svg>
    </div>
  );
};

/* ───────────────────────── الترجمة (Captions) ───────────────────────── */

type Variant = 'scroll' | 'ribbon' | 'tag' | 'ink' | 'ayah' | 'hadith' | 'key';
const CYCLE: Variant[] = ['scroll', 'ribbon', 'tag', 'ink'];

const Words: React.FC<{cue: CueT; t: number; size: number; color: string; hi: string; font: string; weight?: number}> = ({cue, t, size, color, hi, font, weight = 400}) => {
  const words = cue.text.split(' ');
  const wts = words.map((w) => w.length + 1);
  const tot = wts.reduce((a, b) => a + b, 0);
  const span = Math.max(0.6, (cue.e - cue.s) * 0.82);
  let acc = 0;
  return (
    <div style={{direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `4px ${size * 0.26}px`, fontFamily: font, fontSize: size, lineHeight: 1.55, fontWeight: weight}}>
      {words.map((w, i) => {
        const ws = cue.s + (acc / tot) * span;
        acc += wts[i];
        const we = cue.s + (acc / tot) * span;
        const sh = pop(t, ws, 16);
        const active = t >= ws && t < we + 0.3;
        return (
          <span key={i} style={{display: 'inline-block', opacity: Math.min(1, sh * 1.5), transform: `translateY(${(1 - sh) * 28}px) scale(${0.85 + 0.15 * sh})`, color: active ? hi : color}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const sizeFor = (len: number) => (len <= 28 ? 74 : len <= 55 ? 62 : len <= 85 ? 52 : len <= 120 ? 45 : 40);

const CaptionView: React.FC<{cue: CueT; t: number; idx: number}> = ({cue, t, idx}) => {
  const variant: Variant =
    cue.kind === 'ayah' ? 'ayah'
    : cue.kind === 'hadith' ? 'hadith'
    : cue.kind === 'key' ? 'key'
    : cue.kind === 'a' ? 'tag'
    : cue.kind === 'p' ? 'ribbon'
    : cue.kind === 'n' ? 'ink'
    : cue.kind === 'x' ? 'scroll'
    : CYCLE[idx % CYCLE.length];
  const enter = pop(t, cue.s, 13);
  const exit = 1 - ease(t, cue.e - 0.05, cue.e + 0.2);
  const size = sizeFor(cue.text.length);
  const base: React.CSSProperties = {
    width: 900,
    opacity: Math.min(1, enter * 1.6) * exit,
    transform: `translateY(${(1 - enter) * 60}px) scale(${0.94 + 0.06 * enter})`,
  };

  if (variant === 'ribbon') {
    return (
      <div style={{...base, position: 'relative', padding: '34px 70px', background: C.crimson, clipPath: 'polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)', boxShadow: '0 10px 0 rgba(0,0,0,.15)'}}>
        <Words cue={cue} t={t} size={size} color={C.cream} hi={'#ffd56a'} font={amiri} weight={700} />
      </div>
    );
  }
  if (variant === 'tag') {
    return (
      <div style={{...base, transform: `${base.transform} rotate(-2deg)`, padding: '34px 54px', background: C.olive, borderRadius: 26, outline: `4px dashed ${C.cream}`, outlineOffset: -14}}>
        <Words cue={cue} t={t} size={size} color={C.cream} hi={'#ffd56a'} font={amiri} weight={700} />
      </div>
    );
  }
  if (variant === 'ink') {
    const u = ease(t, cue.s + 0.3, cue.s + 1.1);
    return (
      <div style={{...base, padding: '10px 20px'}}>
        <Words cue={cue} t={t} size={size + 6} color={C.ink} hi={C.crimson} font={amiri} weight={700} />
        <svg width="100%" height="24" viewBox="0 0 800 24" preserveAspectRatio="none">
          <path d="M790 12 C600 0 500 24 400 12 C300 0 200 24 10 12" fill="none" stroke={C.gold} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - u} />
        </svg>
      </div>
    );
  }
  if (variant === 'ayah') {
    return (
      <div style={{...base, position: 'relative', padding: '62px 60px 74px', background: C.cream, border: `6px double ${C.gold}`, borderRadius: 18, boxShadow: `0 0 0 8px ${C.paper2}, 0 12px 30px rgba(60,30,10,.25)`}}>
        <div style={{position: 'absolute', top: -34, left: 0, right: 0, textAlign: 'center', fontSize: 52, color: C.gold, lineHeight: 1}}>۞</div>
        <Words cue={cue} t={t} size={Math.min(size + 6, 66)} color={C.ink} hi={C.crimson} font={amiri} weight={700} />
        {cue.ref && (
          <div style={{position: 'absolute', bottom: -28, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{background: C.olive, color: C.cream, fontFamily: amiri, fontSize: 34, padding: '4px 34px', borderRadius: 30, direction: 'rtl', transform: `scale(${pop(t, cue.s + 0.6, 12)})`}}>{cue.ref}</div>
          </div>
        )}
      </div>
    );
  }
  if (variant === 'hadith') {
    return (
      <div style={{...base, position: 'relative', padding: '50px 70px', background: C.paper2, borderTop: `10px solid ${C.brown}`, borderBottom: `10px solid ${C.brown}`}}>
        <div style={{position: 'absolute', top: -18, right: 20, fontFamily: ruqaa, fontSize: 130, color: C.crimson, lineHeight: 1}}>”</div>
        <Words cue={cue} t={t} size={size} color={C.ink} hi={C.crimson} font={amiri} weight={700} />
      </div>
    );
  }
  if (variant === 'key') {
    return (
      <div style={{...base, transform: `${base.transform} rotate(${(1 - enter) * -6 - 1.5}deg)`, padding: '34px 56px', border: `10px solid ${C.crimson}`, background: `${C.cream}`, boxShadow: `10px 10px 0 ${C.crimson}55`}}>
        <Words cue={cue} t={t} size={size + 4} color={C.crimson} hi={C.ink} font={ruqaa} weight={700} />
      </div>
    );
  }
  // scroll
  return (
    <div style={{...base, position: 'relative', padding: '36px 90px', background: C.cream, borderTop: `7px solid ${C.brown}`, borderBottom: `7px solid ${C.brown}`}}>
      {[-1, 1].map((s) => (
        <div key={s} style={{position: 'absolute', top: -14, bottom: -14, [s < 0 ? 'left' : 'right']: -14, width: 40, borderRadius: 20, background: C.brown}} />
      ))}
      <Words cue={cue} t={t} size={size} color={C.ink} hi={C.crimson} font={amiri} weight={700} />
    </div>
  );
};

/* ───────────────────────── المشهد ───────────────────────── */

const SceneView: React.FC<{sc: SceneT; idx: number; t: number}> = ({sc, idx, t}) => {
  const lt = t - sc.t0;
  const dur = sc.t1 - sc.t0;
  const en = ENTRIES[idx % ENTRIES.length];
  const p = ease(lt, 0, 0.7);
  const out = ease(t, sc.t1 - 0.05, sc.t1 + 0.35);
  const push = 1 + 0.07 * (lt / dur);

  let ent: React.CSSProperties = {};
  if (en === 'rise') ent = {transform: `translateY(${(1 - p) * 140}px)`};
  if (en === 'wipe') ent = {clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`};
  if (en === 'page') ent = {transform: `perspective(1600px) rotateY(${(1 - p) * -80}deg)`, transformOrigin: 'right center'};
  if (en === 'pop') ent = {transform: `scale(${0.6 + 0.4 * pop(lt, 0, 12)})`};

  // مقدمة السطح: parallax
  const camX = Math.sin(t * 0.21) * 18;
  const camY = Math.cos(t * 0.17) * 12;

  const cueStart = SCENES.slice(0, idx).reduce((a, s) => a + s.cues.length, 0);
  const visibleCues = sc.cues
    .map((c, i) => ({c, i}))
    .filter(({c}) => t >= c.s - 0.02 && t < c.e + 0.25);

  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 + out * 0.04})`}}>
      <AbsoluteFill style={ent}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${camX * 0.9}px, ${camY * 0.9}px) scale(${push})`}}>
          <Header sc={sc} lt={lt} />
          <div style={{position: 'absolute', top: 400, left: 0, right: 0, height: 760, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <VisualView sc={sc} t={t} lt={lt} />
          </div>
        </div>
        <div style={{position: 'absolute', top: 1190, left: 0, right: 0, height: 560, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translate(${camX * 0.4}px, ${camY * 0.4}px)`}}>
          {visibleCues.map(({c, i}) => (
            <div key={i} style={{position: 'absolute', display: 'flex', justifyContent: 'center'}}>
              <CaptionView cue={c} t={t} idx={cueStart + i} />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────────────────── التركيب ───────────────────────── */

export const A4Video: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Audio src={staticFile('a4.m4a')} />
      <Audio src={staticFile('sfx/ambience.mp3')} loop volume={0.1} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * FPS)} durationInFrames={FPS * 3} layout="none">
          <Audio src={staticFile(`sfx/${s.f}.mp3`)} volume={s.v * 0.8} />
        </Sequence>
      ))}
      <Background t={t} />
      {SCENES.map((sc, i) => (t >= sc.t0 && t < sc.t1 + 0.4 ? <SceneView key={i} sc={sc} idx={i} t={t} /> : null))}
      {/* شريط التقدم */}
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 78, height: 8, borderRadius: 4, background: `${C.brown}33`}}>
        <div style={{width: `${Math.min(100, (t / TOTAL_SEC) * 100)}%`, height: '100%', borderRadius: 4, background: C.crimson}} />
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="A4Video" component={A4Video} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
