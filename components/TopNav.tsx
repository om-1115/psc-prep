"use client";

import { Logo } from "./shared";

export type Tab = "library" | "practice" | "papers" | "upload";

const TABS: { id: Tab; label: string }[] = [
  { id: "library",  label: "Library" },
  { id: "practice", label: "Practice" },
  { id: "papers",   label: "Exam Papers" },
  { id: "upload",   label: "Upload" },
];

export function TopNav({ active, onTabChange }: { active: Tab; onTabChange: (t: Tab) => void }) {
  return (
    <div
      style={{
        height: 60,
        background: "var(--paper)",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 32,
        flexShrink: 0,
      }}
    >
      <Logo size={22} />

      <nav style={{ display: "flex", gap: 4, marginLeft: 20 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              padding: "7px 12px",
              fontSize: 13.5,
              fontWeight: active === t.id ? 600 : 400,
              color: active === t.id ? "var(--ink)" : "var(--muted)",
              borderRadius: 8,
              cursor: "pointer",
              background: active === t.id ? "var(--bg-2)" : "transparent",
              border: "none",
              fontFamily: "inherit",
              transition: "background .12s, color .12s",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Search bar */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 360,
            height: 34,
            background: "var(--bg)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 8,
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="5.5" cy="5.5" r="4" />
            <path d="M8.5 8.5l3 3" />
          </svg>
          Search questions, topics, years…
          <span style={{ flex: 1 }} />
          <kbd style={{ fontSize: 10.5, padding: "2px 5px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 4, fontFamily: "var(--font-mono)" }}>⌘K</kbd>
        </div>
      </div>

      {/* Streak + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
          <span style={{ color: "var(--accent-fg)" }}>●</span>
          <span className="num"><b>14</b> day streak</span>
        </div>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c8a679, #8a6d4a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          R
        </div>
      </div>
    </div>
  );
}
