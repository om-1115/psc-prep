"use client";

import { useState } from "react";
import type { SubjectGroup, DbQuestionWithRelations } from "@/app/exams/[slug]/papers/[paperId]/page";

// ─── Inline DB question card ────────────────────────────────────────────────

function DbQuestionCard({
  question,
  dense = false,
}: {
  question: DbQuestionWithRelations;
  dense?: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const isAnswered = picked !== null;

  const opts = [...question.options].sort((a, b) =>
    a.option_key.localeCompare(b.option_key)
  );

  return (
    <article
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: dense ? 12 : 16,
        padding: dense ? "18px 20px" : "24px 28px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: dense ? 12 : 16,
          flexWrap: "wrap",
        }}
      >
        {question.topics?.subjects && (
          <span className="pq-chip" style={{ background: "var(--bg-2)", color: "var(--ink-2)" }}>
            <span
              className="tdot"
              style={{ background: question.topics.subjects.color, width: 7, height: 7 }}
            />
            {question.topics.subjects.name}
          </span>
        )}
        {question.topics && (
          <span className="pq-chip" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
            {question.topics.name}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <span
          className="pq-chip"
          style={{
            color:
              question.difficulty === "easy"
                ? "var(--good)"
                : question.difficulty === "hard"
                ? "var(--bad)"
                : "var(--accent-fg)",
            background: "transparent",
            padding: "0 4px",
          }}
        >
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
      </header>

      {/* Question text */}
      <div
        style={{
          fontSize: dense ? 14.5 : 16,
          lineHeight: 1.55,
          color: "var(--ink)",
          whiteSpace: "pre-line",
          marginBottom: dense ? 14 : 18,
          fontWeight: 400,
        }}
      >
        {question.question_text}
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {opts.map((opt) => {
          const isCorrect = opt.id === question.correct_option_id;
          const isWrong = picked === opt.id && !isCorrect;
          let cls = "pq-opt";
          if (isAnswered) {
            cls += " locked";
            if (isCorrect) cls += " correct";
            else if (isWrong) cls += " wrong";
            else cls += " dim";
          }
          return (
            <button
              key={opt.id}
              className={cls}
              onClick={() => {
                if (isAnswered) { setPicked(null); return; }
                setPicked(opt.id);
              }}
            >
              <span className="opt-key">{opt.option_key.toUpperCase()}</span>
              <span
                style={{
                  flex: 1,
                  fontSize: dense ? 13.5 : 14.5,
                  lineHeight: 1.5,
                  paddingTop: 4,
                  textAlign: "left",
                }}
              >
                {opt.option_text}
              </span>
              {isAnswered && isCorrect && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  style={{
                    background: "var(--good)",
                    borderRadius: 9,
                    padding: 3,
                    flexShrink: 0,
                    alignSelf: "center",
                  }}
                >
                  <path d="M4 9.5L7.5 13L14 6" />
                </svg>
              )}
              {isAnswered && isWrong && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  style={{
                    background: "var(--bad)",
                    borderRadius: 9,
                    padding: 4,
                    flexShrink: 0,
                    alignSelf: "center",
                  }}
                >
                  <path d="M5 5L13 13M13 5L5 13" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && question.explanation && (
        <div
          style={{
            marginTop: 14,
            padding: "14px 16px",
            background: "var(--accent-soft)",
            borderRadius: 10,
            fontSize: dense ? 13 : 13.5,
            lineHeight: 1.55,
            color: "var(--ink-2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.04,
              textTransform: "uppercase",
              color: "var(--accent-fg)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
              <circle cx="5.5" cy="5.5" r="5" />
              <rect x="5" y="3" width="1" height="1" fill="white" />
              <rect x="5" y="5" width="1" height="3.5" fill="white" />
            </svg>
            Explanation
          </div>
          {question.explanation}
        </div>
      )}
    </article>
  );
}

export { DbQuestionCard };

// ─── Accordion ──────────────────────────────────────────────────────────────

export function PaperDetailClient({ groups }: { groups: SubjectGroup[] }) {
  const [expanded, setExpanded] = useState<string | null>(
    groups[0]?.subject.id ?? null
  );
  const [showAll, setShowAll] = useState<Set<string>>(new Set());

  if (groups.length === 0) {
    return (
      <p style={{ fontSize: 14, color: "var(--muted)", padding: "24px 0" }}>
        No approved questions found for this paper.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {groups.map((group) => {
        const isOpen = expanded === group.subject.id;
        const shouldShowAll = showAll.has(group.subject.id);
        const visibleQuestions = shouldShowAll
          ? group.questions
          : group.questions.slice(0, 2);

        return (
          <div
            key={group.subject.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            {/* Header */}
            <button
              onClick={() =>
                setExpanded(isOpen ? null : group.subject.id)
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 20px",
                textAlign: "left",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span
                className="tdot"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: group.subject.color,
                }}
              />
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: -0.2,
                  color: "var(--ink)",
                }}
              >
                {group.subject.name}
              </h3>
              <span
                className="num"
                style={{ fontSize: 12.5, color: "var(--muted)" }}
              >
                {group.questions.length} questions
              </span>
              <span style={{ flex: 1 }} />
              {/* Chevron */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform .15s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
            </button>

            {/* Questions */}
            {isOpen && (
              <div
                style={{
                  background: "var(--bg)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {visibleQuestions.map((q) => (
                  <DbQuestionCard key={q.id} question={q} dense />
                ))}
                {!shouldShowAll && group.questions.length > 2 && (
                  <button
                    className="pq-btn ghost"
                    onClick={() =>
                      setShowAll((prev) => {
                        const next = new Set(prev);
                        next.add(group.subject.id);
                        return next;
                      })
                    }
                    style={{ alignSelf: "center", fontSize: 13, color: "var(--muted)" }}
                  >
                    Show all {group.questions.length} questions →
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
