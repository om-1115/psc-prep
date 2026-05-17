"use client";

import { useState, useMemo } from "react";
import { DbQuestionCard } from "@/components/PaperDetailClient";

export interface LibraryQuestion {
  id: string;
  question_text: string;
  difficulty: "easy" | "medium" | "hard";
  correct_option_id: string | null;
  explanation: string | null;
  topic_id: string;
  options: { id: string; option_key: string; option_text: string }[];
  topics: {
    id: string;
    name: string;
    subjects: { id: string; name: string; color: string };
  } | null;
  papers: { year: number; exams: { name: string } | null } | null;
}

function LibraryQuestionRow({
  question,
  onOpen,
}: {
  question: LibraryQuestion;
  onOpen: () => void;
}) {
  const year = question.papers?.year;
  const examName = question.papers?.exams?.name ?? "";
  const subjectName = question.topics?.subjects?.name ?? "";
  const topicName = question.topics?.name ?? "";
  const subjectColor = question.topics?.subjects?.color ?? "#999";

  return (
    <button
      onClick={onOpen}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "14px 16px",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--ink)",
        transition: "border-color .12s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--muted-2)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {year && (
          <span className="pq-chip year">
            &apos;{String(year).slice(-2)}
          </span>
        )}
        {examName && <span className="pq-chip exam">{examName}</span>}
        {subjectName && (
          <span className="pq-chip" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
            <span className="tdot" style={{ background: subjectColor, width: 7, height: 7 }} />
            {subjectName}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <span
          className="pq-chip"
          style={{
            background: "transparent",
            padding: "0 4px",
            color:
              question.difficulty === "easy"
                ? "var(--good)"
                : question.difficulty === "hard"
                ? "var(--bad)"
                : "var(--accent-fg)",
          }}
        >
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </div>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: "var(--ink)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        {question.question_text.split("\n")[0]}
      </div>

      {topicName && (
        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{topicName}</div>
      )}
    </button>
  );
}

export function LibraryView({ questions: allQuestions }: { questions: LibraryQuestion[] }) {
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [openQId, setOpenQId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const subjects = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string; count: number }>();
    for (const q of allQuestions) {
      const s = q.topics?.subjects;
      if (!s) continue;
      const entry = map.get(s.id) ?? { id: s.id, name: s.name, color: s.color, count: 0 };
      entry.count++;
      map.set(s.id, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [allQuestions]);

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const q of allQuestions) {
      if (q.papers?.year) set.add(q.papers.year);
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [allQuestions]);

  const filtered = useMemo(() => {
    return allQuestions.filter((q) => {
      if (activeSubjectId && q.topics?.subjects?.id !== activeSubjectId) return false;
      if (activeYear && q.papers?.year !== activeYear) return false;
      return true;
    });
  }, [allQuestions, activeSubjectId, activeYear]);

  const activeSubjectName = subjects.find((s) => s.id === activeSubjectId)?.name;
  const openQuestion = openQId ? allQuestions.find((q) => q.id === openQId) : null;

  const handleSubjectChange = (id: string | null) => {
    setActiveSubjectId(id);
    setVisibleCount(20);
    setOpenQId(null);
  };

  const handleYearChange = (y: number) => {
    setActiveYear(activeYear === y ? null : y);
    setVisibleCount(20);
    setOpenQId(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
      {/* Sidebar */}
      <aside
        className="scroll-y"
        style={{
          width: 264,
          borderRight: "1px solid var(--line)",
          background: "var(--paper)",
          padding: "20px 16px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.08,
            textTransform: "uppercase",
            color: "var(--muted)",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Topics
        </div>

        <button
          onClick={() => handleSubjectChange(null)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: activeSubjectId === null ? 600 : 400,
            background: activeSubjectId === null ? "var(--bg-2)" : "transparent",
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            color: "var(--ink)",
          }}
        >
          <span style={{ flex: 1 }}>All topics</span>
          <span className="num" style={{ fontSize: 11.5, color: "var(--muted)" }}>
            {allQuestions.length.toLocaleString()}
          </span>
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 4 }}>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSubjectChange(s.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: activeSubjectId === s.id ? 600 : 400,
                background: activeSubjectId === s.id ? "var(--bg-2)" : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "var(--ink)",
              }}
            >
              <span className="tdot" style={{ background: s.color }} />
              <span style={{ flex: 1 }}>{s.name}</span>
              <span className="num" style={{ fontSize: 11.5, color: "var(--muted)" }}>
                {s.count}
              </span>
            </button>
          ))}
        </div>

        {/* Year filter */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.08,
            textTransform: "uppercase",
            color: "var(--muted)",
            padding: "0 8px",
            margin: "24px 0 8px",
          }}
        >
          Year
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "0 6px" }}>
          {years.slice(0, 30).map((y) => (
            <button
              key={y}
              onClick={() => handleYearChange(y)}
              className="pq-chip year"
              style={{
                background: activeYear === y ? "var(--ink)" : "var(--bg)",
                color: activeYear === y ? "var(--paper)" : "var(--ink-2)",
                border: "1px solid " + (activeYear === y ? "var(--ink)" : "var(--line)"),
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </aside>

      {/* Main feed */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Feed header */}
        <div
          style={{
            padding: "24px 32px 12px",
            borderBottom: "1px solid var(--line-2)",
            background: "var(--paper)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 14 }}>
            <div>
              <h2
                style={{ fontSize: 24, fontWeight: 600, margin: 0, letterSpacing: -0.4 }}
              >
                {activeSubjectId ? activeSubjectName : "All questions"}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0" }}>
                <span className="num">{filtered.length.toLocaleString()}</span>{" "}
                <span className="serif">questions</span>
                {activeYear && <> · filtered to <b>{activeYear}</b></>}
              </p>
            </div>
            <span style={{ flex: 1 }} />
            <button className="pq-btn primary">Practice mode</button>
          </div>

          {/* Active filter chips */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", minHeight: 22 }}>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Active:</span>
            {activeSubjectId && (
              <span
                className="pq-chip"
                style={{ background: "var(--ink)", color: "var(--paper)" }}
              >
                {activeSubjectName}
                <span
                  onClick={() => handleSubjectChange(null)}
                  style={{ cursor: "pointer", opacity: 0.7, marginLeft: 4 }}
                >
                  ×
                </span>
              </span>
            )}
            {activeYear && (
              <span
                className="pq-chip year"
                style={{ background: "var(--ink)", color: "var(--paper)" }}
              >
                {activeYear}{" "}
                <span
                  onClick={() => setActiveYear(null)}
                  style={{ cursor: "pointer", marginLeft: 2 }}
                >
                  ×
                </span>
              </span>
            )}
            {!activeSubjectId && !activeYear && (
              <span style={{ fontSize: 11.5, color: "var(--muted-2)", fontStyle: "italic" }}>
                nothing — showing everything
              </span>
            )}
          </div>
        </div>

        {/* Question list or open question */}
        <div
          className="scroll-y"
          style={{ flex: 1, padding: "20px 32px 32px", background: "var(--bg)" }}
        >
          {openQuestion ? (
            <div style={{ maxWidth: 760 }}>
              <button
                onClick={() => setOpenQId(null)}
                className="pq-btn ghost"
                style={{ height: 32, padding: "0 8px", color: "var(--muted)", marginBottom: 16 }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  style={{ marginRight: 4 }}
                >
                  <path d="M8 2L4 6l4 4" />
                </svg>
                Back to list
              </button>
              <DbQuestionCard question={openQuestion as any} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 760 }}>
              {filtered.length === 0 ? (
                <p style={{ fontSize: 14, color: "var(--muted)", padding: "48px 0", textAlign: "center" }}>
                  No questions match these filters.
                </p>
              ) : (
                <>
                  {filtered.slice(0, visibleCount).map((q) => (
                    <LibraryQuestionRow
                      key={q.id}
                      question={q}
                      onOpen={() => setOpenQId(q.id)}
                    />
                  ))}
                  {visibleCount < filtered.length && (
                    <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
                      <button
                        className="pq-btn"
                        onClick={() => setVisibleCount((n) => n + 50)}
                      >
                        Load more ({filtered.length - visibleCount} remaining) →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
