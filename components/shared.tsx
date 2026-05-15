"use client";

import { useState } from "react";
import { PQ_TOPICS, type Question } from "@/lib/data";

export function Logo({ size = 24, color = "#1c1a17" }: { size?: number; color?: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 6, color }}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
        <rect x="3" y="3" width="9" height="18" fill={color} />
        <rect x="3" y="3" width="18" height="6" fill={color} />
        <rect x="14" y="11" width="7" height="5" fill="oklch(0.72 0.13 70)" />
      </svg>
      <span style={{ fontWeight: 600, fontSize: size * 0.78, letterSpacing: -0.02, color }}>
        prepyq
      </span>
    </div>
  );
}

export function TopicDot({ topicId, size = 10 }: { topicId: string; size?: number }) {
  const t = PQ_TOPICS.find((x) => x.id === topicId);
  return (
    <span
      className="tdot"
      style={{ width: size, height: size, background: t?.color || "#999" }}
    />
  );
}

export function YearChip({ year }: { year: number }) {
  return (
    <span className="pq-chip year">
      &apos;{String(year).slice(-2)}
    </span>
  );
}

export function ExamChip({ exam }: { exam: string }) {
  return <span className="pq-chip exam">{exam}</span>;
}

export function TopicChip({ topicId }: { topicId: string }) {
  const t = PQ_TOPICS.find((x) => x.id === topicId);
  if (!t) return null;
  return (
    <span className="pq-chip" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
      <span className="tdot" style={{ background: t.color, width: 7, height: 7 }} />
      {t.short}
    </span>
  );
}

export function DiffChip({ diff }: { diff: string }) {
  const map: Record<string, [string, string]> = {
    Easy:   ["Easy",   "var(--good)"],
    Medium: ["Medium", "var(--accent-fg)"],
    Hard:   ["Hard",   "var(--bad)"],
  };
  const [label, color] = map[diff] ?? ["—", "var(--muted)"];
  return (
    <span className="pq-chip" style={{ background: "transparent", color, padding: "0 4px" }}>
      {label}
    </span>
  );
}

export function QuestionCard({
  question,
  dense = false,
}: {
  question: Question;
  dense?: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const isAnswered = picked !== null;

  const click = (i: number) => {
    if (isAnswered) { setPicked(null); return; }
    setPicked(i);
  };

  const stemLines = question.q.split("\n");

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
      {/* Header chips */}
      <header style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: dense ? 12 : 16, flexWrap: "wrap" }}>
        <ExamChip exam={question.exam} />
        <YearChip year={question.year} />
        <TopicChip topicId={question.topic} />
        <span style={{ fontSize: 11.5, color: "var(--muted)", marginLeft: 2 }}>· {question.sub}</span>
        <span style={{ flex: 1 }} />
        <DiffChip diff={question.diff} />
        <button
          onClick={() => setBookmarked((b) => !b)}
          title="Bookmark"
          style={{ padding: 4, color: bookmarked ? "var(--accent-fg)" : "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill={bookmarked ? "oklch(0.72 0.13 70)" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M3.5 1.5h8v12L7.5 10.5 3.5 13.5z" />
          </svg>
        </button>
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
        {stemLines.map((line, i) => (
          <div key={i} style={{ marginBottom: i < stemLines.length - 1 ? 4 : 0 }}>{line}</div>
        ))}
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options.map((opt, i) => {
          const isCorrect = i === question.answer;
          let cls = "pq-opt";
          if (isAnswered) {
            cls += " locked";
            if (isCorrect) cls += " correct";
            else if (i === picked) cls += " wrong";
            else cls += " dim";
          }
          return (
            <button key={i} className={cls} onClick={() => click(i)}>
              <span className="opt-key">{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1, fontSize: dense ? 13.5 : 14.5, lineHeight: 1.5, paddingTop: 4 }}>{opt}</span>
              {isAnswered && isCorrect && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"
                  style={{ background: "var(--good)", borderRadius: 9, padding: 3, flexShrink: 0, alignSelf: "center" }}>
                  <path d="M4 9.5L7.5 13L14 6" />
                </svg>
              )}
              {isAnswered && i === picked && !isCorrect && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"
                  style={{ background: "var(--bad)", borderRadius: 9, padding: 4, flexShrink: 0, alignSelf: "center" }}>
                  <path d="M5 5L13 13M13 5L5 13" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
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
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 11, fontWeight: 600, letterSpacing: 0.04, textTransform: "uppercase", color: "var(--accent-fg)" }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
              <circle cx="5.5" cy="5.5" r="5" />
              <rect x="5" y="3" width="1" height="1" fill="white" />
              <rect x="5" y="5" width="1" height="3.5" fill="white" />
            </svg>
            Explanation
          </div>
          {question.explain}
        </div>
      )}
    </article>
  );
}

export function QuestionRow({ question, onOpen }: { question: Question; onOpen: () => void }) {
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
        transition: "border-color .12s, background .12s",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--ink)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--muted-2)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <YearChip year={question.year} />
        <ExamChip exam={question.exam} />
        <TopicChip topicId={question.topic} />
        <span style={{ flex: 1 }} />
        <DiffChip diff={question.diff} />
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
        {question.q.split("\n")[0]}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 10 }}>
        <span>{question.sub}</span>
        <span>·</span>
        <span>asked {question.freq}×</span>
      </div>
    </button>
  );
}
