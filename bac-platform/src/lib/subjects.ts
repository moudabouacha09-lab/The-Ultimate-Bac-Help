export type Subject = {
  name: string;
  slug: string;
  folderName: string;
  icon: string;
  iconName: string;
  color: "blue" | "green" | "violet" | "orange";
};

export const subjects: Subject[] = [
  { name: "الرياضيات", slug: "math", folderName: "رياضيات", icon: "functions", iconName: "functions", color: "blue" },
  { name: "العلوم الطبيعية", slug: "science", folderName: "علوم", icon: "biotech", iconName: "biotech", color: "green" },
  { name: "الفيزياء", slug: "physics", folderName: "فيزياء", icon: "maps", iconName: "maps", color: "blue" },
  { name: "التاريخ والجغرافيا", slug: "history-geography", folderName: "تاريخ و جغرافيا", icon: "public", iconName: "public", color: "orange" },
  { name: "الفلسفة", slug: "philosophy", folderName: "فلسفة", icon: "psychology", iconName: "psychology", color: "violet" },
  { name: "اللغة العربية", slug: "arabic", folderName: "عربية", icon: "menu_book", iconName: "menu_book", color: "green" },
  { name: "العلوم الإسلامية", slug: "islamic-studies", folderName: "اسلامية", icon: "mosque", iconName: "mosque", color: "green" },
  { name: "اللغة الفرنسية", slug: "french", folderName: "فرنسية", icon: "translate", iconName: "translate", color: "blue" },
  { name: "اللغة الإنجليزية", slug: "english", folderName: "english", icon: "language", iconName: "language", color: "blue" }
];

