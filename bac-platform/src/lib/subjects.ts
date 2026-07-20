export type Subject = {
  name: string;
  slug: string;
  folderName: string;
  icon: string;
  color: "blue" | "green" | "violet" | "orange";
};

export const subjects: Subject[] = [
  { name: "الرياضيات", slug: "math", folderName: "رياضيات", icon: "∑", color: "blue" },
  { name: "العلوم الطبيعية", slug: "science", folderName: "علوم", icon: "⌬", color: "green" },
  { name: "الفيزياء", slug: "physics", folderName: "فيزياء", icon: "⚛", color: "blue" },
  { name: "التاريخ والجغرافيا", slug: "history-geography", folderName: "تاريخ و جغرافيا", icon: "◉", color: "orange" },
  { name: "الفلسفة", slug: "philosophy", folderName: "فلسفة", icon: "◈", color: "violet" },
  { name: "اللغة العربية", slug: "arabic", folderName: "عربية", icon: "أ", color: "green" },
  { name: "العلوم الإسلامية", slug: "islamic-studies", folderName: "اسلامية", icon: "۞", color: "green" },
  { name: "اللغة الفرنسية", slug: "french", folderName: "فرنسية", icon: "Fr", color: "blue" },
  { name: "اللغة الإنجليزية", slug: "english", folderName: "english", icon: "En", color: "blue" }
];
