"use client";

import { useState } from "react";
import Link from "next/link";
import type { ExamWithPapers } from "@/app/exams/page";

function ExamCard({ exam }: { exam: ExamWithPapers }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={"/exams/" + exam.slug}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "var(--surface)",
          border: "1px solid " + (hovered ? "var(--muted-2)" : "var(--line)"),
          borderRadius: 16,
          padding: "32px 28px",
          transition: "border-color .15s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span className="pq-chip exam">{exam.name}</span>

        <h2
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: -0.5,
            margin: "14px 0 12px",
            color: "var(--ink)",
          }}
        >
          {exam.name}
        </h2>

        {exam.papers.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {exam.papers.map((p) => (
              <span className="pq-chip year" key={p.id}>
                {p.year}
              </span>
            ))}
          </div>
        )}

        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 0" }}>
          {exam.papers.length} paper{exam.papers.length !== 1 ? "s" : ""} available
        </p>

        <div
          className="pq-btn primary"
          style={{
            marginTop: 20,
            alignSelf: "flex-start",
            display: "inline-flex",
          }}
        >
          Start practising →
        </div>
      </div>
    </Link>
  );
}

export function ExamCardGrid({ exams }: { exams: ExamWithPapers[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        marginTop: 32,
      }}
    >
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
}
