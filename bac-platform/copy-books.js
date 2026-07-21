const fs = require('fs');
const path = require('path');

const srcDir = 'm:/The Ultimate BAC Help/صور الكتب الخارجية';
const destDir = 'm:/The Ultimate BAC Help/bac-platform/public/books';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
  "الاحتمالات الاستاذ نور الدين - رياضيات.webp": "math-prob.webp",
  "الاعداد المركبة الاستاذ نور الدين - رياضيات.jpg": "math-complex.jpg",
  "الاعداد و الحساب (خاص بالرياضي) الاستاذ نور الدين - رياضيات.jpg": "math-arithmetic.jpg",
  "الجوهرة في العلوم الطبيعية الجزء 1 الاستاذ خيرة فليتي - علوم.webp": "science-jawhara-1.webp",
  "الجوهرة في العلوم الطبيعية الجزء 2 الاستاذ خيرة فليتي - علوم.webp": "science-jawhara-2.webp",
  "الجوهرة في اللغة العربية الاستاذ بوبكر - عربية.webp": "arabic-jawhara.webp",
  "الدوال من الاستاذ نور الدين - رياضيات.webp": "math-functions.webp",
  "السلسلة الأرجوانية في الاسلامية للاستاذة بوسعادي - اسلامية (جميع الدروس).jpg": "islamic-purple.jpg",
  "السلسلة الارجوانية للاستاذ بورنان - تاريخ و جغرافيا.jpg": "history-bournan.jpg",
  "السلسلة الخضراء في الاسلامية للاستاذة بوسعادي - اسلامية (أسئلة مباشرة و غير مباشرة).jpg": "islamic-green.jpg",
  "المتتاليات الاستاذ نور الدين - رياضيات.jpg": "math-sequences.jpg",
  "تأشيرة النجاح الجزء الأول - فيزياء.webp": "physics-visa-1.webp",
  "تأشيرة النجاح الجزء الثالث - فيزياء.jpg": "physics-visa-3.jpg",
  "تأشيرة النجاح الجزء الثاني - فيزياء.webp": "physics-visa-2.webp",
  "كتاب الاستاذ محجوب عمار - العلوم الطبيعية.jpg": "science-mahjoub.jpg",
  "كتاب المتوفقة سابقا للفلسفة - فلسفة.jpg": "philosophy-motafawiqa.jpg"
};

for (const [srcName, destName] of Object.entries(fileMap)) {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${destName}`);
  } catch (error) {
    console.error(`Failed to copy: ${srcName}`, error.message);
  }
}
