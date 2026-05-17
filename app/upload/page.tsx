import { TopNav } from "@/components/TopNav";
import { UploadView } from "@/components/UploadView";

export default function UploadPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--bg)",
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
        WebkitFontSmoothing: "antialiased",
      } as React.CSSProperties}
    >
      <TopNav />
      <UploadView />
    </div>
  );
}
