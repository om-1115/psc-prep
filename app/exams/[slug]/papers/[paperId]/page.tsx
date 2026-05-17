import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { PaperDetailClient } from "@/components/PaperDetailClient";

interface PageProps {
  params: Promise<{ slug: string; paperId: string }>;
}

export interface DbQuestionWithRelations {
  id: string;
  question_text: string;
  paper_id: string | null;
  topic_id: string;
  correct_option_id: string | null;
  explanation: string | null;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  options: {
    id: string;
    question_id: string;
    option_key: string;
    option_text: string;
  }[];
  topics: {
    id: string;
    subject_id: string;
    name: string;
    slug: string;
    created_at: string;
    subjects: {
      id: string;
      name: string;
      slug: string;
      color: string;
      created_at: string;
    };
  } | null;
}

export interface SubjectGroup {
  subject: { id: string; name: string; color: string };
  questions: DbQuestionWithRelations[];
}

async function fetchPaperData(paperId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) return null;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: paper, error: paperError } = await supabase
      .from("papers")
      .select("*, exams(*)")
      .eq("id", paperId)
      .single();

    if (paperError || !paper) return null;

    const { data: questions } = await supabase
      .from("questions")
      .select("*, options!question_id(*), topics(*, subjects(*))")
      .eq("paper_id", paperId)
      .eq("status", "approved");

    return { paper, questions: (questions ?? []) as DbQuestionWithRelations[] };
  } catch {
    return null;
  }
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { slug, paperId } = await params;
  const result = await fetchPaperData(paperId);

  if (!result) notFound();

  const { paper, questions } = result;
  const exam = paper.exams as { id: string; name: string; slug: string; created_at: string };

  // Group questions by subject
  const subjectMap = new Map<string, SubjectGroup>();
  for (const q of questions) {
    const subject = q.topics?.subjects;
    if (!subject) continue;
    if (!subjectMap.has(subject.id)) {
      subjectMap.set(subject.id, { subject, questions: [] });
    }
    subjectMap.get(subject.id)!.questions.push(q);
  }
  const groups: SubjectGroup[] = Array.from(subjectMap.values());

  const totalInGroups = groups.reduce((s, g) => s + g.questions.length, 0);

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

      {/* Paper header */}
      <div
        style={{
          background: "var(--paper)",
          borderBottom: "1px solid var(--line)",
          padding: "32px 64px 24px",
          flexShrink: 0,
        }}
      >
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
          <Link href="/exams" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Exam Papers
          </Link>
          <span>›</span>
          <Link href={"/exams/" + slug} style={{ color: "var(--muted)", textDecoration: "none" }}>
            {exam.name}
          </Link>
          <span>›</span>
          <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>
            {paper.year} · {paper.paper_code ?? "Paper I"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: 12 }}>
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: -0.6,
                margin: 0,
              }}
            >
              {paper.title}
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "6px 0 0" }}>
              {paper.paper_code && <>{paper.paper_code} · </>}
              {paper.total_questions != null && <>{paper.total_questions} questions</>}
              {paper.total_marks != null && <>, {paper.total_marks} marks</>}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button className="pq-btn">Export CSV</button>
            <button className="pq-btn primary">Practice this paper</button>
          </div>
        </div>

        {/* Distribution bar */}
        {groups.length > 0 && totalInGroups > 0 && (
          <>
            <div
              style={{
                marginTop: 28,
                height: 14,
                borderRadius: 4,
                display: "flex",
                overflow: "hidden",
              }}
            >
              {groups.map((g) => (
                <div
                  key={g.subject.id}
                  style={{
                    width: (g.questions.length / totalInGroups) * 100 + "%",
                    background: g.subject.color,
                    transition: "width .3s",
                  }}
                  title={g.subject.name + ": " + g.questions.length}
                />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              {groups.map((g) => (
                <div
                  key={g.subject.id}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
                >
                  <span
                    className="tdot"
                    style={{ background: g.subject.color }}
                  />
                  <span style={{ color: "var(--ink-2)" }}>{g.subject.name}</span>
                  <span className="num" style={{ color: "var(--muted)" }}>{g.questions.length}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Accordion */}
      <div
        className="scroll-y"
        style={{ flex: 1, padding: "24px 64px 48px", background: "var(--bg)" }}
      >
        <PaperDetailClient groups={groups} />
      </div>
    </div>
  );
}
