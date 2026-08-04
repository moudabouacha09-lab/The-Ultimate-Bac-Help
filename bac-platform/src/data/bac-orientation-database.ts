/**
 * MESRS Algeria BAC 2026 Official Orientation Database
 * Includes Career Goal Classifications & Multilingual Search Aliases (Arabic + French).
 */

import rawBranches from "./bac-branches.json";

export type StreamKey =
  | "Scientific"
  | "Mathematical"
  | "Technical"
  | "Literature"
  | "Languages"
  | "Management"
  | "Arts";

export type CareerGoal = 
  | "doctor" 
  | "software_ai" 
  | "teacher" 
  | "architect" 
  | "engineer" 
  | "business_finance" 
  | "general";

export interface StudentGrades {
  generalAverage: number;
  math?: number;
  physics?: number;
  science?: number;
  techSpecialty?: number;
  arabic?: number;
  french?: number;
  english?: number;
  thirdLanguage?: number;
  artSpecialty?: number;
}

export type CutoffValue = number | "NC" | "--";

export interface StreamPriorityRule {
  priorityRank: number;
  stream: StreamKey;
  cutoff: CutoffValue;
}

export interface MinimumScores {
  Min1?: CutoffValue;
  Min2?: CutoffValue;
  Min3?: CutoffValue;
}

export interface UniversityBranch {
  code: string;
  name: string;
  frenchName?: string;
  category: "Medical" | "HigherSchool" | "Engineering" | "ENS" | "University" | "DoubleDegree" | "Professional" | "DistanceLearning";
  careerGoal: CareerGoal;
  universityCode: string;
  universityName: string;
  location: string;
  wilayaCode?: string;
  formulaType: "Health" | "ST" | "MI" | "AUM" | "Languages" | "Translation" | "General";
  formulaText: string;
  keySubjects: string[];
  description: string;
  imageUrl?: string;
  keywords: string[];
  aliases: string[];
  priorities: StreamPriorityRule[];
  priorityOrder?: StreamKey[][];
  minimumScores?: MinimumScores;
}

export const streamLabels: Record<StreamKey, string> = {
  Scientific: "علوم تجريبية",
  Mathematical: "رياضيات",
  Technical: "تقني رياضي",
  Literature: "آداب وفلسفة",
  Languages: "لغات أجنبية",
  Management: "تسيير واقتصاد",
  Arts: "فنون",
};

export const careerGoalLabels: Record<CareerGoal, { label: string; icon: string }> = {
  doctor: { label: "طبيب / صيدلي / علوم الصحة", icon: "🩺" },
  software_ai: { label: "مهندس برمجيات وذكاء اصطناعي", icon: "💻" },
  teacher: { label: "أستاذ تعليم (مدارس عليا للأساتذة)", icon: "👨‍🏫" },
  architect: { label: "مهندس معماري وعمران", icon: "🏛️" },
  engineer: { label: "مهندس دولة وتكنولوجيا", icon: "⚙️" },
  business_finance: { label: "إدارة واقتصاد ومالية", icon: "📊" },
  general: { label: "علوم عامة وأكاديمية", icon: "🌐" },
};

/**
 * Calculates the exact Weighted Average (المعدل الموزون) according to Circulaire 2026
 */
export function calculateWeightedAverage(
  formulaType: UniversityBranch["formulaType"],
  grades: StudentGrades,
  stream: StreamKey,
  targetLangGrade: number = 0
): number {
  const M = grades.generalAverage || 0;

  switch (formulaType) {
    case "Health": {
      if (stream === "Technical") return M;
      const science = grades.science || 0;
      return Number(((2 * M + science) / 3).toFixed(2));
    }
    case "ST": {
      const physics = grades.physics || 0;
      const math = grades.math || 0;
      const avgPM = (physics + math) / 2;
      return Number(((2 * M + avgPM) / 3).toFixed(2));
    }
    case "MI": {
      const math = grades.math || 0;
      return Number(((2 * M + math) / 3).toFixed(2));
    }
    case "AUM": {
      const physics = grades.physics || 0;
      const math = grades.math || 0;
      const avgPM = (physics + math) / 2;
      return Number(((2 * M + avgPM) / 3).toFixed(2));
    }
    case "Languages": {
      return Number(((2 * M + targetLangGrade) / 3).toFixed(2));
    }
    case "Translation": {
      const langAvg = ((grades.arabic || 0) + (grades.french || 0) + (grades.english || 0)) / 3;
      return Number(((2 * M + langAvg) / 3).toFixed(2));
    }
    case "General":
    default:
      return M;
  }
}

export const officialBranchesDatabase = rawBranches as UniversityBranch[];
