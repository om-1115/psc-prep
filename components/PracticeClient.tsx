"use client";

import { useState, useEffect, useCallback } from "react";
import { TopNav } from "@/components/TopNav";
import { DbQuestionCard } from "@/components/PaperDetailClient";
import type { DbExam } from "@/lib/types";
import type { DbSubjectWithTopics } from "@/app/practice/page";
import type { DbQuestionWithRelations } from "@/app/exams/[slug]/papers/[paperId]/page";

interface PracticeClientProps {
  subjects: DbSubjectWithTopics[];
  exams: DbExam[];
  initialQuestions: DbQuestionWithRelations[];
}

export function PracticeClient({ subjects, exams: _exams, initialQuestions }: PracticeClientProps) {
  const [filterSubjectId, setFilterSubjectId] = useState<string | null>(null);
  const [filterTopicId, setFilterTopicId] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const activeSubject = subjects.find((s) => s.id === filterSubjectId) ?? null;

  const filteredQuestions = initialQuestions.filter((q) => {
    if (filterSubjectId && q.topics?.subjects?.id !== filterSubjectId) return false;
    if (filterTopicId && q.topic_id !== filterTopicId) return false;
    return true;
  });

  // Reset idx when filters change
  useEffect(() => {
    setIdx(0);
  }, [filterSubjectId, filterTopicId]);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterSubjectId(e.target.value || null);
    setFilterTopicId(null);
  }, []);

  const handleTopicChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterTopicId(e.target.value || null);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterSubjectId(null);
    setFilterTopicId(null);
  }, []);

  const anyFilter = filterSubjectId !== null || filterTopicId !== null;
  const total = filteredQuestions.length;
  const currentQ = filteredQuestions[idx] ?? null;

  const selectStyle: React.CSSProperties = {
    height: 32,
    borderRadius: 8,
    border: "1px solid var(--line)",
    background: "var(--surface)",
    color: "var(--ink)",
    fontSize: 13,
    padding: "0 10px",
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
  };

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

      {/* Filter bar */}
      <div
        style={{
          background: "var(--paper)",
          borderBottom: "1px solid var(--line)",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.06,
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Filters:
        </span>

        <select value={filterSubjectId ?? ""} onChange={handleSubjectChange} style={selectStyle}>
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {activeSubject && activeSubject.topics.length > 0 && (
          <select value={filterTopicId ?? ""} onChange={handleTopicChange} style={selectStyle}>
            <option value="">All topics</option>
            {activeSubject.topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        {anyFilter && (
          <button
            className="pq-btn ghost"
            onClick={clearFilters}
            style={{ height: 28, fontSize: 12, color: "var(--muted)" }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Practice area */}
      <div
        className="scroll-y"
        style={{ flex: 1, background: "var(--bg)", padding: "32px 0" }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
          {total === 0 ? (
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                textAlign: "center",
                padding: "48px 0",
              }}
            >
              No approved questions match these filters yet.
            </p>
          ) : (
            <>
              {/* Session header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                <button
                  className="pq-btn ghost"
                  style={{ height: 32, padding: "0 8px", color: "var(--muted)", fontSize: 13 }}
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
                  Exit session
                </button>

                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  {activeSubject
                    ? activeSubject.name
                    : "All subjects · Mixed"}
                </span>

                <span style={{ flex: 1 }} />

                <span className="num" style={{ fontSize: 12, color: "var(--muted)" }}>
                  Question {idx + 1} / {total}
                </span>

                {/* Progress bar */}
                <div
                  style={{
                    width: 140,
                    height: 4,
                    background: "var(--line-2)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: ((idx + 1) / total) * 100 + "%",
                      height: "100%",
                      background: "var(--ink)",
                      borderRadius: 4,
                      transition: "width .3s",
                    }}
                  />
                </div>
              </div>

              {/* Question card */}
              {currentQ && <DbQuestionCard question={currentQ} />}

              {/* Footer nav */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 24,
                }}
              >
                <button
                  className="pq-btn"
                  disabled={idx === 0}
                  onClick={() => setIdx((i) => Math.max(0, i - 1))}
                  style={{ opacity: idx === 0 ? 0.4 : 1 }}
                >
                  ← Previous
                </button>

                <button
                  className="pq-btn ghost"
                  onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
                >
                  Skip
                </button>

                <span style={{ flex: 1 }} />

                <span
                  className="kbd-hint"
                  style={{ fontSize: 12, color: "var(--muted)" }}
                >
                  Press 1–4 to answer
                </span>

                <button
                  className="pq-btn primary"
                  disabled={idx === total - 1}
                  onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
                  style={{ opacity: idx === total - 1 ? 0.4 : 1 }}
                >
                  Next question →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
