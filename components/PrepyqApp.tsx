"use client";

import { TopNav } from "@/components/TopNav";
import { LibraryView } from "@/components/LibraryView";
import type { LibraryQuestion } from "@/components/LibraryView";

export function PrepyqApp({ questions }: { questions: LibraryQuestion[] }) {
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
      <TopNav />
      <LibraryView questions={questions} />
    </div>
  );
}
