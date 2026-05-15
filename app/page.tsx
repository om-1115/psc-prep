import { PrepyqApp } from "@/components/PrepyqApp";
import type { DbExam } from "@/lib/types";

const FALLBACK_EXAMS: DbExam[] = [
  { id: "fallback-1", name: "UPSC Prelims",  slug: "upsc-prelims",  created_at: "" },
  { id: "fallback-2", name: "CGPSC Prelims", slug: "cgpsc-prelims", created_at: "" },
];

async function fetchExams(): Promise<DbExam[]> {
  // Guard: if env vars aren't filled in yet, skip the DB call entirely
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) return FALLBACK_EXAMS;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.from("exams").select("*").order("name");
    if (error || !data?.length) return FALLBACK_EXAMS;
    return data;
  } catch {
    return FALLBACK_EXAMS;
  }
}

export default async function Home() {
  const exams = await fetchExams();
  return <PrepyqApp exams={exams} />;
}
