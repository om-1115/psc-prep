"use client";

import { useState } from "react";
import { TopNav, type Tab } from "@/components/TopNav";
import { LibraryView } from "@/components/LibraryView";
import { UploadView } from "@/components/UploadView";
import { ExamPaperView } from "@/components/ExamPaperView";
import { PracticeView } from "@/components/PracticeView";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("library");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--paper)",
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
        WebkitFontSmoothing: "antialiased",
        letterSpacing: "-0.005em",
        fontFeatureSettings: '"ss01", "cv11"',
      } as React.CSSProperties}
    >
      <TopNav active={activeTab} onTabChange={setActiveTab} />

      {activeTab === "library"  && <LibraryView />}
      {activeTab === "upload"   && <UploadView />}
      {activeTab === "papers"   && <ExamPaperView />}
      {activeTab === "practice" && <PracticeView />}
    </div>
  );
}
