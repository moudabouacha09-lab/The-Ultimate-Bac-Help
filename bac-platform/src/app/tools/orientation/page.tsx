// src/app/tools/orientation/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { FadeInSection } from "@/components/effects/fade-in-section";
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
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col gap-xl">
        {/* ── Breadcrumb / Back Link ── */}
        <div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 font-body text-label-md font-semibold text-primary hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
            <span>العودة للأدوات المساعدة</span>
          </Link>
        </div>

        {/* ── Page Header ── */}
        <header className="space-y-3 border-b border-primary/10 pb-6">
          <span className="font-body text-label-md text-secondary bg-secondary/10 px-3.5 py-1 rounded-full inline-block font-semibold">
            دليل التوجيه الجامعي الشامل 2026/2027 🎓
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold">
            المستشار الذكي للتوجيه والجامعات
          </h1>
          <p className="font-body text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            احسب معدلك الموزون بدقة، ابحث حسب هدفك المستقبلي بالعربية أو الفرنسية، وتعرّف على التخصصات المتاحة لشعبتك وفق المنشور الوزاري الرسمي.
          </p>
        </header>

        {/* ── 1. Official Legal Disclaimer Banner ── */}
        <section
          aria-label="تنبيه استرشادي رسمي"
          className="bg-surface-variant/40 border border-primary/15 rounded-xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-start"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">info</span>
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="font-headline text-headline-md text-primary font-bold text-base md:text-lg">
              تنبيه استرشادي رسمي:
            </h2>
            <p className="font-body text-body-md text-on-surface leading-relaxed">
              البيانات والمعدلات المعروضة في هذا المحاكي هي <strong className="font-bold text-primary">نتائج مرجعية تاريخية استرشادية</strong> مستخرجة مباشرةً من المنشور الوزاري رقم 01 لوزارة التعليم العالي والبحث العلمي (MESRS) والملف الرسمي لمعدلات القبول الأدنى للمرحلة الأولى 2026. لا تُعد هذه النتائج ضماناً حتمياً للقبول في الدورات القادمة، وتعتمد معادلات الحساب الموزون (g) على الصيغ والقواعد الوزارية الرسمية.
            </p>
            <div className="font-body text-caption text-on-surface-variant flex items-center gap-1.5 pt-1">
              <span className="material-symbols-outlined text-base text-secondary">link</span>
              <span>لتأكيد رغباتك الرسمية والتسجيل النهائي، يرجى دائماً زيارة </span>
              <a
                href="https://orientation-esi.dz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-bold underline hover:text-secondary/80 transition-colors"
              >
                البوابة الرسمية للتوجيه الجامعي (orientation-esi.dz)
              </a>.
            </div>
          </div>
        </section>

        {/* ── 2. Mode Toggle Buttons ── */}
        <section aria-label="أوضاع المستشار" className="flex flex-col sm:flex-row gap-3 p-1.5 bg-surface-container rounded-xl border border-primary/10">
          <button
            type="button"
            className={`flex-1 py-3 px-6 rounded-lg font-body text-label-md cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeMode === "predictor"
                ? "bg-primary text-on-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-bright/70 font-medium"
            }`}
            onClick={() => setActiveTab("predictor")}
          >
            <span className="material-symbols-outlined text-lg">analytics</span>
            <span>مستكشف التوجيه بمعدلي</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-6 rounded-lg font-body text-label-md cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeMode === "target"
                ? "bg-primary text-on-primary font-bold shadow-sm"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-bright/70 font-medium"
            }`}
            onClick={() => setActiveTab("target")}
          >
            <span className="material-symbols-outlined text-lg">track_changes</span>
            <span>حاسبة جامعة أحلامي</span>
          </button>
        </section>

        {/* ── 3. Grade Input Controls ── */}
        <section className="bg-surface-bright border border-primary/10 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
            <h2 className="font-headline text-headline-md text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">tune</span>
              <span>بيانات الطالب والنقاط التقديرية</span>
            </h2>
            <span className="font-body text-caption font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              حساب فوري للمعدل الموزون
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Stream Selector */}
            <div className="space-y-1.5">
              <label htmlFor="stream-select" className="block font-body text-label-md font-bold text-on-surface text-right">
                الشعبة الدراسية:
              </label>
              <div className="relative">
                <select
                  id="stream-select"
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value as StreamKey)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer appearance-none pr-10"
                >
                  {(Object.keys(streamLabels) as StreamKey[]).map((key) => (
                    <option key={key} value={key}>
                      {streamLabels[key]}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            {/* General Average */}
            <div className="space-y-1.5">
              <label htmlFor="gen-avg-input" className="block font-body text-label-md font-bold text-on-surface text-right">
                المعدل العام التقديري:
              </label>
              <div className="relative">
                <input
                  id="gen-avg-input"
                  type="text"
                  inputMode="decimal"
                  placeholder="16.50"
                  value={gradeInputs.generalAverage ?? ""}
                  onChange={(e) => handleGradeChange("generalAverage", e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md font-bold text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  dir="ltr"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-caption pointer-events-none">
                  / 20
                </span>
              </div>
            </div>

            {/* Mathematics */}
            <div className="space-y-1.5">
              <label htmlFor="math-input" className="block font-body text-label-md font-bold text-on-surface text-right">
                الرياضيات:
              </label>
              <div className="relative">
                <input
                  id="math-input"
                  type="text"
                  inputMode="decimal"
                  placeholder="17.00"
                  value={gradeInputs.math ?? ""}
                  onChange={(e) => handleGradeChange("math", e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md font-bold text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  dir="ltr"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-caption pointer-events-none">
                  / 20
                </span>
              </div>
            </div>

            {/* Science (shown for Science & Math streams) */}
            {(selectedStream === "Scientific" || selectedStream === "Mathematical") && (
              <div className="space-y-1.5">
                <label htmlFor="science-input" className="block font-body text-label-md font-bold text-on-surface text-right">
                  العلوم الطبيعية:
                </label>
                <div className="relative">
                  <input
                    id="science-input"
                    type="text"
                    inputMode="decimal"
                    placeholder="16.50"
                    value={gradeInputs.science ?? ""}
                    onChange={(e) => handleGradeChange("science", e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md font-bold text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    dir="ltr"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-caption pointer-events-none">
                    / 20
                  </span>
                </div>
              </div>
            )}

            {/* Physics */}
            <div className="space-y-1.5">
              <label htmlFor="physics-input" className="block font-body text-label-md font-bold text-on-surface text-right">
                الفيزياء:
              </label>
              <div className="relative">
                <input
                  id="physics-input"
                  type="text"
                  inputMode="decimal"
                  placeholder="16.00"
                  value={gradeInputs.physics ?? ""}
                  onChange={(e) => handleGradeChange("physics", e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md font-bold text-left focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  dir="ltr"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-caption pointer-events-none">
                  / 20
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MODE 1: Predictor List ── */}
        {activeMode === "predictor" && (
          <div className="space-y-6">
            {/* 4. Career Goal Filter Chips */}
            <section aria-label="تصفية حسب الهدف المهني" className="space-y-2">
              <label className="block font-body text-label-md font-bold text-on-surface text-right">
                المجال أو الهدف المهني المفضل:
              </label>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
                <button
                  type="button"
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-body text-label-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCareerGoal === "ALL"
                      ? "bg-primary text-on-primary font-bold shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-primary/10 font-medium"
                  }`}
                  onClick={() => setSelectedCareerGoal("ALL")}
                >
                  <span>🌟</span>
                  <span>جميع الأهداف</span>
                </button>
                {(Object.keys(careerGoalLabels) as CareerGoal[]).map((key) => {
                  const isSelected = selectedCareerGoal === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`whitespace-nowrap px-4 py-2 rounded-full font-body text-label-md transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-primary text-on-primary font-bold shadow-sm"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-primary/10 font-medium"
                      }`}
                      onClick={() => setSelectedCareerGoal(key)}
                    >
                      <span>{careerGoalLabels[key].icon}</span>
                      <span>{careerGoalLabels[key].label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 5. Filter Bar (Search, Sector, Wilaya, Checkbox) */}
            <section aria-label="أدوات البحث والتصفية" className="bg-surface-bright border border-primary/10 rounded-xl p-4 md:p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3 flex-wrap items-stretch md:items-center">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[260px]">
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-primary/50 text-xl pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="ابحث بالعربية أو الفرنسية (مثل: ذكاء، esi، طبيب، informatique, epau)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg pr-11 pl-4 py-2.5 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Sector Select */}
                <div className="relative min-w-[180px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-2.5 font-body text-label-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors appearance-none pr-10"
                  >
                    <option value="ALL">جميع القطاعات</option>
                    <option value="Medical">العلوم الطبية</option>
                    <option value="HigherSchool">المدارس العليا الوطنية</option>
                    <option value="Engineering">المدارس المتعددة التقنيات</option>
                    <option value="ENS">مدارس الأساتذة</option>
                    <option value="DoubleDegree">الشهادات المزدوجة</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>

                {/* Wilaya Select */}
                <div className="relative min-w-[170px]">
                  <select
                    value={selectedWilaya}
                    onChange={(e) => setSelectedWilaya(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-2.5 font-body text-label-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors appearance-none pr-10"
                  >
                    <option value="">جميع الولايات (58)</option>
                    {wilayasList.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Bottom Row: Checkbox & Results Counter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-primary/10">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyEligible}
                    onChange={(e) => setOnlyEligible(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer border-primary/30"
                  />
                  <span className="font-body text-label-md font-semibold text-on-surface">
                    إظهار التخصصات المضمونة والمنافسة فقط
                  </span>
                </label>

                <div className="font-body text-label-md text-on-surface-variant">
                  عُثر على <strong className="text-primary font-bold text-body-md">{evaluatedBranches.length}</strong> تخصص مطابق لشروط البحث.
                </div>
              </div>
            </section>

            {/* 6. Result Cards Bento Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite">
              {evaluatedBranches.slice(0, 100).map((item, i) => {
                return (
                  <FadeInSection key={`${item.code}-${item.universityCode}`} delay={Math.min(i * 30, 300)}>
                    <article className="bg-surface-bright border border-primary/10 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between gap-4 relative overflow-hidden group">
                      <div className="space-y-3">
                        {/* Header Badges & Status */}
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            {(item.category === "HigherSchool" || item.category === "ENS" || item.category === "Engineering") && (
                              <span className="bg-primary/10 text-primary font-body text-caption font-bold px-2.5 py-0.5 rounded">
                                المدرسة الوطنية العليا
                              </span>
                            )}
                            <span className="font-body text-caption font-semibold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded">
                              {item.code} · {item.universityName}
                            </span>
                          </div>

                          {/* Status Badge */}
                          {item.status === "safe" && (
                            <span className="bg-secondary/10 text-secondary border border-secondary/20 font-body text-caption font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                              <span>🟢</span>
                              <span>مضمونة بإذن الله</span>
                            </span>
                          )}
                          {item.status === "competitive" && (
                            <span className="bg-primary/10 text-primary border border-primary/20 font-body text-caption font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                              <span>🟡</span>
                              <span>منافسة قوية</span>
                            </span>
                          )}
                          {item.status === "stretch" && (
                            <span className="bg-error/10 text-error border border-error/20 font-body text-caption font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                              <span>🔴</span>
                              <span>تتطلب رفع النقاط</span>
                            </span>
                          )}
                          {item.status === "nc" && (
                            <span className="bg-surface-container text-on-surface-variant border border-primary/10 font-body text-caption font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
                              <span>⚪</span>
                              <span>خاضع للمرحلة الثانية (NC)</span>
                            </span>
                          )}
                          {item.status === "unavailable" && (
                            <span className="bg-surface-container text-on-surface-variant/60 font-body text-caption font-medium px-3 py-1 rounded-full inline-flex items-center gap-1">
                              <span>⛔</span>
                              <span>غير متاح لشعبتك</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-headline text-headline-md text-primary font-bold leading-snug group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <p className="font-body text-body-md text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {/* Stream Priority & Cutoff Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-surface-container-low rounded-lg border border-primary/5 text-caption font-body">
                          <span className="flex items-center gap-1">
                            <strong className="text-on-surface">أولوية شعبتك: </strong>
                            <span className="font-semibold text-primary">
                              {item.priorityRank === 1 && "🥇 أولوية أولى"}
                              {item.priorityRank === 2 && "🥈 أولوية ثانية"}
                              {item.priorityRank === 3 && "🥉 أولوية ثالثة"}
                              {item.priorityRank > 3 && `أولوية ${item.priorityRank}`}
                            </span>
                          </span>
                          <span>
                            معدل القبول الأدنى: <strong className="text-primary font-bold text-body-md" dir="ltr">{typeof item.userCutoff === "number" ? item.userCutoff.toFixed(2) : item.userCutoff}</strong>
                          </span>
                        </div>

                        {/* Formula text */}
                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-primary/10 font-body text-caption text-on-surface-variant flex items-center gap-2">
                          <span className="font-semibold text-primary shrink-0">الصيغة الرسمية:</span>
                          <code className="font-mono text-primary font-bold text-xs truncate" dir="ltr">{item.formulaText}</code>
                        </div>

                        {/* Footer: Score Comparison */}
                        <div className="flex items-center justify-between border-t border-primary/10 pt-4 mt-1">
                          <div>
                            <span className="font-body text-caption text-on-surface-variant block">معدلك الموزون:</span>
                            <strong className="font-headline text-headline-md text-primary font-bold" dir="ltr">
                              {item.calculatedScore.toFixed(2)}
                            </strong>
                          </div>
                          <div className="text-left">
                            <span className="font-body text-caption text-on-surface-variant block">الفارق عن القبول:</span>
                            <strong
                              className={`font-body text-label-md font-bold px-3 py-1 rounded-full inline-block mt-0.5 ${
                                item.scoreDifference >= 0
                                  ? "bg-secondary/10 text-secondary"
                                  : "bg-error/10 text-error"
                              }`}
                              dir="ltr"
                            >
                              {item.scoreDifference >= 0
                                ? `+${item.scoreDifference.toFixed(2)}`
                                : `${item.scoreDifference.toFixed(2)}`}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </article>
                  </FadeInSection>
                );
              })}
            </section>
          </div>
        )}

        {/* ── MODE 2: Target Selection with Search & Analysis ── */}
        {activeMode === "target" && (
          <section className="space-y-8" aria-label="حاسبة جامعة أحلامي">
            {/* Target Search Card */}
            <div className="bg-surface-bright border border-primary/10 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h2 className="font-headline text-headline-md text-primary font-bold mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">search</span>
                  <span>ابحث عن جامعة أو تخصص أحلامك بسهولة:</span>
                </h2>
                <p className="font-body text-body-md text-on-surface-variant">
                  اكتب ما تعرفه بالعربية أو الفرنسية (مثل: "esi", "اساتذة القبة", "طبيب", "معماري", "عنابة") وسيتم التعرف الفوري عليه:
                </p>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-primary/50 text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  placeholder="اكتب اسم التخصص أو المدرسة بالفرنسية أو العربية..."
                  value={targetSearchQuery}
                  onChange={(e) => setTargetSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg pr-11 pl-4 py-3 font-body text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              {/* Live Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {targetSuggestions.slice(0, 6).map((b) => {
                  const isSelected = selectedTargetCode === b.code;
                  return (
                    <button
                      key={`${b.code}-${b.universityCode}`}
                      type="button"
                      className={`p-4 rounded-xl cursor-pointer transition-all text-right flex flex-col justify-between gap-2 border ${
                        isSelected
                          ? "bg-primary text-on-primary border-primary shadow-sm"
                          : "bg-surface-container-lowest hover:bg-primary/5 text-on-surface border-primary/10 hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedTargetCode(b.code)}
                    >
                      <div>
                        <strong className={`font-body text-label-md font-bold block ${isSelected ? "text-on-primary" : "text-primary"}`}>
                          {b.name}
                        </strong>
                        <span className={`font-body text-caption block mt-1 ${isSelected ? "text-on-primary/80" : "text-on-surface-variant"}`}>
                          📍 {b.universityName} ({b.location})
                        </span>
                      </div>
                      <span className={`font-body text-caption font-semibold self-start px-2 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-surface-container text-primary"}`}>
                        {b.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Detailed Analysis Card */}
            <div className="bg-surface-bright border border-primary/10 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/10 pb-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-label-md font-semibold text-secondary bg-secondary/10 px-3 py-0.5 rounded-full">
                      الهدف المختار حالياً 🎯
                    </span>
                    {(currentTarget.category === "HigherSchool" || currentTarget.category === "ENS" || currentTarget.category === "Engineering") && (
                      <span className="bg-primary/10 text-primary font-body text-caption font-bold px-2.5 py-0.5 rounded">
                        المدرسة الوطنية العليا
                      </span>
                    )}
                  </div>
                  <h2 className="font-headline text-display-lg text-primary font-bold text-2xl md:text-3xl">
                    {currentTarget.name}
                  </h2>
                  <p className="font-body text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-secondary">location_on</span>
                    <span>{currentTarget.universityName} ({currentTarget.location})</span>
                  </p>
                </div>

                {/* Score Target Box */}
                <div className="bg-primary text-on-primary p-4 rounded-xl text-center min-w-[160px] shadow-sm">
                  <span className="font-body text-caption text-primary-fixed-dim block">
                    الحد الأدنى الرسمي (2026)
                  </span>
                  <strong className="font-headline text-headline-lg font-bold block mt-1" dir="ltr">
                    {typeof currentTargetRule.cutoff === "number"
                      ? currentTargetRule.cutoff.toFixed(2)
                      : currentTargetRule.cutoff}
                  </strong>
                </div>
              </div>

              {/* Comparison Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-surface-container-lowest border border-primary/10 space-y-1">
                  <span className="font-body text-label-md text-on-surface-variant block font-medium">
                    معدلك الموزون المحسوب حالياً:
                  </span>
                  <strong
                    className={`font-headline text-headline-lg font-bold block ${
                      typeof currentTargetRule.cutoff === "number" && currentTargetWeighted >= currentTargetRule.cutoff
                        ? "text-primary"
                        : "text-error"
                    }`}
                    dir="ltr"
                  >
                    {currentTargetWeighted.toFixed(2)} / 20
                  </strong>
                </div>

                <div className="p-5 rounded-xl bg-surface-container-lowest border border-primary/10 space-y-1">
                  <span className="font-body text-label-md text-on-surface-variant block font-medium">
                    الفارق عن القبول:
                  </span>
                  <strong className="font-body text-label-md font-bold block text-primary mt-1">
                    {typeof currentTargetRule.cutoff === "number"
                      ? currentTargetWeighted >= currentTargetRule.cutoff
                        ? `+${(currentTargetWeighted - currentTargetRule.cutoff).toFixed(2)} (مؤهل للقبول بإذن الله! 🎉)`
                        : `${(currentTargetWeighted - currentTargetRule.cutoff).toFixed(2)} نقطة للوصول 🎯`
                      : "غير محدد بالرقم (خاضع للمرحلة الثانية)"}
                  </strong>
                </div>
              </div>

              {/* Roadmap & Key Subjects Box */}
              <div className="p-6 rounded-xl bg-surface-container-lowest border border-primary/10 space-y-4">
                <h3 className="font-headline text-headline-md text-primary font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">explore</span>
                  <span>المواد المفتاحية المعنية في حساب المعدل الموزون:</span>
                </h3>

                <div className="p-3 bg-surface-container rounded-lg font-body text-body-md text-on-surface">
                  <span className="font-bold text-primary">المعادلة الرسمية المعتمدة: </span>
                  <code className="font-mono text-primary font-bold mr-2" dir="ltr">{currentTarget.formulaText}</code>
                </div>

                <ul className="space-y-3 pt-2">
                  {currentTarget.keySubjects.map((sub) => (
                    <li key={sub} className="flex items-start gap-3 p-3 rounded-lg bg-surface-bright border border-primary/5">
                      <span className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5">
                        stars
                      </span>
                      <div>
                        <span className="font-body text-label-md font-bold text-primary block">
                          المادة المفتاحية: {sub}
                        </span>
                        <p className="font-body text-caption text-on-surface-variant mt-0.5">
                          التركيز المكثف على هذه المادة يضاعف حظوظك المباشرة للوصول إلى معدل هذا التخصص.
                        </p>
                      </div>
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

