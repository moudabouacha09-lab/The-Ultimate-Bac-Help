// src/app/contribute/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { subjects } from "@/lib/subjects";
import {
  GraduationCap,
  ShieldCheck,
  School,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  Mail,
  Building2,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";

const ALGERIA_WILAYAS = [
  "01 - أدرار",
  "02 - الشلف",
  "03 - الأغواط",
  "04 - أم البواقي",
  "05 - باتنة",
  "06 - بجاية",
  "07 - بسكرة",
  "08 - بشار",
  "09 - البليدة",
  "10 - البويرة",
  "11 - تمنراست",
  "12 - تبسة",
  "13 - تلمسان",
  "14 - تيارت",
  "15 - تيزي وزو",
  "16 - الجزائر",
  "17 - الجلفة",
  "18 - جيجل",
  "19 - سطيف",
  "20 - سعيدة",
  "21 - سكيكدة",
  "22 - سيدي بلعباس",
  "23 - عنابة",
  "24 - قالمة",
  "25 - قسنطينة",
  "26 - المدية",
  "27 - مستغانم",
  "28 - المسيلة",
  "29 - معسكر",
  "30 - ورقلة",
  "31 - وهران",
  "32 - البيض",
  "33 - إليزي",
  "34 - برج بوعريريج",
  "35 - بومرداس",
  "36 - الطارف",
  "37 - تندوف",
  "38 - تيسمسيلت",
  "39 - الوادي",
  "40 - خنشلة",
  "41 - سوق أهراس",
  "42 - تيبازة",
  "43 - ميلة",
  "44 - عين الدفلى",
  "45 - النعامة",
  "46 - عين تموشنت",
  "47 - غرداية",
  "48 - غليزان",
  "49 - تيميمون",
  "50 - برج باجي مختار",
  "51 - أولاد جلال",
  "52 - بني عباس",
  "53 - عين صالح",
  "54 - عين قزام",
  "55 - تقرت",
  "56 - جانت",
  "57 - المغير",
  "58 - المنيعة"
];

type ApplicationStatus = "loading" | "none" | "pending" | "approved" | "rejected" | "success";

export default function ContributePage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const supabase = createClient();

  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>("loading");
  const [existingAppDate, setExistingAppDate] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [roleRequested, setRoleRequested] = useState<"teacher" | "inspector">("teacher");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [institution, setInstitution] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [yearsExperience, setYearsExperience] = useState<string>("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Sync user name when user is loaded
  useEffect(() => {
    if (user?.username && !fullName) {
      setFullName(user.username);
    }
  }, [user, fullName]);

  // Check existing application status on load
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setApplicationStatus("none");
      return;
    }

    const checkApplication = async () => {
      try {
        const { data, error } = await supabase
          .from("contributor_applications")
          .select("id, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error checking application status:", error);
          setApplicationStatus("none");
          return;
        }

        if (data) {
          setExistingAppDate(data.created_at);
          if (data.status === "pending") {
            setApplicationStatus("pending");
          } else if (data.status === "approved") {
            setApplicationStatus("approved");
          } else {
            // Rejected or none
            setApplicationStatus("none");
          }
        } else {
          setApplicationStatus("none");
        }
      } catch (err) {
        console.error("Unexpected error checking application:", err);
        setApplicationStatus("none");
      }
    };

    checkApplication();
  }, [user, authLoading]);

  // Toggle subject selection
  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      openAuthModal("login");
      return;
    }

    if (!fullName.trim()) {
      setSubmitError("يرجى إدخال الاسم الكامل");
      return;
    }

    if (selectedSubjects.length === 0) {
      setSubmitError("يرجى اختيار مادة واحدة على الأقل من قائمة المواد");
      return;
    }

    if (!institution.trim()) {
      setSubmitError("يرجى إدخال المؤسسة التعليمية الحالية");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert application row
      const { error: insertError } = await supabase
        .from("contributor_applications")
        .insert({
          user_id: user.id,
          full_name: fullName.trim(),
          role_requested: roleRequested,
          subjects: selectedSubjects,
          institution: institution.trim(),
          wilaya: wilaya || null,
          years_experience: yearsExperience ? parseInt(yearsExperience.toString(), 10) : null,
          message: message.trim() || null
        });

      if (insertError) {
        console.error("Application insert error:", insertError);
        throw new Error(`فشل إرسال الطلب: ${insertError.message}`);
      }

      setApplicationStatus("success");
    } catch (err: any) {
      setSubmitError(err.message || "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-gutter py-xl flex flex-col items-center">
        {/* Loading State */}
        {authLoading || applicationStatus === "loading" ? (
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-12 text-center shadow-sm">
            <div className="inline-block w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-body text-body-md text-on-surface-variant">
              جاري التحقق من حالة الحساب والطلبات السابقة...
            </p>
          </div>
        ) : !user ? (
          /* Unauthenticated State */
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-8 md:p-12 text-center shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <School size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-display-lg text-primary font-bold">
                الانضمام كأستاذ أو مفتش
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto">
                يرجى تسجيل الدخول بحسابك أولاً لتتمكن من تقديم طلب الانضمام إلى فريق المساهمين والأساتذة المعتمدين.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => openAuthModal("login")}
                className="bg-primary text-on-primary font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="bg-surface-container text-on-surface font-body text-label-md font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </div>
        ) : applicationStatus === "pending" ? (
          /* Pending State */
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-8 md:p-12 text-center shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
              <Clock size={40} />
            </div>
            <div className="space-y-3">
              <span className="font-body text-caption font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block">
                طلبك قيد الدراسة ⏳
              </span>
              <h1 className="font-headline text-display-lg text-primary font-bold">
                طلبك قيد المراجعة
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                شكراً لاهتمامك بالانضمام إلى فريق المساهمين في منصة البكالوريا. طلبك محفوظ حالياً وهو قيد الفحص والتدقيق من قبل الفريق الأكاديمي.
              </p>
              <div className="p-4 bg-surface-container-low border border-primary/10 rounded-xl text-caption text-on-surface-variant text-right max-w-md mx-auto space-y-1">
                <p>
                  📧 <strong>البريد المرتبط:</strong> {user.email}
                </p>
                {existingAppDate && (
                  <p>
                    📅 <strong>تاريخ التقديم:</strong>{" "}
                    {new Date(existingAppDate).toLocaleDateString("ar-DZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                )}
                <p className="text-primary font-medium mt-2">
                  سنقوم بالتواصل معك عبر البريد الإلكتروني فور استكمال مراجعة الوثائق.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-body text-label-md font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>العودة للرئيسية</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : applicationStatus === "approved" ? (
          /* Approved State */
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-8 md:p-12 text-center shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <UserCheck size={40} />
            </div>
            <div className="space-y-3">
              <span className="font-body text-caption font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                عضو معتمد 🎉
              </span>
              <h1 className="font-headline text-display-lg text-primary font-bold">
                أهلاً بك في فريق المساهمين!
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                تمت الموافقة على طلبك بنجاح وأصبحت رسمياً ضمن الهيئة التدريسية المعتمدة للمنصة. شكراً لمساهمتك القيمة في دعم وتوجيه طلاب البكالوريا في الجزائر.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-body text-label-md font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>العودة للرئيسية</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : applicationStatus === "success" ? (
          /* Success Confirmation State */
          <div className="w-full max-w-2xl bg-surface-bright border border-primary/10 rounded-2xl p-8 md:p-12 text-center shadow-sm space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 size={44} />
            </div>
            <div className="space-y-3">
              <span className="font-body text-caption font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                تم الاستلام بنجاح ✓
              </span>
              <h1 className="font-headline text-display-lg text-primary font-bold">
                تم استلام طلبك بنجاح
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                شكراً لاهتمامك بالانضمام إلى منصة البكالوريا. سيتم مراجعة طلبك وتدقيق الوثائق من قبل فريقنا وسنتواصل معك قريباً عبر البريد الإلكتروني.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-body text-label-md font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>العودة للرئيسية</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          /* Main Application Form (State 1 & Rejected state) */
          <div className="w-full max-w-3xl bg-surface-bright border border-primary/10 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
            {/* Form Header */}
            <div className="mb-8 text-center space-y-3">
              <span className="font-body text-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block font-semibold">
                الهيئة التدريسية 🎓
              </span>
              <h1 className="font-headline text-display-lg text-primary font-bold">
                طلب الانضمام للهيئة التدريسية
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant max-w-xl mx-auto">
                شارك في بناء مستقبل التعليم في الجزائر. نرحب بالأساتذة والمفتشين ذوي الخبرة لإثراء المحتوى واعتماده.
              </p>
            </div>

            {submitError && (
              <div className="p-4 mb-6 bg-error/10 border border-error/20 rounded-xl text-error text-caption font-semibold flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Role Selection (Bento Cards) */}
              <div className="space-y-2">
                <label className="block font-body text-label-md font-bold text-on-surface text-right">
                  الصفة والدور المطلوب <span className="text-secondary">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Teacher Option */}
                  <div
                    onClick={() => setRoleRequested("teacher")}
                    className={`relative flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                      roleRequested === "teacher"
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-primary/15 bg-surface-container-lowest hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        roleRequested === "teacher"
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      <School size={24} />
                    </div>
                    <div>
                      <div className="font-headline text-headline-md font-bold text-primary mb-1">
                        أستاذ
                      </div>
                      <p className="font-body text-caption text-on-surface-variant leading-relaxed">
                        تقديم ملخصات، تمارين، مقترحات وحلول وشروحات للطلاب.
                      </p>
                    </div>
                  </div>

                  {/* Inspector Option */}
                  <div
                    onClick={() => setRoleRequested("inspector")}
                    className={`relative flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${
                      roleRequested === "inspector"
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-primary/15 bg-surface-container-lowest hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        roleRequested === "inspector"
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <div className="font-headline text-headline-md font-bold text-primary mb-1">
                        مفتش تربية وطنية
                      </div>
                      <p className="font-body text-caption text-on-surface-variant leading-relaxed">
                        مراجعة، تدقيق، واعتماد المحتوى التعليمي والمنهجي.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Personal Info & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-label-md font-bold text-on-surface mb-1.5 text-right">
                    الاسم الكامل <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. محمد بن عبد الله"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-label-md font-bold text-on-surface mb-1.5 text-right">
                    البريد الإلكتروني الحسابي
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      readOnly
                      value={user.email}
                      className="w-full bg-surface-container border border-primary/10 rounded-lg px-4 py-3 text-on-surface-variant font-body text-body-md cursor-not-allowed pr-10"
                    />
                    <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  </div>
                  <span className="text-caption text-on-surface-variant mt-1 block">
                    (مرتبط بحسابك الحالي ويُستخدم للمراسلة الرسمية)
                  </span>
                </div>
              </div>

              {/* 3. Subjects Multi-select Chips */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-body text-label-md font-bold text-on-surface text-right">
                    المادة أو المواد التي تدرّسها / تشرف عليها <span className="text-secondary">*</span>
                  </label>
                  <span className="text-caption text-secondary font-semibold">
                    {selectedSubjects.length > 0 ? `(${selectedSubjects.length} مختارة)` : "اختر مادة أو أكثر"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {subjects.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj.name);
                    return (
                      <button
                        key={subj.slug}
                        type="button"
                        onClick={() => toggleSubject(subj.name)}
                        className={`font-body text-label-md px-4 py-2 rounded-full font-medium cursor-pointer transition-all flex items-center gap-2 ${
                          isSelected
                            ? "bg-primary text-on-primary font-bold shadow-sm"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-primary/10"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{subj.icon}</span>
                        <span>{subj.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Institution & Wilaya */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-label-md font-bold text-on-surface mb-1.5 text-right">
                    المؤسسة التعليمية الحالية <span className="text-secondary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="اسم الثانوية، المعهد، أو مديرية التربية"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-label-md font-bold text-on-surface mb-1.5 text-right">
                    الولاية <span className="text-on-surface-variant text-caption font-normal">(اختياري)</span>
                  </label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                  >
                    <option value="">اختر الولاية...</option>
                    {ALGERIA_WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Years of Experience */}
              <div>
                <label className="block font-body text-label-md font-bold text-on-surface mb-1.5 text-right">
                  سنوات الخبرة في التعليم الثانوي <span className="text-on-surface-variant text-caption font-normal">(اختياري)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="مثال: 8"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full max-w-xs bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              {/* 6. Short Message (Optional) */}
              <div>
                <label className="block font-body text-label-md font-bold text-on-surface mb-1.5 text-right">
                  رسالة قصيرة <span className="text-on-surface-variant text-caption font-normal">(اختياري)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="أي معلومات إضافية أو ملاحظات تود مشاركتها مع الفريق الأكاديمي..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-on-surface font-body text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end items-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-primary/20 text-on-surface-variant font-body text-label-md font-semibold text-center hover:bg-surface-container transition-colors"
                >
                  إلغاء
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-on-primary font-body text-label-md font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <span>تقديم الطلب</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
