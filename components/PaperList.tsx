"use client";

import { useState } from "react";
import Link from "next/link";
import type { DbPaper } from "@/lib/types";

function PaperCard({ paper, slug }: { paper: DbPaper; slug: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={"/exams/" + slug + "/papers/" + paper.id}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "var(--surface)",
          border: "1px solid " + (hovered ? "var(--muted-2)" : "var(--line)"),
          borderRadius: 14,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          transition: "border-color .15s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--ink)",
            minWidth: 60,
          }}
        >
          {paper.year}
        </span>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
            {paper.paper_code ?? paper.title}
          </div>
          {paper.total_questions != null && (
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              {paper.total_questions} questions
            </div>
          )}
        </div>

        <span className="pq-chip" style={{ color: "var(--muted)" }}>
          View paper →
        </span>
      </div>
    </Link>
  );
}

export function PaperList({ papers, slug }: { papers: DbPaper[]; slug: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} slug={slug} />
      ))}
      {papers.length === 0 && (
        <p style={{ fontSize: 14, color: "var(--muted)", padding: "24px 0" }}>
          No papers available yet.
        </p>
      )}
    </div>
  );
}
