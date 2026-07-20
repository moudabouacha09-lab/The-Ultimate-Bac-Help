import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import bacContent from "@/data/bac-content";
import { subjects } from "@/lib/subjects";
import SubjectView from "./subject-view";

type SubjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { id } = await params;
  const subject = subjects.find((item) => item.slug === id);
  const content = bacContent[id];

  if (!subject || !content) notFound();

  return (
    <AppShell activeSubject={subject.slug}>
      <SubjectView subject={subject} content={content} />
    </AppShell>
  );
}

export function generateStaticParams() {
  return subjects.map((subject) => ({ id: subject.slug }));
}
