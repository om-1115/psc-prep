"use client";

import { useState } from "react";
import { PQ_TOPICS, PQ_QUESTIONS } from "@/lib/data";
import { TopicDot, QuestionRow, QuestionCard } from "./shared";
import type { DbExam } from "@/lib/types";

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

export function LibraryView({ exams }: { exams: DbExam[] }) {
  const [activeTopic, setActiveTopic] = useState("all");
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [openQ, setOpenQ] = useState<string | null>(null);

  const filtered = PQ_QUESTIONS.filter(
    (q) =>
      (activeTopic === "all" || q.topic === activeTopic) &&
      (!activeYear || q.year === activeYear)
  );

  const activeTopicName = PQ_TOPICS.find((t) => t.id === activeTopic)?.name;

  return (
    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
      {/* Sidebar */}
      <aside
        className="scroll-y"
        style={{ width: 264, borderRight: "1px solid var(--line)", background: "var(--paper)", padding: "20px 16px", overflowY: "auto" }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.08, textTransform: "uppercase", color: "var(--muted)", padding: "0 8px", marginBottom: 8 }}>
          Topics
        </div>

        <button
          onClick={() => setActiveTopic("all")}
          style={{
            width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8,
            fontSize: 13.5, fontWeight: activeTopic === "all" ? 600 : 400,
            background: activeTopic === "all" ? "var(--bg-2)" : "transparent",
            display: "flex", alignItems: "center", gap: 10,
            border: "none", cursor: "pointer", fontFamily: "inherit", color: "var(--ink)",
          }}
        >
          <span style={{ flex: 1 }}>All topics</span>
          <span className="num" style={{ fontSize: 11.5, color: "var(--muted)" }}>1,247</span>
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 4 }}>
          {PQ_TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              style={{
                width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8,
                fontSize: 13.5, fontWeight: activeTopic === t.id ? 600 : 400,
                background: activeTopic === t.id ? "var(--bg-2)" : "transparent",
                display: "flex", alignItems: "center", gap: 10,
                border: "none", cursor: "pointer", fontFamily: "inherit", color: "var(--ink)",
              }}
            >
              <span className="tdot" style={{ background: t.color }} />
              <span style={{ flex: 1 }}>{t.name}</span>
              <span className="num" style={{ fontSize: 11.5, color: "var(--muted)" }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Year filter */}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.08, textTransform: "uppercase", color: "var(--muted)", padding: "0 8px", margin: "24px 0 8px" }}>
          Year
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "0 6px" }}>
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setActiveYear(activeYear === y ? null : y)}
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

        {/* Exam filter — live from Supabase */}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.08, textTransform: "uppercase", color: "var(--muted)", padding: "0 8px", margin: "24px 0 8px" }}>
          Exam
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {exams.map((e) => (
            <label key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--ink)" }} />
              <span style={{ flex: 1 }}>{e.name}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main feed */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Feed header */}
        <div style={{ padding: "24px 32px 12px", borderBottom: "1px solid var(--line-2)", background: "var(--paper)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0, letterSpacing: -0.4 }}>
                {activeTopic === "all" ? "All questions" : activeTopicName}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0" }}>
                <span className="num">{filtered.length === PQ_QUESTIONS.length ? "1,247" : filtered.length * 24}</span> questions{" "}
                <span className="serif">across</span>{" "}
                <span className="num">8</span> years
                {activeYear && <> · filtered to <b>{activeYear}</b></>}
              </p>
            </div>
            <span style={{ flex: 1 }} />
            <button className="pq-btn">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M2 3h9M3.5 6.5h6M5 10h3" />
              </svg>
              Sort: Most asked
            </button>
            <button className="pq-btn primary">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6.5 2v9M2 6.5h9" />
              </svg>
              Practice mode
            </button>
          </div>

          {/* Active filter chips */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", minHeight: 22 }}>
            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Active:</span>
            {activeTopic !== "all" && (
              <span className="pq-chip" style={{ background: "var(--ink)", color: "var(--paper)" }}>
                <TopicDot topicId={activeTopic} size={6} />
                {PQ_TOPICS.find((t) => t.id === activeTopic)?.short}
                <span onClick={() => setActiveTopic("all")} style={{ cursor: "pointer", opacity: 0.7, marginLeft: 2 }}>×</span>
              </span>
            )}
            {activeYear && (
              <span className="pq-chip year" style={{ background: "var(--ink)", color: "var(--paper)" }}>
                {activeYear}{" "}
                <span onClick={() => setActiveYear(null)} style={{ cursor: "pointer", marginLeft: 2 }}>×</span>
              </span>
            )}
            {activeTopic === "all" && !activeYear && (
              <span style={{ fontSize: 11.5, color: "var(--muted-2)", fontStyle: "italic" }}>nothing — showing everything</span>
            )}
          </div>
        </div>

        {/* Question list or open question */}
        <div className="scroll-y" style={{ flex: 1, padding: "20px 32px 32px", background: "var(--bg)" }}>
          {openQ ? (
            <div style={{ maxWidth: 760 }}>
              <button
                onClick={() => setOpenQ(null)}
                className="pq-btn ghost"
                style={{ height: 32, padding: "0 8px", color: "var(--muted)", marginBottom: 16 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M8 2L4 6l4 4" />
                </svg>
                Back to list
              </button>
              <QuestionCard question={PQ_QUESTIONS.find((q) => q.id === openQ)!} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 760 }}>
              {filtered.slice(0, 8).map((q) => (
                <QuestionRow key={q.id} question={q} onOpen={() => setOpenQ(q.id)} />
              ))}
              {filtered.length > 8 && (
                <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
                  <button className="pq-btn">Load more →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
