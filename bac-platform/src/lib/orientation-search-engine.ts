import { 
  type UniversityBranch, 
  type StreamKey, 
  type StudentGrades, 
  type CareerGoal,
  type MinimumScores,
  calculateWeightedAverage 
} from "@/data/bac-orientation-database";

export interface SearchFilters {
  stream: StreamKey;
  query: string;
  category: string;
  careerGoal?: CareerGoal | "ALL";
  wilayaCode?: string;
  onlyEligible: boolean;
}

export interface EvaluatedBranch extends UniversityBranch {
  calculatedScore: number;
  userCutoff: number | "NC" | "--";
  priorityRank: number;
  priorityLabel: string;
  status: "safe" | "competitive" | "stretch" | "nc" | "unavailable";
  scoreDifference: number;
  priorityPenalty: number;
}

/**
 * Determines the official stream priority rank for a university branch
 * 🥇 Priority 1: Mathematical (for tech/engineering/ESI) or Scientific (for medical)
 * 🥈 Priority 2: Technical (for tech) or Mathematical (for medical)
 * 🥉 Priority 3: Scientific (for tech) or Technical (for medical)
 */
export function getStreamPriorityRank(branch: UniversityBranch, studentStream: StreamKey): number {
  if (branch.priorityOrder && branch.priorityOrder.length > 0) {
    for (let i = 0; i < branch.priorityOrder.length; i++) {
      if (branch.priorityOrder[i].includes(studentStream)) {
        return i + 1;
      }
    }
  }

  if (branch.priorities && branch.priorities.length > 0) {
    const priorityRule = branch.priorities.find((p) => p.stream === studentStream);
    if (priorityRule) {
      return priorityRule.priorityRank;
    }
  }

  // Fallback defaults for technology & engineering sectors
  const techCategories = ["HigherSchool", "Engineering", "University"];
  if (techCategories.includes(branch.category) && branch.formulaType !== "Health") {
    const defaultTechPriority: Record<StreamKey, number> = {
      Mathematical: 1, // 🥇 الأولوية الأولى (رياضيات)
      Scientific: 2,   // 🥈 الأولوية الثانية (علوم تجريبية)
      Technical: 3,    // 🥉 الأولوية الثالثة (تقني رياضي)
      Management: 4,
      Literature: 99,
      Languages: 99,
      Arts: 99,
    };
    return defaultTechPriority[studentStream] ?? 99;
  }

  // Fallback defaults for medical & health sectors
  if (branch.category === "Medical" || branch.formulaType === "Health") {
    const defaultMedicalPriority: Record<StreamKey, number> = {
      Scientific: 1,   // 🥇 الأولوية الأولى (علوم)
      Mathematical: 2, // 🥈 الأولوية الثانية (رياضيات)
      Technical: 3,    // 🥉 الأولوية الثالثة (تقني)
      Management: 99,
      Literature: 99,
      Languages: 99,
      Arts: 99,
    };
    return defaultMedicalPriority[studentStream] ?? 99;
  }

  return 1;
}

/**
 * Matches student stream priority rank and explicit target score (Min1, Min2, Min3)
 */
export function getStudentPriorityInfo(
  branch: UniversityBranch,
  studentStream: StreamKey
): { priorityRank: number; targetScoreValue: number | "NC" | "--" } {
  // 1. Prioritize explicit stream-specific rules in priorities array first
  if (branch.priorities && branch.priorities.length > 0) {
    const rule = branch.priorities.find((p) => p.stream === studentStream);
    if (rule) {
      return { priorityRank: rule.priorityRank, targetScoreValue: rule.cutoff };
    }
  }

  // 2. Check priorityOrder & minimumScores safely without incorrect fallback
  if (branch.priorityOrder && branch.priorityOrder.length > 0) {
    for (let i = 0; i < branch.priorityOrder.length; i++) {
      if (branch.priorityOrder[i].includes(studentStream)) {
        const rank = i + 1;
        const key = `Min${rank}` as keyof MinimumScores;
        const score = branch.minimumScores?.[key];
        return { priorityRank: rank, targetScoreValue: score ?? "--" };
      }
    }
  }

  const fallbackRank = getStreamPriorityRank(branch, studentStream);
  return { priorityRank: fallbackRank, targetScoreValue: "--" };
}

/**
 * Robust Multilingual Arabic/French Normalizer
 */
export function normalizeMultilingualQuery(text: string): string {
  if (!text) return "";
  
  return text
    // Arabic Normalization
    .replace(/[أإآآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u0652]/g, "") // Remove Tashkeel
    // French Normalization
    .replace(/[éèêë]/g, "e")
    .replace(/[àâä]/g, "a")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ûüù]/g, "u")
    .replace(/ç/g, "c")
    .toLowerCase()
    .trim();
}

/**
 * Multilingual Search & Stream-Priority Score Evaluation Engine
 */
export function searchAndEvaluateBranches(
  branches: UniversityBranch[],
  grades: StudentGrades,
  filters: SearchFilters
): EvaluatedBranch[] {
  const normQuery = normalizeMultilingualQuery(filters.query);

  return branches
    .filter((branch) => {
      // 1. Structural Category Filter
      if (filters.category !== "ALL" && branch.category !== filters.category) {
        return false;
      }

      // 2. Career Goal Filter
      if (filters.careerGoal && filters.careerGoal !== "ALL" && branch.careerGoal !== filters.careerGoal) {
        return false;
      }

      // 3. Wilaya Filter
      if (filters.wilayaCode && branch.wilayaCode && branch.wilayaCode !== filters.wilayaCode) {
        return false;
      }

      // 4. Multilingual Fuzzy Query Match (Arabic + French + Code + Aliases)
      if (normQuery) {
        const fullSearchIndex = normalizeMultilingualQuery(
          `${branch.name} ${branch.frenchName || ""} ${branch.code} ${branch.universityName} ${branch.location} ${branch.aliases ? branch.aliases.join(" ") : ""}`
        );
        const queryTerms = normQuery.split(/\s+/);
        const matches = queryTerms.every((term) => fullSearchIndex.includes(term));
        if (!matches) {
          return false;
        }
      }

      // 5. Must be available or prioritized for the selected stream
      const rank = getStreamPriorityRank(branch, filters.stream);
      return rank !== 99;
    })
    .map((branch) => {
      const { priorityRank, targetScoreValue } = getStudentPriorityInfo(branch, filters.stream);
      const userCutoff: number | "NC" | "--" = targetScoreValue;

      const calculatedScore = calculateWeightedAverage(branch.formulaType, grades, filters.stream);

      let status: EvaluatedBranch["status"] = "stretch";
      let scoreDifference = 0;

      if (userCutoff === "NC") {
        status = "nc";
      } else if (userCutoff === "--" || priorityRank === 99) {
        status = "unavailable";
      } else {
        const numCutoff = typeof userCutoff === "number" ? userCutoff : 10;
        scoreDifference = Number((calculatedScore - numCutoff).toFixed(2));
        if (scoreDifference >= 0.5) status = "safe";
        else if (scoreDifference >= -0.5) status = "competitive";
        else status = "stretch";
      }

      const priorityLabel = priorityRank === 1 ? "🥇 أولوية أولى" : priorityRank === 2 ? "🥈 أولوية ثانية" : "🥉 أولوية ثالثة";
      const priorityPenalty = priorityRank === 1 ? 0 : -(priorityRank - 1) * 0.5;

      return {
        ...branch,
        calculatedScore,
        userCutoff,
        priorityRank,
        priorityLabel,
        status,
        scoreDifference,
        priorityPenalty,
      };
    })
    .filter((branch) => {
      if (filters.onlyEligible) {
        return branch.status === "safe" || branch.status === "competitive" || branch.status === "nc";
      }
      return true;
    })
    .sort((a, b) => {
      const statusOrder = { safe: 1, competitive: 2, nc: 3, stretch: 4, unavailable: 5 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (a.priorityRank !== b.priorityRank) {
        return a.priorityRank - b.priorityRank;
      }
      return b.scoreDifference - a.scoreDifference;
    });
}
