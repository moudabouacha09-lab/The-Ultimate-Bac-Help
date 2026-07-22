export type LessonStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type Lesson = {
  id: string;
  title: string;
  category?: string; // e.g. "البناء الفكري" / "البناء اللغوي"
};

export type ProgressSubject = {
  id: string;
  name: string;
  icon: string;
  coefficient: number;
  color: "blue" | "green" | "violet" | "orange";
  lessons: Lesson[];
};

export const SCIENTIFIC_STREAM_PROGRESS_DATA: ProgressSubject[] = [
  {
    id: "science",
    name: "العلوم الطبيعية",
    icon: "🧬",
    coefficient: 6,
    color: "green",
    lessons: [
      // المجال الأول
      { id: "sci-1", title: "الوحدة 1: آليات تركيب البروتين", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-2", title: "الوحدة 2: العلاقة بين بنية ووظيفة البروتين", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-3", title: "الوحدة 3: التحفيز الإنزيمي", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-4", title: "الوحدة 4: الدفاع عن الذات (المناعة)", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      { id: "sci-5", title: "الوحدة 5: الاتصال العصبي", category: "المجال الأول: التخصص الوظيفي للبروتين" },
      // المجال الثاني
      { id: "sci-6", title: "الوحدة 1: التركيب الضوئي", category: "المجال الثاني: تحويل الطاقة" },
      { id: "sci-7", title: "الوحدة 2: تحويل الطاقة في الوسط الهوائي واللاهوائي", category: "المجال الثاني: تحويل الطاقة" },
      { id: "sci-8", title: "الوحدة 3: التحولات الطاقوية على المستوى الخلوي", category: "المجال الثاني: تحويل الطاقة" },
      // المجال الثالث
      { id: "sci-9", title: "الوحدة 1: بنية الكرة الأرضية", category: "المجال الثالث: التكتونية العامة" },
      { id: "sci-10", title: "الوحدة 2: اختفاء اللوح المحيطي والظواهر المرتبطة به", category: "المجال الثالث: التكتونية العامة" },
    ],
  },
  {
    id: "physics",
    name: "العلوم الفيزيائية",
    icon: "⚛",
    coefficient: 5,
    color: "blue",
    lessons: [
      { id: "phy-1", title: "الوحدة 1: المتابعة الزمنية لتحول كيميائي في وسط مائي" },
      { id: "phy-2", title: "الوحدة 2: تطور جملة ميكانيكية" },
      { id: "phy-3", title: "الوحدة 3: دراسة الظواهر الكهربائية (RC & RL)" },
      { id: "phy-4", title: "الوحدة 4: تطور جملة كيميائية نحو حالة التوازن (أحماض وأسس)" },
      { id: "phy-5", title: "الوحدة 5: التحولات النووية" },
      { id: "phy-6", title: "الوحدة 6: مراقبة تطور جملة كيميائية (الأسترة)" },
      { id: "phy-7", title: "الوحدة 7: التطورات المهتزة" },
      { id: "phy-8", title: "الوحدة 8: مفهوم الموجة" },
    ],
  },
  {
    id: "math",
    name: "الرياضيات",
    icon: "∑",
    coefficient: 5,
    color: "blue",
    lessons: [
      { id: "math-1", title: "الدوال العددية", category: "الدوال" },
      { id: "math-2", title: "الدالة الأسية", category: "الدوال" },
      { id: "math-3", title: "الدالة اللوغارتمية", category: "الدوال" },
      { id: "math-4", title: "الدوال العددية (النهايات)", category: "الدوال" },
      { id: "math-5", title: "التزايد المقارن ودراسة الدوال", category: "الدوال" },
      { id: "math-6", title: "المتتاليات العددية" },
      { id: "math-7", title: "الدوال الأصلية والحساب التكاملي" },
      { id: "math-8", title: "الاحتمالات" },
      { id: "math-9", title: "الأعداد المركبة", category: "الأعداد المركبة" },
      { id: "math-10", title: "التحويلات النقطية", category: "الأعداد المركبة" },
      { id: "math-11", title: "الهندسة في الفضاء" },
    ],
  },
  {
    id: "arabic",
    name: "اللغة العربية",
    icon: "أ",
    coefficient: 3,
    color: "green",
    lessons: [
      { id: "arb-1", title: "الشعر التعليمي", category: "البناء الفكري" },
      { id: "arb-2", title: "النثر العلمي المتأدب", category: "البناء الفكري" },
      { id: "arb-3", title: "الشعر المهجري (الرومانسي)", category: "البناء الفكري" },
      { id: "arb-4", title: "الشعر الاجتماعي", category: "البناء الفكري" },
      { id: "arb-5", title: "الشعر السياسي (القضية الفلسطينية والثورة الجزائرية)", category: "البناء الفكري" },
      { id: "arb-6", title: "فن المقال", category: "البناء الفكري" },
      { id: "arb-7", title: "المجاز العقلي والمرسل", category: "البناء اللغوي" },
      { id: "arb-8", title: "معاني وإعراب إذ، إذا، إذن، حينئذ", category: "البناء اللغوي" },
      { id: "arb-9", title: "الخبر وأنواعه", category: "البناء اللغوي" },
      { id: "arb-10", title: "الجمل التي لها محل من الإعراب", category: "البناء اللغوي" },
      { id: "arb-11", title: "الجمل التي لا محل لها من الإعراب", category: "البناء اللغوي" },
      { id: "arb-12", title: "بلاغة التشبيه", category: "البناء اللغوي" },
      { id: "arb-13", title: "أحكام الحال والتمييز والفرق بينهما", category: "البناء اللغوي" },
      { id: "arb-14", title: "أحكام البدل وعطف البيان", category: "البناء اللغوي" },
      { id: "arb-15", title: "بلاغة الاستعارة", category: "البناء اللغوي" },
      { id: "arb-16", title: "أحكام لو، لولا، لوما", category: "البناء اللغوي" },
      { id: "arb-17", title: "بلاغة الكناية", category: "البناء اللغوي" },
      { id: "arb-18", title: "إعراب المتعدي إلى أكثر من مفعول", category: "البناء اللغوي" },
    ],
  },
  {
    id: "history",
    name: "التاريخ",
    icon: "📜",
    coefficient: 1, // فصل التاريخ عن الجغرافيا للمتابعة
    color: "orange",
    lessons: [
      { id: "his-1", title: "بروز الصراع وتشكل العالم", category: "الوحدة 1: الحرب الباردة" },
      { id: "his-2", title: "مساعي الإنفرَاج الدولي", category: "الوحدة 1: الحرب الباردة" },
      { id: "his-3", title: "من الثنائية إلى الأحادية القطبية", category: "الوحدة 1: الحرب الباردة" },
      { id: "his-4", title: "العمل المسلح ورد فعل الاستعمار", category: "الوحدة 2: الثورة الجزائرية" },
      { id: "his-5", title: "إستعادة السيادة وبناء الدولة الجزائرية", category: "الوحدة 2: الثورة الجزائرية" },
      { id: "his-6", title: "العالم الثالث بين تراجع الاستعمار واستمرار التحرر", category: "الوحدة 3: العالم الثالث" },
      { id: "his-7", title: "فلسطين من تصفية الاستعمار واستمرارية التحرر", category: "الوحدة 3: العالم الثالث" },
    ],
  },
  {
    id: "geography",
    name: "الجغرافيا",
    icon: "🌍",
    coefficient: 1,
    color: "orange",
    lessons: [
      { id: "geo-1", title: "إشكالية التقدم والتخلف", category: "الوحدة 1: الاقتصاد العالمي" },
      { id: "geo-2", title: "المبادلات والتنقلات في العالم", category: "الوحدة 1: الاقتصاد العالمي" },
      { id: "geo-3", title: "مصادر القوة الأمريكية وتأثيرها العالمي", category: "الوحدة 2: القوى الكبرى" },
      { id: "geo-4", title: "ظاهرة التكتل وأثرها في قوة الاتحاد الأوروبي", category: "الوحدة 2: القوى الكبرى" },
      { id: "geo-5", title: "العلاقة بين السكان والتنمية في شرق وجنوب شرق آسيا", category: "الوحدة 2: القوى الكبرى" },
      { id: "geo-6", title: "الاقتصاد الجزائري في العالم", category: "الوحدة 3: دول الجنوب" },
      { id: "geo-7", title: "التنمية في البرازيل", category: "الوحدة 3: دول الجنوب" },
    ],
  },
  {
    id: "islamic",
    name: "العلوم الإسلامية",
    icon: "🕌",
    coefficient: 2,
    color: "green",
    lessons: [
      { id: "isl-1", title: "1. العقيدة الإسلامية وأثرها في حياة الفرد والمجتمع" },
      { id: "isl-2", title: "2. وسائل القرآن الكريم في تثبيت العقيدة الإسلامية" },
      { id: "isl-3", title: "3. الإسلام والرسالات السماوية" },
      { id: "isl-4", title: "4. العقل في القرآن الكريم" },
      { id: "isl-5", title: "5. مقاصد الشريعة الإسلامية" },
      { id: "isl-6", title: "6. منهج الإسلام في محاربة الانحراف والجريمة" },
      { id: "isl-7", title: "7. المساواة أمام أحكام الشريعة الإسلامية" },
      { id: "isl-8", title: "8. الصحة النفسية والصحة الجسمية في القرآن الكريم" },
      { id: "isl-9", title: "9. مصادر التشريع الإسلامي (الإجماع، القياس، المصلحة المرسلة)" },
      { id: "isl-10", title: "10. القيم في القرآن الكريم" },
      { id: "isl-11", title: "11. الوقف في الإسلام" },
      { id: "isl-12", title: "12. الميراث في الإسلام" },
      { id: "isl-13", title: "13. الربا وأحكامه" },
      { id: "isl-14", title: "14. المعاملات المالية الجائزة" },
      { id: "isl-15", title: "15. الحرية الشخصية وعلاقتها بحقوق الآخرين" },
      { id: "isl-16", title: "16. النسب والتبني والكفالة" },
      { id: "isl-17", title: "17. العلاقات الاجتماعية بين المسلمين وغير المسلمين" },
      { id: "isl-18", title: "18. خطبة الرسول ﷺ في حجة الوداع" },
    ],
  },
  {
    id: "french",
    name: "اللغة الفرنسية",
    icon: "Fr",
    coefficient: 2,
    color: "blue",
    lessons: [
      { id: "fr-1", title: "Séquence 01: Produire un texte pour informer d’un fait d’Histoire", category: "Projet 01: Texte d'Histoire" },
      { id: "fr-2", title: "Séquence 02: Produire un texte Historique avec témoignage / commentaire", category: "Projet 01: Texte d'Histoire" },
      { id: "fr-3", title: "Séquence 01: Plan Dialectique", category: "Projet 02: Le Débat d'idées" },
      { id: "fr-4", title: "Séquence 02: Plan Accumulatif", category: "Projet 02: Le Débat d'idées" },
      { id: "fr-5", title: "Séquence 01: Le texte exhortatif", category: "Projet 03: L'appel" },
    ],
  },
  {
    id: "english",
    name: "اللغة الإنجليزية",
    icon: "En",
    coefficient: 2,
    color: "blue",
    lessons: [
      { id: "eng-1", title: "First Unit: Ethics in Business" },
      { id: "eng-2", title: "Second Unit: Safety First" },
      { id: "eng-3", title: "Third Unit: Astronomy and Solar System" },
      { id: "eng-4", title: "Forth Unit: Feelings and Emotions" },
    ],
  },
  {
    id: "philosophy",
    name: "الفلسفة",
    icon: "🧠",
    coefficient: 2,
    color: "violet",
    lessons: [
      { id: "ph-1", title: "العلاقة بين العلم والفلسفة", category: "الإشكالية الأولى: السؤال بين المشكلة والإشكالية" },
      { id: "ph-2", title: "أهمية الفلسفة", category: "الإشكالية الأولى: السؤال بين المشكلة والإشكالية" },
      { id: "ph-3", title: "أصل الرياضيات", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-4", title: "نتائج الرياضيات", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-5", title: "الفرق بين الرياضيات الكلاسيكية والمعاصرة", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-6", title: "الحتمية واللاحتمية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-7", title: "معيار العلم", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-8", title: "قيمة الفرضية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-9", title: "المنهج التجريبي في المادة الحية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-10", title: "الفرق بين الملاحظة العادية والعلمية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-11", title: "المنهج التجريبي في علم النفس", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-12", title: "المنهج التجريبي في التاريخ", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-13", title: "المنهج التجريبي في العلوم الإنسانية", category: "الإشكالية الثانية: فلسفة العلوم" },
      { id: "ph-14", title: "معرفة الذات بين الأنا والغير", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-15", title: "العلاقة بين الأنا والغير", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-16", title: "الحرية والمسؤولية", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-17", title: "العنف والتسامح", category: "الإشكالية الثالثة: العلاقات بين الناس" },
      { id: "ph-18", title: "درس المنطق الصوري", category: "الإشكالية الرابعة: انطباق الفكر مع نفسه" },
      { id: "ph-19", title: "قيمة المنطق الصوري", category: "الإشكالية الرابعة: انطباق الفكر مع نفسه" },
    ],
  },
];
