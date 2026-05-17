"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./shared";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Library",     href: "/" },
  { label: "Practice",    href: "/practice" },
  { label: "Exam Papers", href: "/exams" },
  { label: "Upload",      href: "/upload" },
];

export function TopNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

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
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Logo size={22} />
      </Link>

      <nav style={{ display: "flex", gap: 4, marginLeft: 20 }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: "7px 12px",
              fontSize: 13.5,
              fontWeight: isActive(link.href) ? 600 : 400,
              color: isActive(link.href) ? "var(--ink)" : "var(--muted)",
              borderRadius: 8,
              cursor: "pointer",
              background: isActive(link.href) ? "var(--bg-2)" : "transparent",
              border: "none",
              fontFamily: "inherit",
              transition: "background .12s, color .12s",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {link.label}
          </Link>
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
