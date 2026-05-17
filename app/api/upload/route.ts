import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { DocumentBlockParam } from "@anthropic-ai/sdk/resources/messages/messages.js";
import { createAdminClient } from "@/lib/supabase/admin";

const TOPICS = [
  "Constitutional Framework",
  "Parliament & Legislature",
  "Executive & Judiciary",
  "Elections & Political Parties",
  "Ancient & Medieval India",
  "Modern India & Freedom Movement",
  "Physical Geography",
  "Human & Economic Geography",
  "Indian Economy & Growth",
  "Fiscal Policy & Banking",
  "Ecology & Climate",
  "Environment & Conservation",
  "Science & Technology",
  "National & International Affairs",
];

interface ExtractedQuestion {
  question_text: string;
  options: { key: string; text: string }[];
  correct_key: string | null;
  topic: string;
  difficulty: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-key-here") {
    return NextResponse.json(
      { error: "Add your ANTHROPIC_API_KEY to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "File must be a PDF." }, { status: 400 });
  }

  // Convert PDF to base64 so Claude can read it directly
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const anthropic = new Anthropic({ apiKey });
  let rawResponse: string;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: base64 },
            } satisfies DocumentBlockParam,
            {
              type: "text",
              text: `You are extracting MCQ questions from an Indian civil services exam paper or question bank.

Extract ALL multiple choice questions. For each question, return a JSON object:
{
  "question_text": "full question text here",
  "options": [
    {"key": "A", "text": "option text"},
    {"key": "B", "text": "option text"},
    {"key": "C", "text": "option text"},
    {"key": "D", "text": "option text"}
  ],
  "correct_key": "A" or "B" or "C" or "D" — only if the answer key appears in the document, otherwise null,
  "topic": pick the single best match from this exact list: ${TOPICS.join(", ")},
  "difficulty": "easy" or "medium" or "hard" based on your judgment
}

Return ONLY a valid JSON array of these objects. No markdown, no explanation, no extra text before or after.`,
            },
          ],
        },
      ],
    });
    rawResponse = message.content[0].type === "text" ? message.content[0].text : "[]";
  } catch (err) {
    return NextResponse.json(
      { error: "AI extraction failed: " + String(err) },
      { status: 500 }
    );
  }

  // Parse Claude's response
  let questions: ExtractedQuestion[];
  try {
    const clean = rawResponse
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    questions = JSON.parse(clean);
    if (!Array.isArray(questions)) throw new Error("Not an array");
  } catch {
    return NextResponse.json(
      { error: "Could not parse AI response. Try again.", preview: rawResponse.slice(0, 400) },
      { status: 500 }
    );
  }

  if (questions.length === 0) {
    return NextResponse.json(
      { error: "No MCQ questions found in this PDF. Make sure it contains questions with A/B/C/D options." },
      { status: 400 }
    );
  }

  // Save to Supabase using admin (service role) client to bypass RLS
  const supabase = createAdminClient();

  const { data: topicRows } = await supabase.from("topics").select("id, name");
  if (!topicRows?.length) {
    return NextResponse.json(
      { error: "No topics found in database. Run seed.sql first." },
      { status: 500 }
    );
  }

  // Save each question directly under the matching topic — no exam or paper required
  let saved = 0;
  for (const q of questions) {
    const matchedTopic =
      topicRows.find((t) => t.name.toLowerCase() === q.topic.toLowerCase()) ??
      topicRows.find((t) =>
        q.topic.toLowerCase().includes(t.name.toLowerCase().split(" ")[0].toLowerCase())
      ) ??
      topicRows[0];

    const { data: qRow } = await supabase
      .from("questions")
      .insert({
        question_text: q.question_text,
        paper_id: null,
        topic_id: matchedTopic.id,
        difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "medium",
        status: "pending",
      })
      .select()
      .single();

    if (!qRow) continue;

    const validOptions = q.options.filter((o) => o.key && o.text);
    const { data: insertedOptions } = await supabase
      .from("options")
      .insert(
        validOptions.map((o) => ({
          question_id: qRow.id,
          option_key: o.key,
          option_text: o.text,
        }))
      )
      .select();

    if (q.correct_key && insertedOptions) {
      const correct = insertedOptions.find((o) => o.option_key === q.correct_key);
      if (correct) {
        await supabase
          .from("questions")
          .update({ correct_option_id: correct.id })
          .eq("id", qRow.id);
      }
    }

    saved++;
  }

  return NextResponse.json({ saved, total: questions.length });
}
