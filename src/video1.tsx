/* Explainer: يتطلب public/voice.m4a و remotion. الخطوط من Google Fonts تلقائيًا. Composition id = AqlanaLesson */
import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,continueRender,delayRender,interpolate,random,registerRoot,spring,staticFile,useCurrentFrame} from 'remotion';
export const VOICE_FILE='voice.m4a';
const AB={position:'absolute'} as const;
export const WIDTH=1080;
export const HEIGHT=1920;
const SEG:[number,number,string][]=[
[1420,4120,"بسم الله والحمد لله والصلاة والسلام على رسول"],
[4120,9460,"الله وعلى آله وصحبه ومن والاه، اللهم لا"],
[9460,13200,"سهل إلا ما جعلته سهلًا، وأنت تجعل الحزن"],
[13200,19400,"سهلًا بإذن الله، مع بداية أول تسجيل في"],
[19400,22940,"مقتبل هذا الشهر المبارك ألا وهو شهر رمضان"],
[22940,26920,"إن شاء الله عز وجل، نحاول قدر المستطاع"],
[26920,31380,"أن نعمل مقدمة ولو بسيطة عن فضل"],
[31380,36940,"تعلم العلم الشرعي وإن الإنسان كما يبحث ويتعلم"],
[36940,42500,"في هذه الحياة يتعلم العلوم الدنيوية أو يتعلم"],
[42500,45880,"غير العلوم الدنيوية لابد أن يكون له نصيب"],
[45880,49880,"يتفقه فيه في دين الله تبارك وتعالى ويتعلم"],
[49880,52700,"سنة النبي صلى الله عليه وسلم لأن هذا هو"],
[52700,57500,"سبيل النجاة الوحيد الذي لابد أن يسلكه كل"],
[57500,64019,"امرأة أو كل بنت تؤمن بالله واليوم الآخر"],
[64019,68760,"لأن الإنسان عدو ما يجهل، فإذا تعلم ما"],
[68760,73000,"يجهل ازداد به اقتناعًا، وكلما ازداد به اقتناعًا"],
[73000,76600,"ازداد به يقينًا، وكلما ازداد به يقينًا ازداد"],
[76600,82740,"به تمسكًا، بل ازداد به عملًا لدين الله"],
[82740,87280,"تبارك وتعالى لذلك نقول أن الإنسان يجب أن"],
[87280,92280,"يفهم أن تعلم الدين فرض أن نتعلم الدين"],
[92280,98160,"واجب أن نتعلم السنة فرض من الله تبارك"],
[98160,101860,"وتعالى وفرض من النبي محمد صلى الله عليه"],
[101860,108060,"وسلم لذلك نقول أننا يجب أن نتعلم ونتعلم"],
[108060,112860,"ونتعلم فكلما ازداد الإنسان علم كلما ازداد قربا"],
[112860,115120,"من الله تبارك وتعالى. الكلام ده من أين؟"],
[115120,118020,"الكلام ده من كتاب الله عز وجل قال"],
[118020,121620,"الله عز وجل يَرْفَعُ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ"],
[124060,129620,"وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ فالله عز وجل يرفعك"],
[129620,133220,"بهذا العلم درجات ويرفعك بهذا العلم مكان عظيم"],
[133220,137200,"جدا ويرفعك بهذا العلم إلى مكان لم تحلم"],
[137200,142200,"به قط في الدنيا وفي الآخرة بل النبي"],
[142200,147400,"عليه الصلاة والسلام بيقول لك: علامة حب"],
[147400,150880,"الله عز وجل لك علامة رضا ربنا عز"],
[150880,156200,"وجل عنك، علامة الخير اللي إنت مقبلة عليه"],
[156200,160800,"إن إنت تتعلم دينك، إن إنت تبدأ تتعلم"],
[160800,163620,"دينك، إن إنت تبدأ تتعلم سنة النبي عليه"],
[163620,167020,"الصلاة والسلام ازاي كان بيصلي عليه الصلاة والسلام"],
[167020,171920,"ازاي كان بيصوم عليه الصلاة والسلام ازاي كان"],
[171920,175340,"بيقيم الليل عليه الصلاة والسلام ازاي كان يزكى"],
[175340,179100,"عليه الصلاة والسلام ازاي كان يصنع لقد كان"],
[179100,182780,"لقد كان لكم في رسول الله أسوة حسنة. طب الأسوة"],
[182780,186340,"هتيجي إزاي وإنت متعرفش هديه؟ الأسوة هتيجي"],
[186340,190160,"إزاي وإنت متعلمتش هو بيصلي إزاي؟ كل الناس"],
[190160,193360,"بتصلي لكن النبي كان بيصلي ازاي هو ده"],
[193360,197380,"المقصود كل الناس بتصلي لكن النبي كان بيركع"],
[197380,202240,"إزاي ويسجد إزاي، هو ده المقصود، لأن النبي"],
[202240,204980,"عليه الصلاة والسلام قال: صلوا كما رأيتموني،"],
[204980,209380,"صوموا كما علمتكم الصوم، قيموا كما علمتكم القيام"],
[209380,214360,"لكن الإنسان مش هينفع يقيم مع نفسه بدون"],
[214360,217480,"علم، بدون فهم، بدون إدراك، أو إنه هو"],
[217480,222780,"يؤدي العبادات بدون فهم، بدون إدراك، مستحيل! لو"],
[222780,227200,"إنسانة ما بتعرفش تخش المطبخ لازم تتعلم لو"],
[227200,231580,"إنسانة ما بتعرفش تخش المطبخ لازم تتعلم الطبيخ"],
[231580,238510,"وإلا طول عمرها هتبقى في وضع تاني خالص"],
[238510,242530,"ماشي؟ مش عاوزين نتكلم أكتر من كده، هتبقى"],
[242530,245350,"في وضع تاني خالص. ليه؟ إنه لازم تتعلم"],
[246220,250850,"لازم تتعلم، وإلا ستكون في مكانة"],
[250850,255029,"رديئة. الله عز وجل يقول في القرآن الكريم"],
[255029,258610,"هو الذي أرسل رسوله بالهدى ودين"],
[258610,262870,"الحق ليظهره على الدين كله ولو كره المشركون"],
[262870,266250,"يعني ليظهره على الدين كله الله عز وجل"],
[266250,269630,"يقول: إن ربنا عز وجل أرسل النبي عليه الصلاة"],
[269630,273970,"والسلام بالهدى وهو العلم، ودين الحق هو"],
[273970,280190,"العمل. العلم والعمل سبب إظهار الدين، العلم والعمل"],
[280190,284010,"سبب نصرة الدين العلم والعمل سبب نصرة النبي"],
[284010,287570,"صلى الله عليه وسلم وسبب انتصار هذه الأمة"],
[287570,292190,"بدون علم بدون عمل، ما تسواش ولا حاجة"],
[293890,299610,"الله عز وجل قال: هل يستوي الذين يعلمون"],
[299610,306690,"والذين لا يعلمون؟ مستحيل! هل يستوي الذين يتعلمون"],
[306690,309770,"هدي النبي عليه الصلاة والسلام يتعلمون سنة النبي"],
[309770,313010,"عليه الصلاة والسلام يتعلمون صفة صلاة النبي عليه"],
[313010,316070,"الصلاة والسلام يتعلمون كيف كان ينام كيف كان"],
[316070,318570,"يقوم كيف كان يأكل كيف كان يشرب كيف"],
[318570,321570,"كان يلبس كيف كان يصنع عليه الصلاة والسلام"],
[321570,324250,"مع جيرانه، كيف كان يصنع مع أولاده، كيف"],
[324250,327290,"كان يصنع مع أصحابه، كيف كان يتعامل في"],
[327290,330530,"الحياة عليه الصلاة والسلام اللي ما يعرفش كل"],
[330530,333750,"ده هيستوي مع اللي يعرف كل ده؟ مستحيل"],
[333750,335930,"لا في السعادة ولا في الراحة ولا في"],
[335930,341210,"الاستقرار. اللي هيعرض طبعًا عن تعلم الدين هيصاب بمصايب"],
[341210,343970,"كتير جدًا، هو مش واخد باله منها، ربما"],
[343970,347530,"بيتخبط في الحياة. الله عز وجل قال: ومن"],
[347530,351910,"أعرض عن ذكري، أي تعلم كتاب الله وسنة"],
[351910,355130,"نبيه صلى الله عليه وسلم، فإن له معيشة"],
[355130,358690,"ضنكًا، فإن له معيشة ضنكًا ونحشره يوم القيامة"],
[358690,362090,"أعمى، لأنه كان جاهل. قال: رب لم حشرتني"],
[362090,365750,"أعمى وقد كنت بصيرًا؟ قال: كذلك أتتك آياتنا"],
[365750,373080,"فنسيتها وكذلك اليوم تنسى. نسي آيات ربنا عز"],
[373080,375260,"وجل لم يتعلمها لم يتفقه في دين الله"],
[375260,377680,"تبارك وتعالى قال النبي صلى الله عليه وسلم"],
[377680,382280,"من يرد الله به خيرا يفقه في الدين"],
[382280,386060,"ومن يرد الله به شرا لا يفقه في"],
[386060,389380,"الدين يجعله كالأنعام يقول الحسن البصري عليه رحمة"],
[389380,395200,"لولا العلم لصار الناس كالأنعام بلا راعٍ"],
[395200,401760,"لولا العلم لصار الناس كالأنعام، يعملون كالأنعام، يعيشون"],
[401760,408160,"كالأنعام يقومون كالأنعام لولا العلم لصار الناس كالأنعام"],
[408160,411400,"بلا راعٍ والعياذ بالله. بل النبي عليه الصلاة"],
[411400,416880,"والسلام يقول: من سلك طريقًا يلتمس به علمًا"],
[416880,423940,"سهّل الله له طريقًا إلى الجنة. العلم هو"],
[423940,427120,"الذي سيسهل طريق الجنة العلم هو الذي سيأخذ"],
[427120,431020,"بإيدك إلى طريق الجنة العلم هو الذي سيوصلك"],
[431020,435980,"لطلب مرضات الله تبارك وتعالى وطلب مرضات رسوله"],
[435980,438000,"صلى الله عليه وسلم. كيف؟"],
[438000,442740,"قال الله عز وجل: قل هذه سبيلي أدعو"],
[442740,448140,"إلى الله على بصيرة، على فهم، على علم"],
[448140,452600,"على إدراك، على وعي، على بصيرة، أنا ومن"],
[452600,456060,"اتبعني. إذن اللي يريد أن يتابع النبي"],
[456580,458800,"يعبد ربنا على علم. اللي يريد أن يتابع"],
[458800,463500,"النبي يجب أن يفهم ويجب أن يتعلم أن"],
[463500,470560,"طلب العلم الشرعي طلب العلوم الشرعية تعلم الدين"],
[470560,474680,"تعلم السنة فرض عين على كل مسلم ومسلمة في"],
[474680,478840,"هذا الزمان بالذات. ماشي؟ أحيانًا يصبح فرض"],
[478840,481640,"كفاية نشر العلم بين الناس، لكن مع كثرة"],
[481640,484800,"الجهل في البيوت ومع كثرة الجهل بسنة النبي"],
[484800,487160,"عليه الصلاة والسلام وجب على كل الناس ان"],
[487160,490880,"ينفر لتعلم كتاب الله عز وجل وسنة النبي"],
[490880,493380,"محمد صلى الله عليه وسلم كل يوم بنقرأ"],
[493380,497720,"في سورة الفاتحة: اهدنا الصراط المستقيم. فكري كده"],
[497720,502560,"معايا اهدنا الصراط المستقيم صراط الذين انعمت عليهم"],
[502560,506360,"الفاتحة اللي إنت بتقرأها في كل ركعة في"],
[506360,510980,"كل صلاة بالليل بالنهار تفكري كده تتدبري فيها"],
[510980,515600,"اهدنا الصراط المستقيم صراط الذين أنعمت عليهم. مين؟"],
[515600,521700,"اللي ربنا أنعم عليهم. غير المغضوب عليهم: مين؟"],
[521700,525680,"اللي ربنا غضب عليهم. ولا الضالين: مين؟ اللي ربنا أضلهم"],
[528700,535100,"اسمعي اهدنا الصراط المستقيم صراط الذين انعمت عليهم"],
[535100,539820,"الذين تعلموا العلم وعملوا به، ده ربنا عز"],
[539820,543940,"وجل رضي عنهم وأنعم عليهم وأراد بهم خيرًا"],
[544560,551220,"غير المغضوب عليهم: اليهود، لأنهم تعلموا العلم ولم"],
[551220,556580,"يعملوا به تعلموا العلم وتركوه عرفوا الحلال من"],
[556580,560640,"الحرام ومع ذلك ارتكبوا الحرام كما قال الله"],
[560640,566900,"عز وجل: الذين آتيناهم الكتاب يعرفونه كما يعرفون"],
[566900,572200,"أبناءهم، يعرفون النبي صلى الله عليه وسلم لكنهم"],
[572200,577260,"تكبروا ولم يطيعوا وكفروا بالنبي صلى الله عليه"],
[577260,580020,"وسلم وكفروا بهدي النبي صلى الله عليه وسلم"],
[580020,583680,"فالله عز وجل يقول اهدنا الصراط المستقيم صراط"],
[583680,586060,"الذين أنعمت عليهم، أصحاب العلم النافع والعمل"],
[586060,590320,"الصالح. غير المغضوب عليهم: نعوذ من طريقة اليهود"],
[590320,596000,"ومن أفعال اليهود. ولا الضالين: أفعال النصارى، الذين"],
[596000,600240,"تركوا تعلم الدين لم يتعلموا الدين وعابدوا الله"],
[600240,604760,"على جهل. إذن هم ثلاثة: واحد بيتعلم الدين"],
[604760,608420,"وبيعمل به او واحد بتعلم الدين او عارف"],
[608420,612720,"الحلال من الحرام ولا عارف الحلال من الحرام"],
[612720,615220,"لا يعرفوا الحياة خلاص الأول ده صفة اللي"],
[615220,618500,"ربنا أنعم عليهم اللي هم تعلموا وعملوا طيب"],
[618500,620820,"اللي تعلموا وما عملش ده بياخد صفة من"],
[620820,625180,"صفات اليهود طيب اللي مش عاوز يتعلم ومش"],
[625180,628760,"عارف يعمل ازاي وعمل يتخبط في الحياة كما"],
[628760,634000,"يتخبط الناس ده بتاخد صفة النصارى وتتشبه بالنصارى"],
[634000,639840,"والعياذ بالله وتتشبه بالنصارى والعياذ بالله لذلك لابد"],
[639840,644340,"للإنسان أن يتعلم دينه وأن يتعلم سنة النبي"],
[644340,646200,"صلى الله عليه وسلم حتى ينجو في هذه"],
[646200,649720,"الحياة ويكون من الناجين في الدنيا والآخرة. نسأل"],
[649720,653260,"الله العلي العظيم لنا ولكم التوفيق والسداد والإعانة"],
[653260,656620,"ونسأل الله العلي العظيم أن يبلغنا وإياكم رمضان"],
[656620,659760,"وأن يجعلنا من المحسنين وأن يعيننا على صيامه"],
[659760,664360,"وقيامه وحسن عبادته إنه ولي ذلك والقادر عليه"],
[664690,666600,"سبحانك اللهم وبحمدك، أشهد أن لا إله إلا"],
[666600,668160,"أنت، أستغفرك وأتوب إليك"],
];
const segments=SEG.map(([s,e,t])=>({s,e,t}));
export const FPS=30;
export const TOTAL_MS=668160;
export const DURATION=Math.round((TOTAL_MS*FPS)/1000) + 50;
const msToFrame=(ms:number)=>Math.round((ms*FPS)/1000);
const frameToMs=(f:number)=>(f*1000)/FPS;
const clamp=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,v));
const NB=15;
const energyAt=(frame:number)=>{
const ms=frameToMs(frame);
let on=0;
for (let i=0; i<segments.length; i++) {
const sg=segments[i];
if (ms >= sg.s - 80&&ms <= sg.e + 120) {
on=Math.max(on,clamp(Math.min((ms - sg.s + 80)/160,(sg.e + 120 - ms)/160)));
}
}
const bands=Array.from({length:NB},(_,j)=>{
const w=Math.abs(Math.sin(frame*0.31 + j*1.7)*Math.cos(frame*0.17 + j*0.9));
return clamp(0.04 + on*(0.18 + 0.7*w*(1 - (j/NB)*0.45)));
});
const rms=clamp(0.06 + on*(0.45 + 0.35*Math.abs(Math.sin(frame*0.5))));
return {rms,bands};
};
const FONT_BODY='Cairo, sans-serif';
const FONT_TEXT='Amiri, serif';
const FONT_QURAN="'Amiri Quran', Amiri, serif";
const FONT_TITLE="'Reem Kufi', Cairo, sans-serif";
const FONTS_READY:Promise<unknown>=typeof document==='undefined'?Promise.resolve() :new Promise<void>((res)=>{const l=document.createElement('link'); l.rel='stylesheet'; l.href='https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&family=Amiri:wght@400;700&family=Amiri+Quran&family=Reem+Kufi:wght@400;700&display=swap'; l.onload=()=>res(); l.onerror=()=>res(); document.head.appendChild(l);}).then(()=>Promise.all(['600 40px Cairo','800 40px Cairo','400 40px Amiri','400 40px "Amiri Quran"','400 40px "Reem Kufi"'].map((f)=>document.fonts.load(f,'ابت'))));
const C={
gold:'#e3bf62',goldLight:'#fff0b8',goldDark:'#a67c1f',
cream:'#fff7e3',emerald:'#0a3b36',emeraldDeep:'#05262a',teal:'#1e9c86',
green:'#2fbf8f',ruby:'#e0675f',rubyDeep:'#3a1615',amber:'#f2a93b',
};
type IconName='book' | 'moon' | 'heart' | 'star' | 'check' | 'question' | 'house' | 'sun';
type Tone='gold' | 'green' | 'ruby' | 'amber';
type Item={
ms:number; label:string; sub?:string; icon?:IconName; tone?:Tone;
focus?:[number,number][];
};
type Part={text:string; from:number; to:number};
type Base={id:string; start:number; title:string};
type Chapter=Base &
(
| {scene:'title'}
| {scene:'list'; mode:'stack' | 'fixed'; connect?:boolean; items:Item[]; heading?:{ms:number; text:string}}
| {scene:'verse'; kind:'quran' | 'hadith' | 'quote'; label?:string; source?:string; parts:Part[]}
| {scene:'balance'; items:Item[]; verdictMs:number}
| {scene:'phrases'; phrases:{ms:number; text:string}[]}
);
const chapters:Chapter[]=[
{id:'intro',start:0,title:'مقدمة رمضانية',scene:'title'},
{id:'why',start:22940,title:'فضل العلم الشرعي',scene:'list',mode:'stack',items:[
{ms:26920,label:'مقدمة في فضل العلم الشرعي',icon:'book'},
{ms:36940,label:'العلوم الدنيوية',sub:'نتعلمها ونبحث فيها',icon:'sun'},
{ms:45880,label:'الفقه في دين الله',sub:'لا بد أن يكون لنا فيه نصيب',icon:'book'},
{ms:49880,label:'تعلّم سنة النبي',icon:'moon'},
{ms:52700,label:'سبيل النجاة الوحيد',icon:'check',tone:'green'},
{ms:57500,label:'لكل امرأة وبنت تؤمن بالله واليوم الآخر',icon:'heart'},
]},
{id:'chain',start:64019,title:'سلسلة العلم والعمل',scene:'list',mode:'fixed',connect:true,items:[
{ms:64019,label:'الإنسان عدو ما يجهل',icon:'question',tone:'ruby'},
{ms:67500,label:'يتعلم ما يجهل',icon:'book'},
{ms:70500,label:'يزداد اقتناعًا',icon:'check'},
{ms:74000,label:'يزداد يقينًا',icon:'star'},
{ms:77500,label:'يزداد تمسكًا',icon:'heart'},
{ms:80500,label:'يزداد عملًا لدين الله',icon:'moon',tone:'green'},
]},
{id:'fard',start:87280,title:'تعلّم الدين فرض',scene:'list',mode:'stack',items:[
{ms:89000,label:'تعلّم الدين فرض',icon:'check',tone:'green'},
{ms:92280,label:'تعلّم السنة واجب',icon:'book'},
{ms:104500,label:'نتعلّم.. ونتعلّم.. ونتعلّم',icon:'book'},
{ms:109000,label:'كلما ازداد علمًا ازداد قربًا من الله',icon:'heart',tone:'green'},
{ms:112860,label:'الكلام ده من أين؟',icon:'question'},
]},
{id:'v-mujadila',start:114840,title:'من كتاب الله',scene:'verse',kind:'quran',source:'سورة المجادلة · الآية ١١',parts:[
{text:'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ',from:118200,to:127800},
]},
{id:'love',start:129620,title:'علامة حب الله',scene:'list',mode:'stack',items:[
{ms:129620,label:'يرفعك الله بالعلم درجات',icon:'star',tone:'green'},
{ms:143000,label:'علامة حب الله لك',icon:'heart'},
{ms:157500,label:'أن تتعلم دينك وسنة نبيك',icon:'book',tone:'green'},
{ms:164000,label:'كيف كان يصلّي؟',icon:'moon'},
{ms:167500,label:'كيف كان يصوم؟',icon:'sun'},
{ms:172200,label:'كيف كان يقيم الليل؟',icon:'star'},
{ms:175700,label:'كيف كان يزكّي؟',icon:'heart'},
]},
{id:'v-uswa',start:179100,title:'من كتاب الله',scene:'verse',kind:'quran',source:'سورة الأحزاب · الآية ٢١',parts:[
{text:'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ',from:179300,to:182700},
]},
{id:'compare',start:186340,title:'كيف تكون الأسوة؟',scene:'list',mode:'stack',items:[
{ms:186340,label:'كيف تتحقق الأسوة بلا علم؟',icon:'question',tone:'ruby'},
{ms:190160,label:'كل الناس بتصلّي',icon:'moon'},
{ms:193800,label:'لكن كيف كان النبي يصلّي؟',icon:'star',tone:'green'},
{ms:197800,label:'كيف كان يركع؟ وكيف كان يسجد؟',icon:'book'},
]},
{id:'h-salah',start:202240,title:'حديث شريف',scene:'verse',kind:'hadith',source:'رواه البخاري',parts:[
{text:'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي',from:202700,to:205000},
]},
{id:'kitchen',start:209380,title:'مثال المطبخ',scene:'list',mode:'stack',items:[
{ms:209380,label:'عبادة بلا علم ولا فهم؟',icon:'question',tone:'ruby'},
{ms:222780,label:'إنسانة ما بتعرفش تخش المطبخ',icon:'house'},
{ms:227200,label:'لازم تتعلم الطبخ',icon:'book',tone:'green'},
{ms:231580,label:'وإلا هتفضل في وضع تاني خالص',icon:'question',tone:'ruby'},
{ms:246220,label:'لازم تتعلم.. وإلا مكانة رديئة',icon:'check',tone:'amber'},
]},
{id:'v-tawba',start:255029,title:'من كتاب الله',scene:'verse',kind:'quran',source:'سورة التوبة · الآية ٣٣',parts:[
{text:'هُوَ الَّذِي أَرْسَلَ رَسُولَهُ بِالْهُدَىٰ وَدِينِ الْحَقِّ لِيُظْهِرَهُ عَلَى الدِّينِ كُلِّهِ وَلَوْ كَرِهَ الْمُشْرِكُونَ',from:255300,to:262500},
]},
{id:'pillars',start:266250,title:'العلم والعمل',scene:'list',mode:'fixed',connect:false,items:[
{ms:266250,label:'الهدى = العلم',icon:'book',tone:'green'},
{ms:273970,label:'دين الحق = العمل',icon:'check',tone:'green'},
{ms:280190,label:'العلم والعمل سبب نصرة الدين',icon:'star'},
{ms:284010,label:'وسبب انتصار هذه الأمة',icon:'moon'},
{ms:287570,label:'بدون علم وعمل لا قيمة لشيء',icon:'question',tone:'ruby'},
]},
{id:'v-zumar',start:293890,title:'من كتاب الله',scene:'verse',kind:'quran',source:'سورة الزمر · الآية ٩',parts:[
{text:'هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ',from:296400,to:301500},
]},
{id:'balance',start:306690,title:'هل يستوون؟',scene:'balance',verdictMs:330530,items:[
{ms:313500,label:'كيف كان ينام'},
{ms:316200,label:'كيف كان يقوم'},
{ms:317200,label:'كيف كان يأكل'},
{ms:318300,label:'كيف كان يشرب'},
{ms:319600,label:'كيف كان يلبس'},
{ms:322000,label:'مع جيرانه'},
{ms:324600,label:'مع أولاده'},
{ms:326000,label:'مع أصحابه'},
{ms:328200,label:'كيف كان يتعامل في الحياة'},
]},
{id:'v-taha',start:341210,title:'من كتاب الله',scene:'verse',kind:'quran',source:'سورة طه · الآيات ١٢٤ – ١٢٦',parts:[
{text:'وَمَنْ أَعْرَضَ عَن ذِكْرِي فَإِنَّ لَهُ مَعِيشَةً ضَنكًا وَنَحْشُرُهُ يَوْمَ الْقِيَامَةِ أَعْمَىٰ',from:347000,to:358500},
{text:'قَالَ رَبِّ لِمَ حَشَرْتَنِي أَعْمَىٰ وَقَدْ كُنتُ بَصِيرًا ۝ قَالَ كَذَٰلِكَ أَتَتْكَ آيَاتُنَا فَنَسِيتَهَا ۖ وَكَذَٰلِكَ الْيَوْمَ تُنسَىٰ',from:359000,to:372800},
]},
{id:'h-khair',start:377680,title:'حديث شريف',scene:'verse',kind:'hadith',source:'متفق عليه',parts:[
{text:'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',from:377900,to:381800},
]},
{id:'hasan',start:389380,title:'قول السلف',scene:'verse',kind:'quote',label:'الحسن البصري رحمه الله',parts:[
{text:'لَوْلَا الْعِلْمُ لَصَارَ النَّاسُ كَالْأَنْعَامِ',from:389800,to:395000},
]},
{id:'path',start:411400,title:'طريق الجنة',scene:'verse',kind:'hadith',label:'حديث شريف · طريق الجنة',parts:[
{text:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ بِهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',from:412000,to:423500},
]},
{id:'v-yusuf',start:436000,title:'من كتاب الله',scene:'verse',kind:'quran',source:'سورة يوسف · الآية ١٠٨',parts:[
{text:'قُلْ هَٰذِهِ سَبِيلِي أَدْعُو إِلَى اللَّهِ ۚ عَلَىٰ بَصِيرَةٍ أَنَا وَمَنِ اتَّبَعَنِي',from:440800,to:452600},
]},
{id:'ayn',start:458800,title:'فرض عين',scene:'list',mode:'stack',items:[
{ms:458800,label:'من يتبع النبي يجب أن يفهم ويتعلم',icon:'book'},
{ms:470560,label:'فرض عين على كل مسلم ومسلمة',icon:'check',tone:'green'},
{ms:478840,label:'وأحيانًا يكون فرض كفاية',icon:'star'},
{ms:481640,label:'لكن مع كثرة الجهل في البيوت',icon:'house',tone:'ruby'},
]},
{id:'v-fatiha',start:490880,title:'سورة الفاتحة',scene:'verse',kind:'quran',source:'سورة الفاتحة · الآيتان ٦ – ٧',parts:[
{text:'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',from:493800,to:497500},
{text:'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',from:498000,to:504000},
{text:'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ',from:516500,to:521500},
{text:'وَلَا الضَّالِّينَ',from:522500,to:525800},
]},
{id:'columns',start:528700,title:'ثلاثة أصناف',scene:'list',mode:'fixed',connect:false,heading:{ms:600240,text:'الناس ثلاثة أصناف'},items:[
{ms:535100,label:'المُنعَم عليهم',sub:'تعلّموا العلم وعملوا به',icon:'check',tone:'green',focus:[[535100,543500],[615220,618500]]},
{ms:544560,label:'المغضوب عليهم',sub:'تعلّموا العلم ولم يعملوا به',icon:'question',tone:'ruby',focus:[[544560,566000],[618500,625180]]},
{ms:590320,label:'الضالّون',sub:'عبدوا الله على جهل',icon:'question',tone:'amber',focus:[[590320,604000],[625180,634000]]},
]},
{id:'closing',start:640000,title:'الخاتمة',scene:'phrases',phrases:[
{ms:640000,text:'العلم طريق النجاة'},
{ms:653260,text:'اللهم بلغنا رمضان'},
{ms:656620,text:'واجعلنا من المحسنين'},
{ms:659760,text:'وأعنّا على الصيام والقيام'},
{ms:664690,text:'سبحانك اللهم وبحمدك'},
]},
];
const chapterEnd=(i:number,total:number)=>(i + 1<chapters.length?chapters[i + 1].start :total);
const starPoints=(cx:number,cy:number,R:number,ratio=0.72,n=8)=>{
const pts:string[]=[];
for (let i=0; i<n*2; i++) {
const a=(Math.PI*i)/n - Math.PI/2;
const r=i % 2===0?R :R*ratio;
pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
}
return pts.join(' ');
};
const EightStar:React.FC<{size:number; fill?:string; stroke?:string; sw?:number; rotate?:number; style?:React.CSSProperties}>=({
size,fill='none',stroke=C.gold,sw=3,rotate=0,style,
})=>(
<svg width={size} height={size} viewBox="0 0 100 100" style={{transform:`rotate(${rotate}deg)`,...style}}>
<polygon points={starPoints(50,50,48)} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
<polygon points={starPoints(50,50,30,0.72)} fill="none" stroke={stroke} strokeWidth={sw*0.5} opacity={0.6} />
</svg>
);
const Crescent:React.FC<{size:number; color?:string}>=({size,color=C.gold})=>(
<svg width={size} height={size} viewBox="0 0 200 200">
<defs>
<mask id="cres">
<rect width="200" height="200" fill="white" />
<circle cx="128" cy="86" r="66" fill="black" />
</mask>
<linearGradient id="cresg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stopColor={C.goldLight} /><stop offset="1" stopColor={color} />
</linearGradient>
</defs>
<circle cx="100" cy="100" r="78" fill="url(#cresg)" mask="url(#cres)" />
<polygon points={starPoints(150,62,17,0.45,5)} fill={C.goldLight} />
</svg>
);
const Lantern:React.FC<{x:number; y?:number; scale?:number; phase?:number}>=({x,y=0,scale=1,phase=0})=>{
const f=useCurrentFrame();
const sway=Math.sin(f/28 + phase)*6;
const flick=0.75 + 0.25*Math.sin(f/5 + phase*3)*Math.sin(f/11);
return (
<div style={{...AB,left:x - 60*scale,top:y,width:120*scale,transformOrigin:'50% 0',transform:`rotate(${sway}deg)`}}>
<svg width={120*scale} height={300*scale} viewBox="0 0 120 300">
<line x1="60" y1="0" x2="60" y2="70" stroke={C.gold} strokeWidth="3" />
<path d="M40 70 Q60 40 80 70 Z" fill={C.gold} />
<path d="M30 78 H90 L100 100 H20 Z" fill={C.goldDark} stroke={C.gold} strokeWidth="2" />
<path d="M24 100 H96 L88 210 Q60 226 32 210 Z" fill={C.emeraldDeep} stroke={C.gold} strokeWidth="3" />
<ellipse cx="60" cy="158" rx="26" ry="44" fill={C.amber} opacity={flick} />
<ellipse cx="60" cy="158" rx="12" ry="26" fill={C.goldLight} opacity={flick} />
<path d="M44 100 L40 210 M76 100 L80 210 M60 100 V215" stroke={C.gold} strokeWidth="2" opacity="0.7" />
<path d="M30 214 H90 L80 232 H40 Z" fill={C.goldDark} stroke={C.gold} strokeWidth="2" />
<circle cx="60" cy="244" r="7" fill={C.gold} />
<path d="M60 251 L52 280 M60 251 L60 284 M60 251 L68 280" stroke={C.gold} strokeWidth="3" strokeLinecap="round" />
</svg>
</div>
);
};
const ICONS:Record<IconName,React.ReactNode>={
book:<path d="M3 5c3-1.2 6-1.2 9 1 3-2.200 6-2.200 9-1v13c-3-1.200-6-1.200-9 1-3-2.200-6-2.200-9-1zM12 6v13" />,
moon:<path d="M15 3a9 9 0 1 0 6 12A7 7 0 0 1 15 3z" />,
heart:<path d="M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z" />,
star:<polygon points={starPoints(12,12,9.500,0.5,5)} />,
check:<path d="M4 12.500l5 5 11-12" />,
question:<><path d="M8.500 9a3.500 3.500 0 1 1 5 3.100c-1 .6-1.500 1.200-1.500 2.400" /><circle cx="12" cy="18.500" r="0.800" fill="currentColor" /></>,
house:<path d="M3.500 11L12 4l8.500 7v9h-17zM10 20v-6h4v6" />,
sun:<><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>,
};
const Icon:React.FC<{name:IconName; size:number; color?:string}>=({name,size,color=C.goldLight})=>(
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.700" strokeLinecap="round" strokeLinejoin="round" style={{color}}>
{ICONS[name]}
</svg>
);
const P=Array.from({length:42},(_,i)=>({
x:random(`px${i}`)*1080,seed:random(`ps${i}`)*2400,sp:0.5 + random(`pv${i}`)*1.4,
s:3 + random(`pz${i}`)*7,ph:random(`pp${i}`)*6.28,
}));
const Background:React.FC=()=>{
const f=useCurrentFrame();
const {rms}=energyAt(f);
const pulse=0.55 + rms*0.45;
return (
<AbsoluteFill style={{background:`radial-gradient(120% 80% at 50% 38%, ${C.emerald} 0%, ${C.emeraldDeep} 55%, #031417 100%)`}}>
<svg width="1080" height="1920" style={{...AB,inset:0}}>
<defs>
<pattern id="khatam" width="180" height="180" patternUnits="userSpaceOnUse" patternTransform={`translate(${f * 0.45} ${f * 0.28})`}>
<polygon points={starPoints(90,90,62)} fill="none" stroke={C.gold} strokeWidth="1.600" opacity="0.16" />
<polygon points={starPoints(90,90,30,0.6)} fill="none" stroke={C.gold} strokeWidth="1.200" opacity="0.14" />
<circle cx="0" cy="0" r="5" fill={C.gold} opacity="0.2" /><circle cx="180" cy="180" r="5" fill={C.gold} opacity="0.2" />
<circle cx="180" cy="0" r="5" fill={C.gold} opacity="0.2" /><circle cx="0" cy="180" r="5" fill={C.gold} opacity="0.2" />
</pattern>
<radialGradient id="glow"><stop offset="0" stopColor={C.teal} stopOpacity="0.55" /><stop offset="1" stopColor={C.teal} stopOpacity="0" /></radialGradient>
</defs>
<rect width="1080" height="1920" fill="url(#khatam)" />
<circle cx="540" cy="760" r={620 + rms*90} fill="url(#glow)" opacity={pulse} />
</svg>
<div style={{...AB,left:540 - 650,top:760 - 650}}>
<EightStar size={1300} stroke={C.gold} sw={0.8} rotate={f*0.12} style={{opacity:0.22}} />
</div>
<svg width="1080" height="1920" style={{...AB,inset:0}}>
{P.map((p,i)=>{
const y=1920 - ((f*p.sp + p.seed) % 2400) + 240;
const x=p.x + Math.sin(f/40 + p.ph)*30;
const o=(0.35 + 0.65*Math.abs(Math.sin(f/18 + p.ph)))*(y>100&&y<1850?1 :0);
return <circle key={i} cx={x} cy={y} r={p.s*(0.8 + rms*0.6)} fill={i % 3===0?C.goldLight :C.gold} opacity={o*0.8} />;
})}
<rect x="26" y="26" width="1028" height="1868" rx="26" fill="none" stroke={C.gold} strokeWidth="3" opacity="0.65" />
<rect x="44" y="44" width="992" height="1832" rx="18" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.4" />
{[[44,44],[1036,44],[44,1876],[1036,1876]].map(([x,y],i)=>(
<g key={i} transform={`translate(${x} ${y}) rotate(${f * 0.6})`}>
<polygon points={starPoints(0,0,30)} fill={C.emeraldDeep} stroke={C.gold} strokeWidth="2.500" />
<circle r="6" fill={C.goldLight} />
</g>
))}
</svg>
<Lantern x={130} scale={0.9} phase={0} />
<Lantern x={950} scale={0.9} phase={2} />
<AbsoluteFill style={{background:'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)'}} />
</AbsoluteFill>
);
};
type Word={t:string; s:number; e:number};
type Chunk={s:number; e:number; words:Word[]};
const buildChunks=():Chunk[]=>{
const out:Chunk[]=[];
segments.forEach((seg)=>{
const ws=seg.t.split(' ').filter(Boolean);
const weights=ws.map((w)=>w.length + 1.5);
const total=weights.reduce((a,b)=>a + b,0);
let cur=seg.s;
const timed:Word[]=ws.map((t,i)=>{
const d=((seg.e - seg.s)*weights[i])/total;
const w={t,s:cur,e:cur + d};
cur += d;
return w;
});
let buf:Word[]=[];
let chars=0;
const flush=()=>{
if (buf.length) out.push({s:buf[0].s,e:buf[buf.length - 1].e,words:buf});
buf=[]; chars=0;
};
timed.forEach((w)=>{
if (buf.length >= 3||chars + w.t.length>20) flush();
buf.push(w); chars += w.t.length + 1;
if (/[.؟،:!]$/.test(w.t)&&buf.length >= 2) flush();
});
flush();
});
out.forEach((c,i)=>{
const next=out[i + 1];
c.e=Math.min(c.e + 250,next?next.s :c.e + 250);
});
return out;
};
const CHUNKS=buildChunks();
const gold2=`linear-gradient(135deg, ${C.goldLight}, ${C.gold} 50%, ${C.goldDark})`;
const polyRibbon='polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)';
const polyOct='polygon(34px 0, calc(100% - 34px) 0, 100% 34px, 100% calc(100% - 34px), calc(100% - 34px) 100%, 34px 100%, 0 calc(100% - 34px), 0 34px)';
const Frame:React.FC<{clip:string; padding:string; children:React.ReactNode}>=({clip,padding,children})=>(
<div style={{position:'relative',display:'inline-block'}}>
<div style={{...AB,inset:0,background:gold2,clipPath:clip}} />
<div style={{...AB,inset:6,background:`linear-gradient(180deg, #0c4a43, ${C.emeraldDeep})`,clipPath:clip}} />
<div style={{position:'relative',padding}}>{children}</div>
</div>
);
const Captions:React.FC=()=>{
const frame=useCurrentFrame();
const ms=frameToMs(frame);
let idx=-1;
for (let i=0; i<CHUNKS.length; i++) if (ms >= CHUNKS[i].s&&ms<CHUNKS[i].e) {idx=i; break;}
if (idx<0) return null;
const ch=CHUNKS[idx];
const style=idx % 5;
const local=frame - msToFrame(ch.s);
const p=spring({frame:local,fps:FPS,config:{damping:11,mass:0.55,stiffness:160}});
const out=interpolate(ms,[ch.e - 120,ch.e],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const chars=ch.words.reduce((a,w)=>a + w.t.length,0);
const size=chars>17?70 :82;
const float=Math.sin(frame/14)*5;
const enter:Record<number,string>={
0:`scale(${0.6 + 0.4 * p})`,
1:`translateY(${(1 - p) * 90}px) scale(${0.9 + 0.1 * p})`,
2:`scaleX(${0.4 + 0.6 * p})`,
3:`rotate(${(1 - p) * -10}deg) scale(${0.7 + 0.3 * p})`,
4:`translateY(${(1 - p) * -70}px)`,
};
const text=(
<div style={{direction:'rtl',display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0 22px',maxWidth:860,lineHeight:1.45}}>
{ch.words.map((w,i)=>{
const on=ms >= w.s&&ms<w.e;
const past=ms >= w.e;
return (
<span key={i} style={{
fontFamily:FONT_BODY,fontWeight:800,fontSize:size,display:'inline-block',
color:on?C.goldLight :C.cream,opacity:past||on?1 :0.82,
transform:`scale(${on ? 1.12 : 1})`,transition:'none',
textShadow:on?`0 0 28px ${C.gold}, 0 4px 0 rgba(0,0,0,0.5)` :'0 4px 0 rgba(0,0,0,0.55)',
}}>{w.t}</span>
);
})}
</div>
);
let body:React.ReactNode;
if (style===0) body=(
<div style={{padding:'20px 54px',borderRadius:100,border:`5px solid ${C.gold}`,background:`rgba(5,38,42,0.88)`,boxShadow:`0 0 40px rgba(227,191,98,0.35)`}}>{text}</div>
);
else if (style===1) body=(
<div style={{padding:'60px 70px 26px',borderRadius:'260px 260px 34px 34px',border:`5px solid ${C.gold}`,background:`linear-gradient(180deg, #0e5249, ${C.emeraldDeep})`,position:'relative'}}>
<div style={{...AB,top:-34,left:'50%',marginLeft:-30}}><EightStar size={60} fill={C.emeraldDeep} stroke={C.gold} sw={4} rotate={frame*1.5} /></div>
{text}
</div>
);
else if (style===2) body=<Frame clip={polyRibbon} padding="24px 100px">{text}</Frame>;
else if (style===3) body=<Frame clip={polyOct} padding="22px 70px">{text}</Frame>;
else body=<Frame clip="inset(0 round 18px)" padding="22px 60px">{text}</Frame>;
return (
<div style={{...AB,left:0,right:0,top:1480,height:330,display:'flex',alignItems:'center',justifyContent:'center'}}>
<div style={{opacity:out,transform:`${enter[style]} translateY(${float}px)`}}>{body}</div>
</div>
);
};
const Waveform:React.FC=()=>{
const f=useCurrentFrame();
const {bands,rms}=energyAt(f);
const bars=[...bands.slice().reverse(),...bands.slice(1)];
const n=bars.length;
const w=20,gap=10,total=n*(w + gap);
return (
<svg width="1080" height="200" style={{...AB,left:0,top:1290}}>
<defs>
<linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stopColor={C.goldLight} /><stop offset="1" stopColor={C.goldDark} />
</linearGradient>
</defs>
<line x1="90" x2="990" y1="100" y2="100" stroke={C.gold} strokeWidth="2" opacity={0.25 + rms*0.4} />
{bars.map((v,i)=>{
const h=10 + Math.pow(v,1.2)*150*(0.55 + 0.7*(1 - Math.abs(i - n/2)/(n/2)));
return <rect key={i} x={540 - total/2 + i*(w + gap)} y={100 - h/2} width={w} height={h} rx={w/2} fill="url(#wf)" opacity={0.55 + v*0.45} />;
})}
</svg>
);
};
const Hud:React.FC=()=>{
const f=useCurrentFrame();
const ms=frameToMs(f);
let ci=0;
chapters.forEach((c,i)=>{if (ms >= c.start) ci=i;});
const ch=chapters[ci];
const p=spring({frame:f - msToFrame(ch.start),fps:FPS,config:{damping:12,mass:0.6}});
const prog=Math.min(1,ms/TOTAL_MS);
return (
<>
<div style={{...AB,top:120,left:0,right:0,display:'flex',justifyContent:'center'}}>
<div style={{display:'flex',alignItems:'center',gap:18,padding:'10px 46px',borderRadius:60,border:`3px solid ${C.gold}`,
background:'rgba(5,38,42,0.85)',transform:`scale(${0.7 + 0.3 * p})`,opacity:p,boxShadow:'0 0 30px rgba(227,191,98,0.3)'}}>
<EightStar size={34} fill={C.gold} stroke={C.goldLight} sw={3} rotate={f*2} />
<span style={{fontFamily:FONT_TITLE,fontSize:48,color:C.goldLight,letterSpacing:1}}>{ch.title}</span>
<EightStar size={34} fill={C.gold} stroke={C.goldLight} sw={3} rotate={-f*2} />
</div>
</div>
<div style={{...AB,left:100,right:100,top:1856,height:8,borderRadius:4,background:'rgba(255,255,255,0.12)'}}>
<div style={{...AB,right:0,top:0,bottom:0,width:`${prog * 100}%`,borderRadius:4,background:`linear-gradient(270deg, ${C.goldLight}, ${C.gold})`}} />
</div>
</>
);
};
const usePop=(start:number,ms:number,damping=11)=>{
const f=useCurrentFrame();
return spring({frame:f - msToFrame(ms - start),fps:FPS,config:{damping,mass:0.7,stiffness:150}});
};
const toneColor=(t:Tone='gold')=>({gold:C.gold,green:C.green,ruby:C.ruby,amber:C.amber}[t]);
const Card:React.FC<{label:string; sub?:string; icon?:IconName; tone?:Tone; h?:number; glow?:number; fs?:number}>=({
label,sub,icon='star',tone='gold',h=170,glow=0,fs=58,
})=>{
const f=useCurrentFrame();
const col=toneColor(tone);
return (
<div style={{
width:900,height:h,borderRadius:40,direction:'rtl',display:'flex',alignItems:'center',gap:28,padding:'0 34px',
background:`linear-gradient(120deg, rgba(5,38,42,0.94), rgba(14,82,73,0.88))`,border:`4px solid ${col}`,
boxShadow:`0 0 ${30 + glow * 50}px ${col}${glow > 0.3 ? 'aa' : '55'}, inset 0 0 40px rgba(0,0,0,0.35)`,boxSizing:'border-box',
}}>
<div style={{position:'relative',width:h*0.62,height:h*0.62,flex:'none'}}>
<EightStar size={h*0.62} fill={`${col}33`} stroke={col} sw={3} rotate={f*0.8} style={{...AB,inset:0}} />
<div style={{...AB,inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
<Icon name={icon} size={h*0.34} color={C.goldLight} />
</div>
</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontFamily:FONT_BODY,fontWeight:800,fontSize:fs,color:C.cream,lineHeight:1.25,textShadow:'0 3px 0 rgba(0,0,0,0.5)'}}>{label}</div>
{sub?<div style={{fontFamily:FONT_BODY,fontWeight:600,fontSize:fs*0.6,color:C.goldLight,marginTop:4}}>{sub}</div> :null}
</div>
</div>
);
};
const PopCard:React.FC<{start:number; item:Item; y:number; opacity?:number; scale?:number; h?:number; glow?:number; fs?:number}>=({
start,item,y,opacity=1,scale=1,h,glow=0,fs,
})=>{
const p=usePop(start,item.ms);
const f=useCurrentFrame();
const bob=Math.sin(f/16 + item.ms)*4;
return (
<div style={{...AB,left:90,top:y + bob,opacity:clamp(p)*opacity,
transform:`translateX(${(1 - Math.min(p, 1)) * 260}px) scale(${(0.85 + 0.15 * p) * scale})`,transformOrigin:'50% 50%'}}>
<Card label={item.label} sub={item.sub} icon={item.icon} tone={item.tone} h={h} glow={glow} fs={fs} />
</div>
);
};
const Stack:React.FC<{start:number; items:Item[]}>=({start,items})=>{
const f=useCurrentFrame();
const ms=start + frameToMs(f);
const offs=items.slice(4).reduce((a,it)=>a + clamp(usePop(start,it.ms,16)),0);
const shown=items.filter((i)=>ms >= i.ms - 50);
const newest=shown[shown.length - 1];
return (
<>
{items.map((it,i)=>{
const slot=i - offs;
const op=clamp(slot + 1)*(it===newest?1 :0.78);
return <PopCard key={i} start={start} item={it} y={300 + slot*230} opacity={op} glow={it===newest?1 :0} />;
})}
</>
);
};
const Fixed:React.FC<{start:number; items:Item[]; connect?:boolean; heading?:{ms:number; text:string}}>=({start,items,connect,heading})=>{
const f=useCurrentFrame();
const ms=start + frameToMs(f);
const top=heading?400 :270,bottom=1260;
const n=items.length;
const slotH=(bottom - top)/n;
const h=Math.min(190,slotH - (n>4?22 :40));
const hp=heading?usePop(start,heading.ms) :0;
return (
<>
{heading?(
<div style={{...AB,top:250,left:0,right:0,textAlign:'center',opacity:clamp(hp),transform:`scale(${0.6 + 0.4 * hp})`,
fontFamily:FONT_TITLE,fontSize:78,color:C.goldLight,textShadow:`0 0 30px ${C.gold}`}}>{heading.text}</div>
) :null}
{items.map((it,i)=>{
const y=top + i*slotH + (slotH - h)/2;
const focused=(it.focus ?? []).some(([a,b])=>ms >= a&&ms<b);
const anyFocus=items.some((x)=>(x.focus ?? []).some(([a,b])=>ms >= a&&ms<b));
const next=items[i + 1];
const lp=next?clamp(usePop(start,next.ms,18)) :0;
return (
<React.Fragment key={i}>
{connect&&next?(
<div style={{...AB,left:540 - 3,top:y + h,width:6,height:(slotH)*lp,background:`linear-gradient(${toneColor(it.tone)}, ${toneColor(next.tone)})`,borderRadius:3,boxShadow:`0 0 14px ${C.gold}`}} />
) :null}
<PopCard start={start} item={it} y={y} h={h} fs={h>150?56 :50} glow={focused?1 :0}
scale={focused?1.06 :1} opacity={anyFocus&&!focused?0.55 :1} />
</React.Fragment>
);
})}
</>
);
};
const ListScene:React.FC<{start:number; mode:'stack' | 'fixed'; items:Item[]; connect?:boolean; heading?:{ms:number; text:string}}>=(p) =>
p.mode==='stack'?<Stack start={p.start} items={p.items} /> :<Fixed start={p.start} items={p.items} connect={p.connect} heading={p.heading} />;
const VerseScene:React.FC<{start:number; kind:'quran' | 'hadith' | 'quote'; label?:string; source?:string; parts:Part[]}>=({start,kind,label,source,parts})=>{
const f=useCurrentFrame();
const ms=start + frameToMs(f);
const enter=spring({frame:f,fps:FPS,config:{damping:13,mass:0.8}});
const font=kind==='quran'?FONT_QURAN :FONT_TEXT;
const accent=kind==='quran'?C.gold :kind==='hadith'?C.green :C.amber;
const title=label ?? (kind==='quran'?'قرآن كريم' :'حديث شريف');
const total=parts.reduce((a,p)=>a + p.text.length,0);
const size=total<60?92 :total<110?78 :total<160?66 :56;
const [l,r]=kind==='quran'?['﴿','﴾'] :['«','»'];
return (
<div style={{...AB,left:80,top:250,width:920,height:1010,opacity:clamp(enter),transform:`scale(${0.88 + 0.12 * enter})`}}>
<div style={{...AB,inset:0,borderRadius:'460px 460px 44px 44px',border:`6px solid ${accent}`,
background:'linear-gradient(180deg, rgba(14,82,73,0.92), rgba(5,38,42,0.96))',boxShadow:`0 0 ${50 + 30 * Math.sin(f / 18)}px ${accent}66, inset 0 0 80px rgba(0,0,0,0.5)`}} />
<div style={{...AB,inset:22,borderRadius:'440px 440px 30px 30px',border:`2px solid ${accent}88`}} />
<div style={{...AB,top:-46,left:460 - 50}}><EightStar size={100} fill={C.emeraldDeep} stroke={accent} sw={4} rotate={f*1.2} /></div>
<div style={{...AB,top:96,left:0,right:0,textAlign:'center',fontFamily:FONT_BODY,fontWeight:800,fontSize:40,color:accent,letterSpacing:2}}>{title}</div>
<div style={{...AB,top:190,bottom:source?130 :70,left:70,right:70,display:'flex',flexDirection:'column',justifyContent:'center',gap:34,direction:'rtl',textAlign:'center'}}>
{parts.map((p,pi)=>{
const words=p.text.split(' ');
const w=words.map((x)=>x.length + 1);
const tot=w.reduce((a,b)=>a + b,0);
let acc=0;
return (
<div key={pi} style={{fontFamily:font,fontSize:size,lineHeight:1.85,color:C.cream}}>
{pi===0?<span style={{color:accent}}>{l} </span> :null}
{words.map((x,wi)=>{
const t0=p.from + ((p.to - p.from)*acc)/tot;
acc += w[wi];
const t1=p.from + ((p.to - p.from)*acc)/tot;
const vis=interpolate(ms,[t0 - 80,t0 + 160],[0.1,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const on=ms >= t0&&ms<t1;
return (
<span key={wi} style={{opacity:vis,color:on?C.goldLight :C.cream,display:'inline-block',marginInline:8,
transform:`translateY(${(1 - vis) * 14}px) scale(${on ? 1.08 : 1})`,textShadow:on?`0 0 26px ${C.gold}` :'0 3px 0 rgba(0,0,0,.45)'}}>{x}</span>
);
})}
{pi===parts.length - 1?<span style={{color:accent}}> {r}</span> :null}
</div>
);
})}
</div>
{source?<div style={{...AB,bottom:56,left:0,right:0,textAlign:'center',fontFamily:FONT_BODY,fontWeight:600,fontSize:38,color:C.goldLight}}>{source}</div> :null}
</div>
);
};
const BalanceScene:React.FC<{start:number; items:Item[]; verdictMs:number}>=({start,items,verdictMs})=>{
const f=useCurrentFrame();
const ms=start + frameToMs(f);
const count=items.filter((i)=>ms >= i.ms).length;
const cur=[...items].reverse().find((i)=>ms >= i.ms);
const v=usePop(start,verdictMs,9);
const k=clamp(count/items.length);
const target=2 + 16*k;
const wob=Math.sin(f/18)*(4*(1 - k)) + Math.sin(f/5)*0.6*(count>0?1 :0);
const a=(target + wob)*Math.PI/180;
const L=330,cx=540,cy=330;
const rx=cx + L*Math.cos(a),ry=cy + L*Math.sin(a);
const lx=cx - L*Math.cos(a),ly=cy - L*Math.sin(a);
const Pan:React.FC<{x:number; y:number; label:string; children?:React.ReactNode; color:string}>=({x,y,label,children,color})=>(
<g>
<line x1={x} y1={y} x2={x - 120} y2={y + 250} stroke={C.gold} strokeWidth="4" />
<line x1={x} y1={y} x2={x + 120} y2={y + 250} stroke={C.gold} strokeWidth="4" />
<path d={`M${x - 160} ${y + 250} H${x + 160} Q${x + 140} ${y + 320} ${x} ${y + 320} Q${x - 140} ${y + 320} ${x - 160} ${y + 250} Z`} fill={C.emeraldDeep} stroke={color} strokeWidth="6" />
{children}
<text x={x} y={y + 380} textAnchor="middle" fontFamily={FONT_BODY} fontWeight={800} fontSize="44" fill={color}>{label}</text>
</g>
);
return (
<>
<svg width="1080" height="1000" viewBox="0 0 1080 1000" style={{...AB,left:0,top:230}}>
<path d={`M${cx - 120} 900 H${cx + 120} L${cx + 40} 330 H${cx - 40} Z`} fill={C.emeraldDeep} stroke={C.gold} strokeWidth="6" />
<line x1={cx - L*Math.cos(a)} y1={ly} x2={rx} y2={ry} stroke={C.goldLight} strokeWidth="16" strokeLinecap="round" />
<circle cx={cx} cy={cy} r="30" fill={C.gold} stroke={C.goldLight} strokeWidth="5" />
<Pan x={lx} y={ly} label="لا يعلمون" color={C.ruby}>
<text x={lx} y={ly + 240} textAnchor="middle" fontFamily={FONT_TITLE} fontSize="90" fill={C.ruby} opacity="0.8">؟</text>
</Pan>
<Pan x={rx} y={ry} label="يعلمون" color={C.green} />
</svg>
{cur?(
<div style={{...AB,left:0,right:0,top:1220,textAlign:'center',fontFamily:FONT_BODY,fontWeight:800,fontSize:52,color:C.goldLight,textShadow:`0 0 24px ${C.gold}`}} key={cur.ms}>{cur.label}</div>
) :null}
<div style={{...AB,left:0,right:0,top:560,textAlign:'center',opacity:clamp(v),transform:`scale(${0.5 + 0.5 * v}) rotate(${-4 + 4 * v}deg)`,
fontFamily:FONT_TITLE,fontSize:120,color:C.goldLight,textShadow:`0 0 40px ${C.gold}, 0 8px 0 #000`}}>لا يستويان!</div>
</>
);
};
const PhrasesScene:React.FC<{start:number; phrases:{ms:number; text:string}[]}>=({start,phrases})=>{
const f=useCurrentFrame();
const ms=start + frameToMs(f);
const cur=[...phrases].reverse().find((p)=>ms >= p.ms) ?? phrases[0];
const p=usePop(start,cur.ms,10);
const enter=usePop(start,start,12);
return (
<>
<div style={{...AB,left:540 - 260,top:250,opacity:clamp(enter),transform:`scale(${0.5 + 0.5 * enter}) translateY(${Math.sin(f / 20) * 10}px)`}}>
<Crescent size={520} />
</div>
<div style={{...AB,left:540 - 380,top:250 - 120,opacity:0.5}}>
<EightStar size={760} stroke={C.goldLight} sw={0.7} rotate={f*0.5} />
</div>
<div key={cur.ms} style={{...AB,left:60,right:60,top:860,textAlign:'center',direction:'rtl',opacity:clamp(p),
transform:`scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 40}px)`,fontFamily:FONT_TITLE,fontSize:96,lineHeight:1.35,color:C.goldLight,
textShadow:`0 0 36px ${C.gold}, 0 8px 0 rgba(0,0,0,0.6)`}}>{cur.text}</div>
</>
);
};
const TitleScene:React.FC<{start:number}>=({start})=>{
const f=useCurrentFrame();
const cres=usePop(start,200,9);
const words=['فضل','طلب','العلم','الشرعي'];
const ram=usePop(start,19400,8);
return (
<>
<div style={{...AB,left:540 - 230,top:250,opacity:clamp(cres),transform:`scale(${cres}) rotate(${(1 - cres) * -40}deg) translateY(${Math.sin(f / 22) * 12}px)`}}>
<Crescent size={460} />
</div>
<div style={{...AB,left:0,right:0,top:740,textAlign:'center',fontFamily:FONT_BODY,fontWeight:600,fontSize:46,color:C.goldLight,opacity:clamp(usePop(start,900))}}>بسم الله الرحمن الرحيم</div>
<div style={{...AB,left:0,right:0,top:830,direction:'rtl',display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0 34px',padding:'0 60px'}}>
{words.map((w,i)=>{
const p=usePop(start,1500 + i*450,9);
return <span key={i} style={{fontFamily:FONT_TITLE,fontSize:138,lineHeight:1.25,color:C.cream,opacity:clamp(p),display:'inline-block',
transform:`translateY(${(1 - p) * 90}px) scale(${0.6 + 0.4 * p})`,textShadow:`0 0 40px ${C.gold}, 0 8px 0 rgba(0,0,0,.6)`}}>{w}</span>;
})}
</div>
<div style={{...AB,left:0,right:0,top:1210,textAlign:'center',opacity:clamp(ram),transform:`scale(${0.4 + 0.6 * ram}) rotate(${(1 - ram) * 6}deg)`,
fontFamily:FONT_TITLE,fontSize:96,color:C.goldLight,textShadow:`0 0 40px ${C.gold}`}}>رمضان مبارك</div>
</>
);
};
const SR=22050;
const rnd=(()=>{let a=7; return ()=>{a=(a*1664525 + 1013904223) >>> 0; return a/4294967296;};})();
const wav=(d:number,fn:(t:number)=>number,pk=0.8)=>{
const n=Math.floor(SR*d),x=Array.from({length:n},(_,i)=>fn(i/SR)),m=Math.max(1e-9,...x.map(Math.abs));
const b=new Uint8Array(44 + n*2),v=new DataView(b.buffer);
const w=(o:number,s:string)=>[...s].forEach((c,i)=>v.setUint8(o + i,c.charCodeAt(0)));
w(0,'RIFF'); v.setUint32(4,36 + n*2,true); w(8,'WAVEfmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
v.setUint32(24,SR,true); v.setUint32(28,SR*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*2,true);
x.forEach((y,i)=>v.setInt16(44 + i*2,Math.round((y/m)*pk*32767),true));
let s=''; for (let i=0; i<b.length; i += 8192) s += String.fromCharCode(...b.subarray(i,i + 8192));
return 'data:audio/wav;base64,' + btoa(s);
};
const TAU=2*Math.PI;
const SFX_URI:Record<string,string>={
pop:wav(0.18,(t)=>Math.sin(TAU*(250*t + 50*(1 - Math.exp(-18*t))))*Math.exp(-22*t)),
chime:wav(1.8,(t)=>[[1,1,2.2],[2.76,0.6,2.8],[5.4,0.35,4]].reduce((a,[r,m,d])=>a + m*Math.sin(TAU*660*r*t)*Math.exp(-t*d),0),0.7),
sparkle:wav(1,(t)=>[0,1,2,3,4,5,6,7].reduce((a,i)=>(t>i*0.08?a + Math.sin(TAU*(1760 + (i % 4)*520)*(t - i*0.08))*Math.exp(-(t - i*0.08)*14) :a),0),0.6),
boom:wav(0.9,(t)=>Math.sin(TAU*(48*t + 70*(1 - Math.exp(-9*t))/9))*Math.exp(-4.5*t),0.85),
whoosh:(()=>{let s=0; return wav(0.7,(t)=>{s += (0.03 + 0.4*Math.sin(Math.PI*t/0.7) ** 2)*(rnd()*2 - 1 - s); return s*Math.sin(Math.PI*t/0.7);},0.7);})(),
};
type Ev={ms:number; type:'whoosh' | 'pop' | 'chime' | 'sparkle' | 'boom'; vol:number; dur:number};
const events=():Ev[]=>{
const ev:Ev[]=[];
chapters.forEach((c,i)=>{
if (i>0) ev.push({ms:c.start - 100,type:'whoosh',vol:0.3,dur:25});
if (c.scene==='title') {ev.push({ms:200,type:'boom',vol:0.4,dur:30},{ms:19400,type:'sparkle',vol:0.3,dur:32});}
if (c.scene==='list') c.items.forEach((it)=>ev.push({ms:it.ms - 40,type:'pop',vol:0.22,dur:10}));
if (c.scene==='verse') ev.push({ms:c.parts[0].from - 500,type:'chime',vol:0.28,dur:66});
if (c.scene==='balance') {
c.items.forEach((it)=>ev.push({ms:it.ms - 40,type:'pop',vol:0.2,dur:10}));
ev.push({ms:c.verdictMs,type:'boom',vol:0.45,dur:30});
}
if (c.scene==='phrases') c.phrases.forEach((p)=>ev.push({ms:p.ms,type:'sparkle',vol:0.22,dur:32}));
});
return ev.filter((e)=>e.ms >= 0);
};
const EV=events();
const Sfx:React.FC=()=>(
<>
{EV.map((e,i)=>(
<Sequence key={i} from={msToFrame(e.ms)} durationInFrames={e.dur + 40}>
<Audio src={SFX_URI[e.type]} volume={e.vol} />
</Sequence>
))}
</>
);
const Shell:React.FC<{dur:number; children:React.ReactNode}>=({dur,children})=>{
const f=useCurrentFrame();
const a=interpolate(f,[0,14,dur - 10,dur],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const y=interpolate(f,[0,14],[50,0],{extrapolateRight:'clamp'});
return <AbsoluteFill style={{opacity:a,transform:`translateY(${y}px)`}}>{children}</AbsoluteFill>;
};
const SceneFor:React.FC<{c:Chapter}>=({c})=>{
switch (c.scene) {
case 'title':return <TitleScene start={c.start} />;
case 'list':return <ListScene start={c.start} mode={c.mode} items={c.items} connect={c.connect} heading={c.heading} />;
case 'verse':return <VerseScene start={c.start} kind={c.kind} label={c.label} source={c.source} parts={c.parts} />;
case 'balance':return <BalanceScene start={c.start} items={c.items} verdictMs={c.verdictMs} />;
case 'phrases':return <PhrasesScene start={c.start} phrases={c.phrases} />;
}
};
export const Explainer:React.FC=()=>{
const [fh]=useState(()=>delayRender('fonts'));
useEffect(()=>{FONTS_READY.then(()=>continueRender(fh)).catch(()=>continueRender(fh));},[fh]);
return (
<AbsoluteFill style={{backgroundColor:'#031417'}}>
<Background />
{chapters.map((c,i)=>{
const from=msToFrame(c.start);
const end=i + 1<chapters.length?msToFrame(chapterEnd(i,TOTAL_MS)) :DURATION;
return (
<Sequence key={c.id} from={from} durationInFrames={end - from + 8}>
<Shell dur={end - from + 8}><SceneFor c={c} /></Shell>
</Sequence>
);
})}
<Waveform />
<Captions />
<Hud />
<Audio src={staticFile(VOICE_FILE)} />
<Sfx />
</AbsoluteFill>
);
};
const Root:React.FC=()=>(
<Composition id="AqlanaLesson" component={Explainer} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
export {Root};
export default Explainer;
registerRoot(Root);
