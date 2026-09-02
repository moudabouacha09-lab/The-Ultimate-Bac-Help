"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { FadeInSection } from "@/components/effects/fade-in-section";
import { GraduationCap, ArrowRight, Search } from "lucide-react";
import {
  officialBranchesDatabase,
  streamLabels,
  careerGoalLabels,
  type StreamKey,
  type StudentGrades,
  type CareerGoal,
} from "@/data/bac-orientation-database";
import { searchAndEvaluateBranches } from "@/lib/orientation-search-engine";

const wilayasList = [
  { code: "01", name: "01 - أدرار" },
  { code: "02", name: "02 - الشلف" },
  { code: "03", name: "03 - الأغواط" },
  { code: "04", name: "04 - أم البواقي" },
  { code: "05", name: "05 - باتنة" },
  { code: "06", name: "06 - بجاية" },
  { code: "07", name: "07 - بسكرة" },
  { code: "08", name: "08 - بشار" },
  { code: "09", name: "09 - البليدة" },
  { code: "10", name: "10 - البويرة" },
  { code: "11", name: "11 - تمنراست" },
  { code: "12", name: "12 - تبسة" },
  { code: "13", name: "13 - تلمسان" },
  { code: "14", name: "14 - تيارت" },
  { code: "15", name: "15 - تيزي وزو" },
  { code: "16", name: "16 - الجزائر العاصمة" },
  { code: "17", name: "17 - الجلفة" },
  { code: "18", name: "18 - جيجل" },
  { code: "19", name: "19 - سطيف" },
  { code: "20", name: "20 - سعيدة" },
  { code: "21", name: "21 - سكيكدة" },
  { code: "22", name: "22 - سيدي بلعباس" },
  { code: "23", name: "23 - عنابة" },
  { code: "24", name: "24 - قالمة" },
  { code: "25", name: "25 - قسنطينة" },
  { code: "26", name: "26 - المدية" },
  { code: "27", name: "27 - مستغانم" },
  { code: "28", name: "28 - المسيلة" },
  { code: "29", name: "29 - معسكر" },
  { code: "30", name: "30 - ورقلة" },
  { code: "31", name: "31 - وهران" },
  { code: "32", name: "32 - البيض" },
  { code: "33", name: "33 - إليزي" },
  { code: "34", name: "34 - برج بوعريريج" },
  { code: "35", name: "35 - بومرداس" },
  { code: "36", name: "36 - الطارف" },
  { code: "37", name: "37 - تندوف" },
  { code: "38", name: "38 - تيسمسيلت" },
  { code: "39", name: "39 - الوادي" },
  { code: "40", name: "40 - خنشلة" },
  { code: "41", name: "41 - سوق أهراس" },
  { code: "42", name: "42 - تيبازة" },
  { code: "43", name: "43 - ميلة" },
  { code: "44", name: "44 - عين الدفلى" },
  { code: "45", name: "45 - النعامة" },
  { code: "46", name: "46 - عين تموشنت" },
  { code: "47", name: "47 - غرداية" },
  { code: "48", name: "48 - غليزان" },
  { code: "49", name: "49 - تیمیمون" },
  { code: "50", name: "50 - برج باجي مختار" },
  { code: "51", name: "51 - أولاد جلال" },
  { code: "52", name: "52 - بني عباس" },
  { code: "53", name: "53 - إن صالح" },
  { code: "54", name: "54 - إن قزام" },
  { code: "55", name: "55 - تقرت" },
  { code: "56", name: "56 - جانت" },
  { code: "57", name: "57 - المغير" },
  { code: "58", name: "58 - المنيعة" }
];

export default function OrientationHubPage() {
  const [activeMode, setActiveTab] = useState<"predictor" | "target">("predictor");
  const [selectedStream, setSelectedStream] = useState<StreamKey>("Scientific");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCareerGoal, setSelectedCareerGoal] = useState<CareerGoal | "ALL">("ALL");
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);

  // Student Grades State
  const [grades, setGrades] = useState<StudentGrades>({
    generalAverage: 16.50,
    math: 17.00,
    physics: 16.00,
    science: 16.50,
    arabic: 15.00,
    french: 14.00,
    english: 16.00,
  });

  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({
    generalAverage: "16.50",
    math: "17.00",
    physics: "16.00",
    science: "16.50",
    arabic: "15.00",
    french: "14.00",
    english: "16.00",
  });

  // Target Mode Smart Search State
  const [targetSearchQuery, setTargetSearchQuery] = useState<string>("");
  const [selectedTargetCode, setSelectedTargetCode] = useState<string>("C00CAN01");

  const handleGradeChange = (field: keyof StudentGrades, rawValue: string) => {
    const normalized = rawValue.replace(",", ".");
    setGradeInputs((prev) => ({ ...prev, [field]: normalized }));
    const num = Math.min(20, Math.max(0, parseFloat(normalized) || 0));
    setGrades((prev) => ({ ...prev, [field]: num }));
  };

  // Evaluated Branches for Predictor Mode
  const evaluatedBranches = useMemo(() => {
    return searchAndEvaluateBranches(officialBranchesDatabase, grades, {
      stream: selectedStream,
      query: searchQuery,
      category: selectedCategory,
      careerGoal: selectedCareerGoal,
      wilayaCode: selectedWilaya || undefined,
      onlyEligible,
    });
  }, [grades, selectedStream, searchQuery, selectedCategory, selectedCareerGoal, selectedWilaya, onlyEligible]);

  // Target Suggestions in Mode 2
  const targetSuggestions = useMemo(() => {
    return searchAndEvaluateBranches(officialBranchesDatabase, grades, {
      stream: selectedStream,
      query: targetSearchQuery,
      category: "ALL",
      onlyEligible: false,
    });
  }, [grades, selectedStream, targetSearchQuery]);

  const currentTarget = useMemo(() => {
    return officialBranchesDatabase.find((b) => b.code === selectedTargetCode) || officialBranchesDatabase[0];
  }, [selectedTargetCode]);

  const currentTargetRule = useMemo(() => {
    return currentTarget.priorities.find((p) => p.stream === selectedStream) || currentTarget.priorities[0];
  }, [currentTarget, selectedStream]);

  const currentTargetWeighted = useMemo(() => {
    return evaluatedBranches.find((b) => b.code === currentTarget.code)?.calculatedScore || grades.generalAverage;
  }, [evaluatedBranches, currentTarget, grades.generalAverage]);

  return (
    <AppShell>
      <div className="orientation-page">
      <div className="back-link-wrapper">
        <Link className="back-link" href="/tools">← العودة للأدوات</Link>
      </div>

      <section className="subject-page-heading">
        <div>
          <p className="eyebrow">دليل التوجيه الجامعي الشامل 2026/2027</p>
          <h1>المستشار الذكي للتوجيه والجامعات</h1>
          <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>
            احسب معدلك الموزون، ابحث حسب هدفك المستقبلي بالعربية أو الفرنسية، وخطط لتخصص أحلامك.
          </p>
        </div>
        <span className="subject-hero-icon subject-icon-blue" aria-hidden="true">
          <GraduationCap size={32} />
        </span>
      </section>

      <div className="official-disclaimer-banner">
        <div className="official-disclaimer-title">
          <span>ℹ️ تنبيه استرشادي رسمي:</span>
        </div>
        <p>
          البيانات والمعدلات المعروضة في هذا المحاكي هي <strong>نتائج مرجعية تاريخية استرشادية</strong> مستخرجة مباشرةً من المنشور الوزاري رقم 01 لوزارة التعليم العالي والبحث العلمي (MESRS) والملف الرسمي لمعدلات القبول الأدنى للمرحلة الأولى 2026. لا تُعد هذه النتائج ضماناً حتمياً للقبول في الدوات القادمة، وتعتمد معادلات الحساب الموزون (g) على الصيغ والقواعد الوزارية الرسمية.
        </p>
        <div className="official-disclaimer-link">
          🔗 لتأكيد رغباتك الرسمية والتسجيل النهائي، يرجى دائماً زيارة <a href="https://orientation-esi.dz" target="_blank" rel="noopener noreferrer">البوابة الرسمية للتوجيه الجامعي (orientation-esi.dz)</a>.
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="orientation-tabs-wrapper">
        <button
          type="button"
          className={`orientation-tab-btn ${activeMode === "predictor" ? "is-active" : ""}`}
          onClick={() => setActiveTab("predictor")}
        >
          📊 مستكشف التوجيه بمعدلي
        </button>
        <button
          type="button"
          className={`orientation-tab-btn ${activeMode === "target" ? "is-active" : ""}`}
          onClick={() => setActiveTab("target")}
        >
          🎯 حاسبة جامعة أحلامي
        </button>
      </div>

      {/* Grade Input Controls */}
      <section className="orientation-controls-card">
        <div className="orientation-input-group">
          <label htmlFor="stream-select">الشعبة الدراسية:</label>
          <select 
            id="stream-select"
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value as StreamKey)}
          >
            {(Object.keys(streamLabels) as StreamKey[]).map((key) => (
              <option key={key} value={key}>{streamLabels[key]}</option>
            ))}
          </select>
        </div>

        <div className="orientation-input-group">
          <label htmlFor="gen-avg-input">المعدل العام التقديري:</label>
          <input 
            id="gen-avg-input"
            type="text" 
            inputMode="decimal"
            placeholder="16.50"
            value={gradeInputs.generalAverage ?? ""}
            onChange={(e) => handleGradeChange("generalAverage", e.target.value)}
          />
        </div>

        <div className="orientation-input-group">
          <label htmlFor="math-input">الرياضيات:</label>
          <input 
            id="math-input"
            type="text" 
            inputMode="decimal"
            placeholder="17.00"
            value={gradeInputs.math ?? ""}
            onChange={(e) => handleGradeChange("math", e.target.value)}
          />
        </div>

        {(selectedStream === "Scientific" || selectedStream === "Mathematical") && (
          <div className="orientation-input-group">
            <label htmlFor="science-input">العلوم الطبيعية:</label>
            <input 
              id="science-input"
              type="text" 
              inputMode="decimal"
              placeholder="16.50"
              value={gradeInputs.science ?? ""}
              onChange={(e) => handleGradeChange("science", e.target.value)}
            />
          </div>
        )}

        <div className="orientation-input-group">
          <label htmlFor="physics-input">الفيزياء:</label>
          <input 
            id="physics-input"
            type="text" 
            inputMode="decimal"
            placeholder="16.00"
            value={gradeInputs.physics ?? ""}
            onChange={(e) => handleGradeChange("physics", e.target.value)}
          />
        </div>
      </section>

      {/* MODE 1: Predictor List */}
      {activeMode === "predictor" && (
        <>
          {/* Career Goal Filtering Pills */}
          <div className="career-goals-scroll">
            <button
              type="button"
              className={`career-pill ${selectedCareerGoal === "ALL" ? "is-active" : ""}`}
              onClick={() => setSelectedCareerGoal("ALL")}
            >
              🌟 جميع الأهداف
            </button>
            {(Object.keys(careerGoalLabels) as CareerGoal[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`career-pill ${selectedCareerGoal === key ? "is-active" : ""}`}
                onClick={() => setSelectedCareerGoal(key)}
              >
                {careerGoalLabels[key].icon} {careerGoalLabels[key].label}
              </button>
            ))}
          </div>

          <div className="orientation-filter-bar" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
            <div className="orientation-search-wrapper" style={{ flex: "1 1 280px" }}>
              <Search size={16} className="orientation-search-icon" />
              <input 
                type="text" 
                placeholder="ابحث بالعربية أو الفرنسية (مثل: ذكاء، esi، طبيب، informatique, epau)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="orientation-search-input"
              />
            </div>

            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="orientation-category-select"
              style={{ flex: "1 1 180px" }}
            >
              <option value="ALL">جميع القطاعات</option>
              <option value="Medical">العلوم الطبية</option>
              <option value="HigherSchool">المدارس العليا الوطنية</option>
              <option value="Engineering">المدارس المتعددة التقنيات</option>
              <option value="ENS">مدارس الأساتذة</option>
              <option value="DoubleDegree">الشهادات المزدوجة</option>
            </select>

            <select 
              value={selectedWilaya} 
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="orientation-wilaya-select"
              style={{ flex: "1 1 150px" }}
            >
              <option value="">جميع الولايات (58)</option>
              {wilayasList.map((w) => (
                <option key={w.code} value={w.code}>{w.name}</option>
              ))}
            </select>

            <label className="checkbox-filter-label" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input 
                type="checkbox" 
                checked={onlyEligible} 
                onChange={(e) => setOnlyEligible(e.target.checked)} 
              />
              <span>إظهار التخصصات المضمونة والمنافسة فقط</span>
            </label>
          </div>

          <div className="search-results-counter">
            عُثر على <strong>{evaluatedBranches.length}</strong> تخصص مطابق لشروط البحث.
          </div>

          <section className="orientation-grid" aria-live="polite">
            {evaluatedBranches.slice(0, 100).map((item, i) => (
              <FadeInSection key={`${item.code}-${item.universityCode}`} delay={Math.min(i * 30, 300)}>
                <article 
                  className={`orientation-card status-border-${item.status}`}
                >
                  <div className="orientation-card-header">
                    <div className="orientation-badges-group">
                      {(item.category === "HigherSchool" || item.category === "ENS" || item.category === "Engineering") && (
                        <span className="school-type-badge">المدرسة الوطنية العليا</span>
                      )}
                      <span className="code-badge">{item.code} · {item.universityName}</span>
                    </div>
                    <span className={`status-pill status-${item.status}`}>
                      {item.status === "safe" && "🟢 مضمونة بإذن الله"}
                      {item.status === "competitive" && "🟡 منافسة قوية"}
                      {item.status === "stretch" && "🔴 تتطلب رفع النقاط"}
                      {item.status === "nc" && "⚪ خاضع للمرحلة الثانية (NC)"}
                      {item.status === "unavailable" && "⛔ غير متاح لشعبتك"}
                    </span>
                  </div>

                  <h3>{item.name}</h3>
                  <p className="orientation-desc">{item.description}</p>

                  <div className="stream-priority-info-bar">
                    <span>
                      <strong>أولوية شعبتك: </strong>
                      <span className={`priority-tag priority-rank-${item.priorityRank}`}>
                        {item.priorityRank === 1 && "🥇 أولوية الأولى"}
                        {item.priorityRank === 2 && "🥈 أولوية ثانية"}
                        {item.priorityRank === 3 && "🥉 أولوية ثالثة"}
                        {item.priorityRank > 3 && `أولوية ${item.priorityRank}`}
                      </span>
                    </span>
                    <span>
                      معدل القبول لشعبتك: <strong>{typeof item.userCutoff === "number" ? item.userCutoff.toFixed(2) : item.userCutoff}</strong>
                    </span>
                  </div>

                  <div className="orientation-card-formula">
                    <small>الصيغة الرسمية للمعدل الموزون:</small>
                    <code>{item.formulaText}</code>
                  </div>

                  <div className="orientation-card-footer">
                    <div>
                      <small>معدلك الموزون:</small>
                      <strong className="weighted-score">{item.calculatedScore.toFixed(2)}</strong>
                    </div>
                    <div className="threshold-box">
                      <small>الفارق عن القبول:</small>
                      <strong className={item.scoreDifference >= 0 ? "text-success" : "text-danger"}>
                        {item.scoreDifference >= 0 ? `+${item.scoreDifference.toFixed(2)}` : `${item.scoreDifference.toFixed(2)}`}
                      </strong>
                    </div>
                  </div>
                </article>
              </FadeInSection>
            ))}
          </section>
        </>
      )}

      {/* MODE 2: Target Selection with Flexible Search Autocomplete */}
      {activeMode === "target" && (
        <section className="target-mode-wrapper">
          <div className="target-select-card">
            <h2>🎯 ابحث عن جامعة أو تخصص أحلامك بسهولة:</h2>
            <p className="target-subtext">اكتب ما تعرفه بالعربية أو الفرنسية (مثل: "esi", "اساتذة القبة", "طبيب", "معماري", "عنابة") وسيتم التعرف الفوري عليه:</p>

            <input 
              type="text" 
              placeholder="اكتب اسم التخصص أو المدرسة بالفرنسية أو العربية..."
              value={targetSearchQuery}
              onChange={(e) => setTargetSearchQuery(e.target.value)}
              className="target-search-combobox"
            />

            {/* Live Autocomplete Suggestion Cards */}
            <div className="target-suggestions-list">
              {targetSuggestions.slice(0, 6).map((b) => (
                <button
                  key={`${b.code}-${b.universityCode}`}
                  type="button"
                  className={`target-suggestion-item ${selectedTargetCode === b.code ? "is-selected" : ""}`}
                  onClick={() => setSelectedTargetCode(b.code)}
                >
                  <div>
                    <strong>{b.name}</strong>
                    <small>📍 {b.universityName} ({b.location})</small>
                  </div>
                  <span className="suggestion-code">{b.code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="target-analysis-card">
            <div className="target-header">
              <div className="target-header-content">
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                  <span className="eyebrow" style={{ margin: 0 }}>الهدف المختار حالياً</span>
                  {(currentTarget.category === "HigherSchool" || currentTarget.category === "ENS" || currentTarget.category === "Engineering") && (
                    <span className="school-type-badge">المدرسة الوطنية العليا</span>
                  )}
                </div>
                <h2>{currentTarget.name}</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  📍 {currentTarget.universityName} ({currentTarget.location})
                </p>
              </div>

              <div className="target-score-badge">
                <small>الحد الأدنى الرسمي (2026)</small>
                <strong>
                  {typeof currentTargetRule.cutoff === "number"
                    ? currentTargetRule.cutoff.toFixed(2)
                    : currentTargetRule.cutoff}
                </strong>
              </div>
            </div>

            <div className="target-comparison-row">
              <div className="score-stat-box">
                <span>معدلك الموزون المحسوب حالياً:</span>
                <strong className={
                  typeof currentTargetRule.cutoff === "number" && currentTargetWeighted >= currentTargetRule.cutoff 
                    ? "text-success" 
                    : "text-danger"
                }>
                  {currentTargetWeighted.toFixed(2)} / 20
                </strong>
              </div>

              <div className="score-stat-box">
                <span>الفارق عن القبول:</span>
                <strong>
                  {typeof currentTargetRule.cutoff === "number"
                    ? (currentTargetWeighted >= currentTargetRule.cutoff
                        ? `+${(currentTargetWeighted - currentTargetRule.cutoff).toFixed(2)} (مؤهل للقبول!)`
                        : `${(currentTargetWeighted - currentTargetRule.cutoff).toFixed(2)} نقطة للوصول`
                      )
                    : "غير محدد بالرقم (خاضع للمرحلة الثانية)"
                  }
                </strong>
              </div>
            </div>

            <div className="roadmap-box">
              <h3>🗺️ المواد المفتاحية المعنية في حساب المعدل الموزون:</h3>
              <p>المعادلة الرسمية المعتمدة: <code>{currentTarget.formulaText}</code></p>
              <ul className="key-subjects-list">
                {currentTarget.keySubjects.map((sub) => (
                  <li key={sub}>
                    <span>✦ المادة المفتاحية: <strong>{sub}</strong></span>
                    <small>التركيز المكثف على هذه المادة يضاعف حظوظك للوصول إلى معدل هذا التخصص.</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
      </div>
    </AppShell>
  );
}
