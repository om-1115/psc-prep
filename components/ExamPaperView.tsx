"use client";

import { useState } from "react";
import { PQ_TOPICS, PQ_QUESTIONS, PQ_EXAM_PAPER } from "@/lib/data";
import { QuestionRow } from "./shared";

export function ExamPaperView() {
  const [expanded, setExpanded] = useState<string | null>("cg");

  const examQs = (topicId: string) =>
    PQ_QUESTIONS.filter((q) => q.topic === topicId).slice(0, 2);

  return (
    <div className="scroll-y" style={{ flex: 1, background: "var(--bg)" }}>
      {/* Paper header */}
      <div style={{ padding: "32px 64px 24px", background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Exam Papers</span>
            <span style={{ color: "var(--muted-2)" }}>›</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>CGPSC</span>
            <span style={{ color: "var(--muted-2)" }}>›</span>
            <span style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 500 }}>2023 Pre · Paper I</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: -0.6 }}>
                {PQ_EXAM_PAPER.title}
              </h1>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: "6px 0 0" }}>
                {PQ_EXAM_PAPER.paperCode} · <span className="num">{PQ_EXAM_PAPER.totalQ}</span> questions,{" "}
                <span className="num">{PQ_EXAM_PAPER.totalMarks}</span> marks · auto-categorized{" "}
                <span className="serif">{PQ_EXAM_PAPER.detected}</span>
              </p>
            </div>
            <button className="pq-btn">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6.5 1v8M3 6l3.5 3.5L10 6M2 11h9" />
              </svg>
              Export CSV
            </button>
            <button className="pq-btn primary">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 6.5l3 3 5-6" />
              </svg>
              Practice this paper
            </button>
          </div>

          {/* Distribution bar */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", height: 14, borderRadius: 4, overflow: "hidden", background: "var(--line-2)" }}>
              {PQ_EXAM_PAPER.breakdown.map((b) => {
                const t = PQ_TOPICS.find((x) => x.id === b.topic)!;
                return (
                  <div
                    key={b.topic}
                    style={{ width: `${b.count}%`, background: t.color }}
                    title={`${t.short}: ${b.count}`}
                  />
                );
              })}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
              {PQ_EXAM_PAPER.breakdown.map((b) => {
                const t = PQ_TOPICS.find((x) => x.id === b.topic)!;
                return (
                  <div key={b.topic} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <span className="tdot" style={{ background: t.color }} />
                    <span style={{ fontWeight: 500 }}>{t.short}</span>
                    <span className="num" style={{ color: "var(--muted)" }}>{b.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Categorized sections */}
      <div style={{ padding: "24px 64px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {PQ_EXAM_PAPER.breakdown.map((b) => {
            const t = PQ_TOPICS.find((x) => x.id === b.topic)!;
            const isOpen = expanded === b.topic;
            return (
              <section
                key={b.topic}
                style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : b.topic)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 20px", textAlign: "left",
                    borderBottom: isOpen ? "1px solid var(--line-2)" : "none",
                    background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                  } as React.CSSProperties}
                >
                  <span className="tdot" style={{ background: t.color, width: 12, height: 12, borderRadius: 3 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: -0.2 }}>{t.name}</h3>
                  <span className="num" style={{ fontSize: 12.5, color: "var(--muted)", marginLeft: 4 }}>
                    <b style={{ color: "var(--ink)" }}>{b.count}</b> / 100 questions
                  </span>
                  <span style={{ flex: 1 }} />
                  <span className="num" style={{ fontSize: 11.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {b.count}.0%
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"
                    style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform .15s", color: "var(--muted)" }}
                  >
                    <path d="M4 2l4 4-4 4" />
                  </svg>
                </button>

                {isOpen && (
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, background: "var(--bg)" }}>
                    {examQs(b.topic).map((q) => (
                      <QuestionRow key={q.id} question={q} onOpen={() => {}} />
                    ))}
                    <button className="pq-btn ghost" style={{ alignSelf: "flex-start", fontSize: 12, height: 28, color: "var(--muted)" }}>
                      Show all {b.count} questions →
                    </button>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
