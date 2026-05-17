"use client";

import { useRef, useState } from "react";

type UploadStatus = "idle" | "uploading" | "done" | "error";

const STAGES = [
  { delay: 1500, pct: 20, label: "Claude is reading the PDF…" },
  { delay: 6000, pct: 50, label: "Identifying questions…" },
  { delay: 14000, pct: 75, label: "Categorising by topic…" },
  { delay: 22000, pct: 90, label: "Saving to your library…" },
];

export function UploadView() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [dragging, setDragging] = useState(false);

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setStageLabel("");
    setResultMsg("");
    setFileName("");
    setDragging(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const doUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setStatus("error");
      setResultMsg("Please drop a PDF file.");
      return;
    }

    setFileName(file.name);
    setStatus("uploading");
    setProgress(8);
    setStageLabel("Uploading PDF…");

    const timers = STAGES.map(({ delay, pct, label }) =>
      setTimeout(() => { setProgress(pct); setStageLabel(label); }, delay)
    );

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      timers.forEach(clearTimeout);

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setResultMsg(data.error ?? "Something went wrong.");
      } else {
        setProgress(100);
        setStatus("done");
        setResultMsg(
          `${data.saved} questions extracted and sorted by topic. Go to Supabase → questions table → set status = 'approved' to make them live on the site.`
        );
      }
    } catch {
      timers.forEach(clearTimeout);
      setStatus("error");
      setResultMsg("Network error — please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) doUpload(f);
  };

  return (
    <div className="scroll-y" style={{ flex: 1, padding: "48px 64px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.7, margin: "0 0 10px" }}>
          Drop a PDF,{" "}
          <span className="serif" style={{ color: "var(--accent-fg)" }}>get a syllabus</span>.
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", margin: "0 0 36px", lineHeight: 1.6, maxWidth: 540 }}>
          Upload any question bank or exam paper. Claude reads every question, figures out the topic — Polity, History, Geography and so on — and files it automatically.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => status !== "uploading" && fileRef.current?.click()}
          style={{
            background: dragging ? "var(--accent-soft)" : "var(--surface)",
            border: `1.5px ${dragging ? "solid" : "dashed"} ${dragging ? "var(--accent)" : "var(--muted-2)"}`,
            borderRadius: 18,
            padding: "52px 32px",
            textAlign: "center",
            cursor: status === "uploading" ? "default" : "pointer",
            transition: "background .15s, border-color .15s",
            marginBottom: 32,
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); }}
          />

          {status === "idle" && (
            <>
              <div style={{ color: "var(--muted-2)", marginBottom: 22 }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M13 9h17l10 10v24H13z" />
                  <path d="M30 9v10h10" />
                  <path d="M24 37V25M19 30l5-5 5 5" />
                </svg>
              </div>
              <button className="pq-btn primary" style={{ marginBottom: 14, height: 40, fontSize: 14 }}>
                Choose PDF file
              </button>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>or drag and drop anywhere here</p>
              <p style={{ fontSize: 12, color: "var(--muted-2)", margin: "10px 0 0" }}>
                Works with full question banks and single exam papers
              </p>
            </>
          )}

          {status === "uploading" && (
            <>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink-2)", marginBottom: 24 }}>
                {fileName}
              </p>
              <div style={{ maxWidth: 360, margin: "0 auto 14px" }}>
                <div className="pq-bar" style={{ height: 6 }}>
                  <span style={{ width: progress + "%", transition: "width .8s ease" }} />
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{stageLabel}</p>
            </>
          )}

          {status === "done" && (
            <>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--good-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "var(--good)", fontSize: 22 }}>
                ✓
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>Done!</p>
              <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: "0 auto 24px", maxWidth: 440, lineHeight: 1.65 }}>
                {resultMsg}
              </p>
              <button className="pq-btn" onClick={(e) => { e.stopPropagation(); reset(); }}>
                Upload another
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bad-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "var(--bad)", fontSize: 22 }}>
                ✕
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--bad)", marginBottom: 10 }}>Upload failed</p>
              <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "0 auto 24px", maxWidth: 400, lineHeight: 1.6 }}>
                {resultMsg}
              </p>
              <button className="pq-btn" onClick={(e) => { e.stopPropagation(); reset(); }}>
                Try again
              </button>
            </>
          )}
        </div>

        {/* How it works */}
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "22px 26px" }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.07, textTransform: "uppercase", color: "var(--muted)", margin: "0 0 16px" }}>
            How it works
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              ["📄", "Any PDF", "Question bank or single exam paper — both work"],
              ["🤖", "Claude reads it", "Finds every MCQ question automatically"],
              ["🏷️", "Auto-categorised", "Polity → Polity, History → History, and so on"],
              ["✅", "You approve", "Review in Supabase, then set status = approved to go live"],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 3px", color: "var(--ink)" }}>{title}</p>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
