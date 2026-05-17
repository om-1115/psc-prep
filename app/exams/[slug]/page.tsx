import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { PaperList } from "@/components/PaperList";
import type { DbExam, DbPaper } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchExamAndPapers(slug: string): Promise<{ exam: DbExam; papers: DbPaper[] } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) return null;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: exam, error: examError } = await supabase
      .from("exams")
      .select("*")
      .eq("slug", slug)
      .single();

    if (examError || !exam) return null;

    const { data: papers } = await supabase
      .from("papers")
      .select("*")
      .eq("exam_id", exam.id)
      .order("year", { ascending: false });

    return { exam, papers: papers ?? [] };
  } catch {
    return null;
  }
}

export default async function ExamSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await fetchExamAndPapers(slug);

  if (!result) notFound();

  const { exam, papers } = result;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--bg)",
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
        WebkitFontSmoothing: "antialiased",
      } as React.CSSProperties}
    >
      <TopNav />
      <div
        className="scroll-y"
        style={{ flex: 1, padding: "48px 64px", maxWidth: 920, width: "100%", margin: "0 auto", boxSizing: "border-box" } as React.CSSProperties}
      >
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
          <Link href="/exams" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Exam Papers
          </Link>
          <span>›</span>
          <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{exam.name}</span>
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            marginTop: 16,
            marginBottom: 4,
            letterSpacing: -0.5,
          }}
        >
          {exam.name}
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
          {papers.length} paper{papers.length !== 1 ? "s" : ""} · click any to view questions
        </p>

        <PaperList papers={papers} slug={slug} />
      </div>
    </div>
  );
}
