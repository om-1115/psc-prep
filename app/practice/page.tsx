import { PracticeClient } from "@/components/PracticeClient";
import type { DbSubject, DbTopic, DbExam } from "@/lib/types";
import type { DbQuestionWithRelations } from "@/app/exams/[slug]/papers/[paperId]/page";

export interface DbSubjectWithTopics extends DbSubject {
  topics: DbTopic[];
}

const FALLBACK_SUBJECTS: DbSubjectWithTopics[] = [];
const FALLBACK_EXAMS: DbExam[] = [
  { id: "fallback-1", name: "UPSC Prelims",  slug: "upsc-prelims",  created_at: "" },
  { id: "fallback-2", name: "CGPSC Prelims", slug: "cgpsc-prelims", created_at: "" },
];

async function fetchPracticeData(): Promise<{
  subjects: DbSubjectWithTopics[];
  exams: DbExam[];
  questions: DbQuestionWithRelations[];
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) {
    return { subjects: FALLBACK_SUBJECTS, exams: FALLBACK_EXAMS, questions: [] };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const [{ data: subjects }, { data: exams }, { data: questions }] = await Promise.all([
      supabase.from("subjects").select("*, topics(*)").order("name"),
      supabase.from("exams").select("*").order("name"),
      supabase
        .from("questions")
        .select("*, options!question_id(*), topics(*, subjects(*))")
        .eq("status", "approved"),
    ]);

    return {
      subjects: (subjects ?? []) as DbSubjectWithTopics[],
      exams: exams ?? FALLBACK_EXAMS,
      questions: (questions ?? []) as DbQuestionWithRelations[],
    };
  } catch {
    return { subjects: FALLBACK_SUBJECTS, exams: FALLBACK_EXAMS, questions: [] };
  }
}

export default async function PracticePage() {
  const { subjects, exams, questions } = await fetchPracticeData();

  return (
    <PracticeClient
      subjects={subjects}
      exams={exams}
      initialQuestions={questions}
    />
  );
}
