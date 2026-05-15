"use client";

import { useEffect, useState } from "react";
import { PQ_RECENT } from "@/lib/data";

interface UploadState {
  kind: "bank" | "paper";
  progress: number;
  name: string;
}

function UploadCard({
  tag,
  title,
  desc,
  icon,
  dragging,
  setDragging,
  onUpload,
  uploading,
}: {
  kind?: "bank" | "paper";
  tag: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  dragging: boolean;
  setDragging: (v: boolean) => void;
  onUpload: () => void;
  uploading: UploadState | null;
}) {
  const isDone = (uploading?.progress ?? 0) >= 100;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); onUpload(); }}
      onClick={() => !uploading && onUpload()}
      style={{
        position: "relative",
        background: dragging ? "var(--accent-soft)" : "var(--surface)",
        border: `1.5px ${dragging ? "solid" : "dashed"} ${dragging ? "var(--accent)" : "var(--muted-2)"}`,
        borderRadius: 16,
        padding: "32px 28px",
        cursor: uploading ? "default" : "pointer",
        transition: "background .15s, border-color .15s",
        minHeight: 240,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ color: "var(--ink-2)" }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.08, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
            {tag}
          </div>
          <h3 style={{ fontSize: 19, fontWeight: 600, margin: 0, marginBottom: 8, letterSpacing: -0.3 }}>{title}</h3>
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
        </div>
      </div>

      {!uploading && (
        <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 10 }}>
          <button className="pq-btn primary" style={{ height: 34, fontSize: 13 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6.5 9V2M3 5.5l3.5-3.5 3.5 3.5M2 11h9" />
            </svg>
            Choose file
          </button>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>or drop a PDF anywhere here</span>
        </div>
      )}

      {uploading && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M3 1h6l3 3v9H3z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uploading.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                {isDone ? (
                  <><span style={{ color: "var(--good)" }}>✓ Done</span> · 87 questions extracted · 8 topics</>
                ) : uploading.progress < 30 ? "Reading PDF…" : uploading.progress < 65 ? "Detecting questions…" : "Categorizing by topic…"}
              </div>
            </div>
            <span className="num" style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              {Math.round(uploading.progress)}%
            </span>
          </div>
          <div className="pq-bar">
            <span style={{ width: uploading.progress + "%" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export function UploadView() {
  const [dragging, setDragging] = useState<"bank" | "paper" | null>(null);
  const [uploading, setUploading] = useState<UploadState | null>(null);

  const startUpload = (kind: "bank" | "paper") => {
    setUploading({
      kind,
      progress: 0,
      name: kind === "bank" ? "UPSC_PYQ_Bank_2015-23.pdf" : "CGPSC_Pre_2024.pdf",
    });
  };

  useEffect(() => {
    if (!uploading || uploading.progress >= 100) return;
    const t = setTimeout(
      () => setUploading((u) => u ? { ...u, progress: Math.min(100, u.progress + 7 + Math.random() * 8) } : null),
      220
    );
    return () => clearTimeout(t);
  }, [uploading]);

  return (
    <div className="scroll-y" style={{ flex: 1, padding: "48px 64px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.7, margin: 0, marginBottom: 8 }}>
            Drop a PDF,{" "}
            <span className="serif" style={{ color: "var(--accent-fg)" }}>get a syllabus</span>.
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)", margin: 0, maxWidth: 620, lineHeight: 1.55 }}>
            Upload PYQ banks or full exam papers — Prepyq extracts each question, tags it with year, exam and topic, and files it next to the rest of your library.
          </p>
        </div>

        {/* Two-flow split */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>
          <UploadCard
            kind="bank"
            tag="Question bank"
            title="Mixed PYQ collection"
            desc="A PDF with questions from many exams or years. We'll split it apart and categorize each one."
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="6" y="4" width="20" height="24" rx="2" />
                <path d="M11 10h10M11 15h10M11 20h7" />
              </svg>
            }
            dragging={dragging === "bank"}
            setDragging={(b) => setDragging(b ? "bank" : null)}
            onUpload={() => startUpload("bank")}
            uploading={uploading?.kind === "bank" ? uploading : null}
          />
          <UploadCard
            kind="paper"
            tag="Single exam paper"
            title="One full question paper"
            desc="A specific year's pre paper — we'll keep the order, tag each question, and show you the topic distribution."
            icon={
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M8 4h12l4 4v20H8z" />
                <path d="M20 4v4h4" />
                <path d="M12 14h8M12 18h8M12 22h5" />
              </svg>
            }
            dragging={dragging === "paper"}
            setDragging={(b) => setDragging(b ? "paper" : null)}
            onUpload={() => startUpload("paper")}
            uploading={uploading?.kind === "paper" ? uploading : null}
          />
        </div>

        {/* Recently processed */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "baseline", gap: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.06, textTransform: "uppercase", color: "var(--muted)", margin: 0 }}>
            Recently processed
          </h3>
          <span style={{ flex: 1, height: 1, background: "var(--line)", marginLeft: 4 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PQ_RECENT.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M4 2h7l3 3v11H4z" />
                  <path d="M11 2v3h3" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                  {r.kind === "bank" ? "Question bank" : "Single paper"} · <span className="num">{r.questions}</span> questions extracted · {r.when}
                </div>
              </div>
              <button className="pq-btn ghost" style={{ height: 28, fontSize: 12 }}>Open →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
