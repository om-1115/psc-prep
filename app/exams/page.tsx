import { TopNav } from "@/components/TopNav";
import { ExamCardGrid } from "@/components/ExamCardGrid";
import type { DbExam, DbPaper } from "@/lib/types";

export interface ExamWithPapers extends DbExam {
  papers: DbPaper[];
}

const FALLBACK: ExamWithPapers[] = [
  { id: "fallback-1", name: "UPSC Prelims",  slug: "upsc-prelims",  created_at: "", papers: [] },
  { id: "fallback-2", name: "CGPSC Prelims", slug: "cgpsc-prelims", created_at: "", papers: [] },
];

async function fetchExamsWithPapers(): Promise<ExamWithPapers[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) return FALLBACK;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: exams, error: examsError } = await supabase
      .from("exams")
      .select("*")
      .order("name");

    if (examsError || !exams?.length) return FALLBACK;

    const results: ExamWithPapers[] = await Promise.all(
      exams.map(async (exam: DbExam) => {
        const { data: papers } = await supabase
          .from("papers")
          .select("*")
          .eq("exam_id", exam.id)
          .order("year", { ascending: false });
        return { ...exam, papers: papers ?? [] };
      })
    );

    return results;
  } catch {
    return FALLBACK;
  }
}

export default async function ExamsPage() {
  const examsWithPapers = await fetchExamsWithPapers();

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
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)", padding: "48px 64px" }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: -0.7,
            margin: 0,
            color: "var(--ink)",
          }}
        >
          Exam Papers
          <span className="serif" style={{ color: "var(--accent-fg)" }}> to practise</span>
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--muted)",
            maxWidth: 520,
            margin: "12px 0 0",
            lineHeight: 1.5,
          }}
        >
          Choose an exam — click any year to open that paper.
        </p>

        <ExamCardGrid exams={examsWithPapers} />
      </div>
    </div>
  );
}
