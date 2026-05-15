"use client";

import { useState } from "react";
import { PQ_QUESTIONS } from "@/lib/data";
import { QuestionCard } from "./shared";

export function PracticeView() {
  const [idx, setIdx] = useState(0);
  const q = PQ_QUESTIONS[idx];

  return (
    <div className="scroll-y" style={{ flex: 1, background: "var(--bg)", padding: "32px 0" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
        {/* Session header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <button className="pq-btn ghost" style={{ height: 32, padding: "0 8px", color: "var(--muted)" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M8 2L4 6l4 4" />
            </svg>
            Exit session
          </button>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
            <span className="serif" style={{ color: "var(--accent-fg)" }}>
              {PQ_QUESTIONS.find((_, i) => i === idx)?.topic === "polity" ? "Polity & Governance" : "Mixed topics"}
            </span>{" "}
            · Mixed years
          </div>
          <span style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
            <span style={{ color: "var(--muted)" }}>Question</span>
            <span className="num" style={{ fontWeight: 600 }}>{idx + 1}</span>
            <span style={{ color: "var(--muted-2)" }}>/</span>
            <span className="num" style={{ color: "var(--muted)" }}>{PQ_QUESTIONS.length}</span>
          </div>
          {/* Progress bar */}
          <div style={{ width: 140, height: 4, background: "var(--line-2)", borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{ width: `${((idx + 1) / PQ_QUESTIONS.length) * 100}%`, height: "100%", background: "var(--ink)", transition: "width .3s" }}
            />
          </div>
        </div>

        <QuestionCard question={q} />

        {/* Footer nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
          <button
            className="pq-btn"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            style={{ opacity: idx === 0 ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          <button className="pq-btn ghost">Skip</button>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            Press{" "}
            <kbd style={{ fontSize: 10.5, padding: "2px 5px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 4, fontFamily: "var(--font-mono)" }}>
              1–4
            </kbd>{" "}
            to answer
          </span>
          <button
            className="pq-btn primary"
            onClick={() => setIdx((i) => Math.min(PQ_QUESTIONS.length - 1, i + 1))}
          >
            Next question →
          </button>
        </div>
      </div>
    </div>
  );
}
