"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/client";
import { Users, MapPin, GraduationCap, Search, ArrowRight } from "lucide-react";

type Contributor = {
  id: string;
  full_name: string | null;
  title: string | null;
  branch: string | null;
  role: "teacher" | "admin";
};

const branchLabels: Record<string, string> = {
  "experimental-science": "العلوم التجريبية",
  math: "الرياضيات",
  "technical-math": "التقني الرياضي",
  "management-econ": "التسيير والاقتصاد",
  "arts-philosophy": "الآداب والفلسفة",
  "foreign-languages": "اللغات الأجنبية",
};

export default function TeamPage() {
  const supabase = createClient();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadContributors = async () => {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, full_name, title, branch, role")
        .in("role", ["teacher", "admin"])
        .order("full_name", { ascending: true });

      if (!active) return;
      if (fetchError) setError("تعذر تحميل قائمة المساهمين حالياً.");
      setContributors((data as Contributor[] | null) ?? []);
      setLoading(false);
    };
    loadContributors();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLocaleLowerCase();
    if (!value) return contributors;
    return contributors.filter((person) =>
      [person.full_name, person.title, person.branch]
        .filter(Boolean)
        .some((field) => field!.toLocaleLowerCase().includes(value))
    );
  }, [contributors, query]);

  return (
    <AppShell>
      <div className="team-page max-w-6xl mx-auto px-gutter py-xl">
        <Link className="back-link inline-flex items-center gap-2 mb-6" href="/tools">
          <ArrowRight size={16} /> العودة للأدوات
        </Link>
        <header className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-label-md font-semibold">
            <Users size={16} /> فريق المنصة
          </span>
          <h1 className="font-headline text-display-lg text-primary font-bold mt-4 mb-4">فريق العمل والمساهمون</h1>
          <p className="font-body text-body-lg text-on-surface-variant leading-relaxed">
            نخبة من الأساتذة والمساهمين المعتمدين الذين يثرون منصة البكالوريا بدروس واختبارات موثوقة.
          </p>
        </header>

        <div className="max-w-xl mx-auto mb-8 relative">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن أستاذ أو تخصص..."
            aria-label="البحث في المساهمين"
            className="w-full bg-surface-bright border border-primary/20 rounded-xl py-3 pr-11 pl-4 text-on-surface font-body focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-on-surface-variant">جاري تحميل قائمة المساهمين...</div>
        ) : error ? (
          <div className="bg-error/10 text-error border border-error/20 rounded-xl p-6 text-center">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-surface-container-low border border-primary/10 rounded-xl p-12 text-center text-on-surface-variant">
            لا يوجد مساهمون مطابقون للبحث حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((person) => (
              <article key={person.id} className="bg-surface-bright border border-primary/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0">
                    <GraduationCap size={27} />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block text-caption font-bold text-secondary bg-secondary/10 rounded-full px-2.5 py-1 mb-2">
                      {person.role === "admin" ? "إدارة المنصة" : "أستاذ معتمد"}
                    </span>
                    <h2 className="font-headline text-headline-md text-primary font-semibold truncate">
                      {person.full_name || "مساهم معتمد"}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-body-md text-on-surface font-semibold">
                  {person.title || "مساهم في إثراء المحتوى التعليمي"}
                </p>
                {person.branch && (
                  <p className="mt-3 flex items-center gap-2 text-caption text-on-surface-variant">
                    <MapPin size={15} /> {branchLabels[person.branch] || person.branch}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
