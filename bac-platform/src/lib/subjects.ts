export type Subject = {
  name: string;
  slug: string;
  folderName: string;
  icon: string;
  iconName: string;
  color: "blue" | "green" | "violet" | "orange";
  defaultCoefficient: number;
};

export function isEssentialSubject(coefficient: number): boolean {
  return coefficient >= 5;
}

export const subjects: Subject[] = [
  { name: "الرياضيات", slug: "math", folderName: "رياضيات", icon: "functions", iconName: "functions", color: "blue", defaultCoefficient: 5 },
  { name: "العلوم الطبيعية", slug: "science", folderName: "علوم", icon: "biotech", iconName: "biotech", color: "green", defaultCoefficient: 6 },
  { name: "الفيزياء", slug: "physics", folderName: "فيزياء", icon: "maps", iconName: "maps", color: "blue", defaultCoefficient: 5 },
  { name: "التاريخ والجغرافيا", slug: "history-geography", folderName: "تاريخ و جغرافيا", icon: "public", iconName: "public", color: "orange", defaultCoefficient: 2 },
  { name: "الفلسفة", slug: "philosophy", folderName: "فلسفة", icon: "psychology", iconName: "psychology", color: "violet", defaultCoefficient: 2 },
  { name: "اللغة العربية", slug: "arabic", folderName: "عربية", icon: "menu_book", iconName: "menu_book", color: "green", defaultCoefficient: 2 },
  { name: "العلوم الإسلامية", slug: "islamic-studies", folderName: "اسلامية", icon: "mosque", iconName: "mosque", color: "green", defaultCoefficient: 2 },
  { name: "اللغة الفرنسية", slug: "french", folderName: "فرنسية", icon: "translate", iconName: "translate", color: "blue", defaultCoefficient: 2 },
  { name: "اللغة الإنجليزية", slug: "english", folderName: "english", icon: "language", iconName: "language", color: "blue", defaultCoefficient: 2 }
];


