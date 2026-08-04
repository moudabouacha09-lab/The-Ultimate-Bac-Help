// src/data/prerequisites-quiz-data.ts

export type QuestionType = "mcq" | "boolean";

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  questionText: string;
  options?: string[]; // For MCQ questions
  correctAnswer: number | boolean; // Index (0-based) for MCQ or boolean
  explanation: string;
}

export interface ComprehensiveExercise {
  title: string;
  statement: string;
  solution: string;
  statementImages?: string[];
  solutionImages?: string[];
}

export interface SubjectDiagnostic {
  subjectSlug: "math" | "physics" | "science";
  subjectName: string;
  icon: string;
  color: "blue" | "green" | "violet";
  questions: QuizQuestion[];
  exercise: ComprehensiveExercise;
}

export const diagnosticData: Record<string, SubjectDiagnostic> = {
  math: {
    subjectSlug: "math",
    subjectName: "الرياضيات",
    icon: "∑",
    color: "blue",
    questions: [
      {
        id: 1,
        type: "mcq",
        questionText: "مميز العبارة من الدرجة الثانية $x^2 - 5x + 6$ يساوي:",
        options: ["1", "-1", "25", "49"],
        correctAnswer: 0,
        explanation: "القانون: $\\Delta = b^2 - 4ac = (-5)^2 - 4(1)(6) = 25 - 24 = 1$."
      },
      {
        id: 2,
        type: "mcq",
        questionText: "إذا كان منحنى الدالة $f$ يقترب عند $+\\infty$ من المستقيم ذي المعادلة $y = 2x - 1$، فإن هذا المستقيم يُسمى:",
        options: ["مستقيم مقارب عمودي", "مستقيم مقارب أفقي", "مستقيم مقارب مائل", "محور تناظر للمنحنى"],
        correctAnswer: 2,
        explanation: "عندما تكون المعادلة من الشكل $y = ax + b$ بجوار اللانهاية، يُسمى مستقيماً مقارباً مائلاً."
      },
      {
        id: 3,
        type: "mcq",
        questionText: "لدراسة الوضعية النسبية لمنحنى $(C_f)$ بالنسبة لمستقيم مقارب $(\\Delta)$ ذي المعادلة $y = ax+b$، ندرس إشارة:",
        options: ["f(x)", "f(x) - (ax+b)", "f'(x)", "\\lim_{x\\to 0} f(x)"],
        correctAnswer: 1,
        explanation: "الوضعية النسبية تتحدد بإشارة الفرق $f(x) - y$."
      },
      {
        id: 4,
        type: "mcq",
        questionText: "إذا كانت $f'(x) > 0$ على مجال $I$، فإن الدالة $f$ على $I$ تكون:",
        options: ["متناقصة تماماً", "متزايدة تماماً", "ثابتة", "لا يمكن تحديد ذلك"],
        correctAnswer: 1,
        explanation: "إشارة المشتقة الموجبة تماماً تعني اتجاه تغير متزايد تماماً للدالة."
      },
      {
        id: 5,
        type: "mcq",
        questionText: "لإزالة حالة عدم التعيين $\\frac{0}{0}$ في عبارة دالة ناطقة، الطريقة الأنسب غالباً هي:",
        options: ["الضرب في المرافق دائماً", "تحليل البسط والمقام إلى عوامل ثم الاختزال", "حساب $f'(x)$ فقط", "دراسة شفعية الدالة"],
        correctAnswer: 1,
        explanation: "في الدوال الناطقة، التحليل إلى عوامل بالاختزال بـ $(x-a)$ يزيل حالة عدم التعيين $\\frac{0}{0}$."
      },
      {
        id: 6,
        type: "boolean",
        questionText: "المستقيم $x = a$ يكون مستقيماً مقارباً عمودياً لمنحنى $f$ إذا كانت نهاية $f$ عند $a$ تساوي $+\\infty$ أو $-\\infty$.",
        correctAnswer: true,
        explanation: "صحيح، لأن $\\lim_{x \\to a} f(x) = \\pm\\infty$ تعني هندسياً وجود مقارب عمودي معادلته $x = a$."
      },
      {
        id: 7,
        type: "boolean",
        questionText: "إذا كانت الدالة $f$ زوجية، فإن منحناها البياني متناظر بالنسبة لمبدأ المعلم $O$.",
        correctAnswer: false,
        explanation: "خطأ، الدالة الزوجية منحناها متناظر بالنسبة لمحور التراتيب $(Oy)$، بينما الدالة الفردية متناظرة بالنسبة للمبدأ $O$."
      },
      {
        id: 8,
        type: "boolean",
        questionText: "إذا كان مميز عبارة من الدرجة الثانية سالباً تماماً ($\\Delta < 0$)، فإن للعبارة جذرين حقيقيين متمايزين.",
        correctAnswer: false,
        explanation: "خطأ، إذا كان $\\Delta < 0$ فإن العبارة لا تقبل أي جذر حقيقي في $\\mathbb{R}$ وإشارتها من إشارة $a$."
      },
      {
        id: 9,
        type: "boolean",
        questionText: "لتعيين معادلة المماس لمنحنى $f$ عند نقطة أفصولها $a$، يكفي معرفة $f(a)$ و $f'(a)$.",
        correctAnswer: true,
        explanation: "صحيح، لأن معادلة المماس هي: $y = f'(a)(x - a) + f(a)$."
      },
      {
        id: 10,
        type: "boolean",
        questionText: "حالة عدم التعيين من الشكل $0 \\times \\infty$ يمكن غالباً تحويلها إلى الشكل $\\frac{0}{0}$ أو $\\frac{\\infty}{\\infty}$ لمعالجتها.",
        correctAnswer: true,
        explanation: "صحيح، عبر كتابة $A \\times B = \\frac{A}{1/B}$ أو بالتحليل والتفكيك."
      }
    ],
    exercise: {
      title: "التمرين التفصيلي الشامل - دراسة دالة ناطقة وخواص المنحنى",
      statement: `تعتبر الدالة العددية $f$ المعرفة على $D_f = \\mathbb{R} \\setminus \\{1\\}$ بالعبارة:
$$f(x) = \\frac{x^2 - x + 1}{1 - x}$$
وليكن $(C_f)$ منحناها البياني في معلم متعامد ومتجانس $(O;\\vec{i},\\vec{j})$.

1. أحسب $f'(x)$.
2. أحسب نهايات $f$ عند أطراف مجالات $D_f$ وفسّرها هندسياً.
3. أ) عيّن الأعداد $a,b,c$ بحيث $f(x) = ax+b+\\dfrac{c}{1-x}$.
   ب) استنتج معادلة المستقيم المقارب المائل $(\\Delta)$.
   جـ) ادرس الوضعية النسبية لـ $(C_f)$ بالنسبة لـ $(\\Delta)$.
4. ادرس تغيرات $f$ وشكّل جدول تغيراتها.
5. أ) بيّن أن $\\Omega(1,-1)$ مركز تناظر لـ $(C_f)$.
   ب) أثبت أنه لا يوجد مماس لـ $(C_f)$ يشمل $\\Omega$.
6. ناقش بيانياً حسب قيم $m$ عدد وإشارة حلول المعادلة $f(x)+x=m$.
7. لتكن $h(x) = f(|x|)$ المعرفة على $\\mathbb{R}\\setminus\\{-1,1\\}$. ادرس شفعية $h$ ووضّح كيفية إنشاء $(C_h)$ انطلاقاً من $(C_f)$.`,
      solution: `1. حساب المشتقة:
$$f'(x) = \\dfrac{(2x-1)(1-x) - (-1)(x^2-x+1)}{(1-x)^2} = \\dfrac{x(2-x)}{(1-x)^2}$$

2. النهايات والتفسير الهندسي:
- $\\lim_{x\\to-\\infty} f(x) = +\\infty$ ، $\\lim_{x\\to+\\infty} f(x) = -\\infty$
- $\\lim_{x\\to 1^-} f(x) = +\\infty$ ، $\\lim_{x\\to 1^+} f(x) = -\\infty$
التفسير: $(C_f)$ يقبل مستقيماً مقارباً عمودياً معادلته $x=1$.

3. المقارب المائل والوضعية النسبية:
أ) بالمطابقة نجد: $a=-1$، $b=0$، $c=1$ فتصبح $f(x) = -x + \\dfrac{1}{1-x}$.
ب) المستقيم المقارب المائل هو $(\\Delta): y = -x$.
جـ) إشارة $f(x) - y = \\dfrac{1}{1-x}$:
- على $]-\\infty, 1[$: $(C_f)$ يقع فوق $(\\Delta)$.
- على $]1, +\\infty[$: $(C_f)$ يقع تحت $(\\Delta)$.

4. جدول التغيرات:
$f'(x)=0$ عند $x=0$ (قيمة حدية صغرى $f(0)=1$) وعند $x=2$ (قيمة حدية عظمى $f(2)=-3$).

5. التناظر والمماس:
أ) $f(2-x) + f(x) = -2 = 2(-1)$ إذن $\\Omega(1,-1)$ مركز تناظر.
ب) فرض وجود مماس يشمل $\\Omega$ يؤدي لتناقض حتمي $1 = -1$، إذن لا يوجد مماس يشمل $\\Omega$.

6. المناقشة البيانية:
المعادلة تكافئ $f(x) = -x + m$:
- $m < -1$: حلان موجبان.
- $m = -1$: حل مضاعف $x=2$.
- $-1 < m < 1$: لا توجد حلول.
- $m = 1$: حل مضاعف $x=0$.
- $m > 1$: حلان مختلفا الإشارة.

7. الدالة الزوجية $h(x)$:
$h(-x) = f(|-x|) = f(|x|) = h(x)$ إذن $h$ زوجية.
إنشاء $(C_h)$: لما $x \\ge 0$ ينطبق على $(C_f)$، ولما $x < 0$ يُرسم بالتناظر المحوري بالنسبة لمحور التراتيب.`
    }
  },
  physics: {
    subjectSlug: "physics",
    subjectName: "العلوم الفيزيائية",
    icon: "⚛",
    color: "blue",
    questions: [
      {
        id: 1,
        type: "mcq",
        questionText: "الوحدة الدولية لقياس كمية المادة $n$ هي:",
        options: ["الغرام (g)", "المول (mol)", "اللتر (L)", "المول لكل لتر (mol/L)"],
        correctAnswer: 1,
        explanation: "الوحدة الدولية الأساسية لكمية المادة في الجملة الدولية هي المول (mol)."
      },
      {
        id: 2,
        type: "mcq",
        questionText: "التركيز المولي للمحلول التجاري يُحسب بالعلاقة:",
        options: ["C = (10 * P * d) / M", "C = M / (10 * P * d)", "C = P * d * M", "C = d / (P * M)"],
        correctAnswer: 0,
        explanation: "القانون التجاري الأساسي: $C_0 = \\frac{10 \\cdot P \\cdot d}{M}$."
      },
      {
        id: 3,
        type: "mcq",
        questionText: "في تفاعل أكسدة-إرجاع، الجسم الذي يفقد إلكترونات يُسمى:",
        options: ["مؤكسِد (Oxydant)", "مرجِع (Réducteur)", "حمض", "قاعدة"],
        correctAnswer: 1,
        explanation: "المرجع (Réducteur) هو كل فرد كيميائي قادر على فقدان إلكترون أو أكثر."
      },
      {
        id: 4,
        type: "mcq",
        questionText: "عند نقطة التكافؤ في تفاعل معايرة، تكون كميتا مادتَي المتفاعلين في نسب:",
        options: ["متساوية عددياً دائماً", "استوكيومترية", "عشوائية غير محددة", "معدومة كلياً"],
        correctAnswer: 1,
        explanation: "عند التكافؤ تختفي المتفاعلات الممزوجة بنسب استوكيومترية وتكون $\\frac{n_A}{a} = \\frac{n_B}{b}$."
      },
      {
        id: 5,
        type: "mcq",
        questionText: "الأداة الزجاجية الأنسب لأخذ حجم دقيق ومحدد تحضيراً لمحلول ممدد هي:",
        options: ["كأس مدرَّج", "ماصة عيارية", "بيشر عادي", "حوجلة غير عيارية"],
        correctAnswer: 1,
        explanation: "الماصة العيارية المزودة بإجاصة مص هي الأداة الأدق لأخذ الحجوم الكيميائية."
      },
      {
        id: 6,
        type: "boolean",
        questionText: "قانون الغاز المثالي يُكتب على الشكل $P \\cdot V = n \\cdot R \\cdot T$.",
        correctAnswer: true,
        explanation: "صحيح، حيث $P$ بالباسكال و$V$ بالمتر المكعب و$T$ بالكلفن."
      },
      {
        id: 7,
        type: "boolean",
        questionText: "معامل التمديد $F = \\frac{C_1}{C_2}$ يكون دائماً أصغر من 1.",
        correctAnswer: false,
        explanation: "خطأ، معامل التمديد $F = \\frac{C_0}{C} = \\frac{V}{V_0}$ وهو دائماً أكبر تماماً من 1."
      },
      {
        id: 8,
        type: "boolean",
        questionText: "الناقلية $G$ لمحلول إلكتروليتي تتناسب طردياً مع مساحة السطح $S$ وعكسياً مع المسافة $L$ بين المسريين.",
        correctAnswer: true,
        explanation: "صحيح، العبارة هي $G = \\sigma \\cdot \\frac{S}{L}$."
      },
      {
        id: 9,
        type: "boolean",
        questionText: "في تفاعل الأكسدة-الإرجاع، المؤكسِد هو الجسم الذي يكتسب إلكترونات.",
        correctAnswer: true,
        explanation: "صحيح، المؤكسد (Oxydant) هو كل فرد كيميائي يكتسب إلكتروناً أو أكثر."
      },
      {
        id: 10,
        type: "boolean",
        questionText: "عند نقطة التكافؤ، تكون كميتا مادتَي المتفاعلين متساويتين عددياً دائماً بغض النظر عن المعاملات.",
        correctAnswer: false,
        explanation: "خطأ، تتساوى الكميات عددياً فقط إذا كانت المعاملات الاستوكيومترية متساوية (1 إلى 1)."
      }
    ],
    exercise: {
      title: "التمرين الشامل - تحضير محلول وتعيين تركيزه بالمعايرة الحجمية",
      statement: `نحضّر في المخبر محلولاً مائياً لماء الأكسجيني $H_2O_2$ انطلاقاً من قارورة تجارية: الكثافة $d=1.1$، درجة النقاوة $P=3.4\\%$، الكتلة المولية $M=34\\ \\text{g/mol}$.

1. احسب التركيز المولي $C_0$ للمحلول التجاري.
2. نريد تحضير $V_1=100\\ \\text{mL}$ بتركيز $C_1=0.1\\ \\text{mol/L}$. احسب $V_0$ الواجب أخذه، واذكر الأدوات والخطوات.
3. نأخذ $V_A=10\\ \\text{mL}$ من المحلول الممدد ونعايره بمحلول برمنغنات البوتاسيوم ($C_B=0.02\\ \\text{mol/L}$)، فيتحقق التكافؤ عند $V_{BE}=20\\ \\text{mL}$. اكتب الثنائيتين، والمعادلة الإجمالية، واستنتج $C_1$.`,
      solution: `1. حساب التركيز التجاري $C_0$:
$$C_0 = \\dfrac{10 \\times 3.4 \\times 1.1}{34} = 1.1\\ \\text{mol/L}$$

2. حساب حجم الأخذ $V_0$ وخطوات التحضير:
$$V_0 = \\dfrac{C_1 \\cdot V_1}{C_0} = \\dfrac{0.1 \\times 100}{1.1} \\approx 9.1\\ \\text{mL}$$
الأدوات: ماصة عيارية سعتها $10\\ \\text{mL}$، حوجلة عيارية $100\\ \\text{mL}$، ماء مقطر.
الخطوات: نأخذ الحجم $V_0$ بالماصة ونفرغه في الحوجلة المليئة جزئياً بالماء المقطر، ثم نكمل بالماء المقطر حتى خط العيار ونرج المحلول.

3. المعايرة والحساب:
الثنائيتان: $(MnO_4^- / Mn^{2+})$ و $(O_2 / H_2O_2)$.
المعادلة الموزونة:
$$2MnO_4^- + 5H_2O_2 + 6H^+ \\rightarrow 2Mn^{2+} + 5O_2 + 8H_2O$$
عند نقطة التكافؤ:
$$\\dfrac{C_B \\cdot V_{BE}}{2} = \\dfrac{C_1 \\cdot V_A}{5} \\implies C_1 = \\dfrac{5 \\cdot C_B \\cdot V_{BE}}{2 \\cdot V_A} = \\dfrac{5 \\times 0.02 \\times 20}{2 \\times 10} = 0.10\\ \\text{mol/L}$$`
    }
  },
  science: {
    subjectSlug: "science",
    subjectName: "العلوم الطبيعية",
    icon: "🧬",
    color: "green",
    questions: [
      {
        id: 1,
        type: "mcq",
        questionText: "من العضيات الغائبة كلياً عن الخلية بدائية النواة:",
        options: ["الريبوزومات", "الغشاء الهيولي", "النواة المحاطة بغلاف نووي", "الهيولى"],
        correctAnswer: 2,
        explanation: "بدائيات النواة تمتاز بوجود المادة الوراثية سباحة في الهيولى دون غلاف نووي."
      },
      {
        id: 2,
        type: "mcq",
        questionText: "القواعد الأزوتية الأربع المكوّنة لجزيئة الـ ADN هي:",
        options: ["A, T, C, G", "A, U, C, G", "A, T, C, U", "A, G, U, T"],
        correctAnswer: 0,
        explanation: "يتكون الـ ADN من القواعد: الأدنين (A)، التيمين (T)، السيتوزين (C)، والغوانين (G)."
      },
      {
        id: 3,
        type: "mcq",
        questionText: "عدد الروابط الهيدروجينية الرابطة بين القاعدتين C و G هو:",
        options: ["رابطتان", "ثلاث روابط", "رابطة تساهمية واحدة", "لا توجد روابط"],
        correctAnswer: 1,
        explanation: "ترتبط القاعدة C مع G بثلاث روابط هيدروجينية، بينما A مع T برابطتين."
      },
      {
        id: 4,
        type: "mcq",
        questionText: "طفرة الإضافة أو الحذف لنيكليوتيدة واحدة تسبب غالباً:",
        options: ["تغيير قاعدة واحدة فقط", "إزاحة كاملة في إطار قراءة الرامزات (Frameshift)", "عدم أي تأثير", "توقف الخلية فوراً"],
        correctAnswer: 1,
        explanation: "تغيير إطار القراءة يغير جميع الأحماض الأمينية التالية لموقع الطفرة."
      },
      {
        id: 5,
        type: "mcq",
        questionText: "أعراض فقر الدم المنجلي تُلاحَظ على المستوى:",
        options: ["الجزيئي", "الخلوي", "العضوي", "لا علاقة له بالنمط الظاهري"],
        correctAnswer: 2,
        explanation: "الأعراض السريرية (كانسداد الأوعية وآلام المفاصل) هي المظهر العضوي للنمط الظاهري."
      },
      {
        id: 6,
        type: "boolean",
        questionText: "تفتقر الخلية بدائية النواة إلى غلاف نووي وإلى بنية حجيرية داخلية.",
        correctAnswer: true,
        explanation: "صحيح، البكتيريا مثال على الخلايا بدائية النواة عديمة الحجيرات والغلاف النووي."
      },
      {
        id: 7,
        type: "boolean",
        questionText: "الإماهة الكلية لجزيئة الـ ADN تحرر مباشرة النيوكليوتيدات الأربع.",
        correctAnswer: false,
        explanation: "خطأ، الإماهة الكلية تحرر المكونات الدقيقة (حمض الفسفور، سكر الديزوكسي ريبوز، والقواعد الأزوتية)، بينما الإماهة الجزئية تحرر النيوكليوتيدات."
      },
      {
        id: 8,
        type: "boolean",
        questionText: "ترتبط القاعدتان الأزوتيتان A و T بثلاث روابط هيدروجينية.",
        correctAnswer: false,
        explanation: "خطأ، ترتبط القاعدتان A و T برابطتين هيدروجينيتين فقط."
      },
      {
        id: 9,
        type: "boolean",
        questionText: "يتحدد النمط الظاهري بواسطة النمط الوراثي على المستويات الثلاثة: الجزيئي، الخلوي، والعضوي معاً.",
        correctAnswer: true,
        explanation: "صحيح، النمط الوراثي يحدد تتابع الأحماض الأمينية (جزيئي)، فتتأثر الخلية (خلوي)، وتظهر الصفة على الكائن (عضوي)."
      },
      {
        id: 10,
        type: "boolean",
        questionText: "طفرة الاستبدال تُغيّر بالضرورة العدد الكلي للنيوكليوتيدات في المورثة.",
        correctAnswer: false,
        explanation: "خطأ، طفرة الاستبدال تبدل قاعدة بأخرى دون تغيير العدد الإجمالي للنيوكليوتيدات."
      }
    ],
    exercise: {
      title: "التمرين الشامل في العلوم الطبيعية - تقويم المكتسبات القبلية",
      statement: "الموضوع موضح بالكامل في الوثائق المصورة المرفقة أدناه:",
      solution: "الحل النموذجي والتنقيط البيداغوجي المأخوذ من الدليل المرفق موضح في الصور أدناه:",
      statementImages: [
        "/images/prerequisites/science/exercise-1.jpg",
        "/images/prerequisites/science/exercise-2.jpg"
      ],
      solutionImages: [
        "/images/prerequisites/science/solution-1.jpg",
        "/images/prerequisites/science/solution-2.jpg"
      ]
    }
  }
};
