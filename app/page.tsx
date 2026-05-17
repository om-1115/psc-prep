import { PrepyqApp } from "@/components/PrepyqApp";
import type { LibraryQuestion } from "@/components/LibraryView";

async function fetchHomeData(): Promise<LibraryQuestion[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) return [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("id, question_text, difficulty, correct_option_id, explanation, topic_id, options!question_id(id, option_key, option_text), topics(id, name, subjects(id, name, color)), papers(year, exams(name))")
      .eq("status", "approved");
    if (error) console.error("fetchHomeData error:", error.message);
    return (data ?? []) as unknown as LibraryQuestion[];
  } catch (e) {
    console.error("fetchHomeData exception:", e);
    return [];
  }
}

export default async function Home() {
  const questions = await fetchHomeData();
  return <PrepyqApp questions={questions} />;
}
