import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SyncNotes — Instant Cross-Device Clipboard",
  description:
    "Seamlessly share text, links, and images between your devices. A blazing-fast sticky notes board for power users.",
  keywords: ["clipboard", "sync", "notes", "cross-device", "share"],
  authors: [{ name: "SyncNotes" }],
  openGraph: {
    title: "SyncNotes — Instant Cross-Device Clipboard",
    description:
      "Share text, links, and images instantly between laptop and smartphone.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-[family-name:var(--font-inter)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
