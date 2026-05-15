import type { Metadata } from "next";
import { Schibsted_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Prepyq — PYQ practice for UPSC + State PSC",
  description: "Practice previous year questions for UPSC and CGPSC prelims, with topic-wise categorization.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`} style={{ height: "100%" }}>
      <body style={{ margin: 0, padding: 0, height: "100%", fontFamily: "var(--font-sans)", WebkitFontSmoothing: "antialiased" } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
