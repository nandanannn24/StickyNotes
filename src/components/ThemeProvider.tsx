"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

export interface ColorPreset {
  id: string;
  name: string;
  emoji: string;
  mode: Theme;
  // Colors
  bgPrimary: string;
  bgSecondary: string;
  cardBg: string;
  headerBg: string;
  inputBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderSubtle: string;
  borderHover: string;
  btnSecondaryBg: string;
  btnSecondaryHover: string;
  accentPrimary: string;
  accentSecondary: string;
  accentGlow: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "violet-dark",
    name: "Violet Dark",
    emoji: "🟣",
    mode: "dark",
    bgPrimary: "#0a0a0f",
    bgSecondary: "#111118",
    cardBg: "#16161f",
    headerBg: "rgba(10, 10, 15, 0.85)",
    inputBg: "#1c1c28",
    textPrimary: "#f0f0f5",
    textSecondary: "#a0a0b8",
    textMuted: "#5c5c72",
    borderSubtle: "rgba(255, 255, 255, 0.06)",
    borderHover: "rgba(255, 255, 255, 0.12)",
    btnSecondaryBg: "rgba(255, 255, 255, 0.05)",
    btnSecondaryHover: "rgba(255, 255, 255, 0.1)",
    accentPrimary: "#8b5cf6",
    accentSecondary: "#d946ef",
    accentGlow: "rgba(139, 92, 246, 0.4)",
  },
  {
    id: "pink-light",
    name: "Pink Light",
    emoji: "🩷",
    mode: "light",
    bgPrimary: "#fff0f5",
    bgSecondary: "#ffe4ed",
    cardBg: "#ffffff",
    headerBg: "rgba(255, 240, 245, 0.88)",
    inputBg: "#fce4ec",
    textPrimary: "#2d1b2e",
    textSecondary: "#6b4c6e",
    textMuted: "#b08db3",
    borderSubtle: "rgba(236, 64, 122, 0.12)",
    borderHover: "rgba(236, 64, 122, 0.25)",
    btnSecondaryBg: "rgba(236, 64, 122, 0.06)",
    btnSecondaryHover: "rgba(236, 64, 122, 0.12)",
    accentPrimary: "#ec407a",
    accentSecondary: "#f06292",
    accentGlow: "rgba(236, 64, 122, 0.3)",
  },
  {
    id: "ocean-dark",
    name: "Ocean Dark",
    emoji: "🌊",
    mode: "dark",
    bgPrimary: "#0a0e17",
    bgSecondary: "#0f1520",
    cardBg: "#141c2b",
    headerBg: "rgba(10, 14, 23, 0.88)",
    inputBg: "#1a2435",
    textPrimary: "#e8edf5",
    textSecondary: "#8899b3",
    textMuted: "#4a5c75",
    borderSubtle: "rgba(56, 189, 248, 0.08)",
    borderHover: "rgba(56, 189, 248, 0.18)",
    btnSecondaryBg: "rgba(56, 189, 248, 0.06)",
    btnSecondaryHover: "rgba(56, 189, 248, 0.12)",
    accentPrimary: "#38bdf8",
    accentSecondary: "#22d3ee",
    accentGlow: "rgba(56, 189, 248, 0.35)",
  },
  {
    id: "emerald-dark",
    name: "Emerald Night",
    emoji: "🌿",
    mode: "dark",
    bgPrimary: "#0a0f0d",
    bgSecondary: "#101916",
    cardBg: "#15201b",
    headerBg: "rgba(10, 15, 13, 0.88)",
    inputBg: "#1a2b24",
    textPrimary: "#e5f0ea",
    textSecondary: "#88b09a",
    textMuted: "#4a7560",
    borderSubtle: "rgba(52, 211, 153, 0.08)",
    borderHover: "rgba(52, 211, 153, 0.18)",
    btnSecondaryBg: "rgba(52, 211, 153, 0.06)",
    btnSecondaryHover: "rgba(52, 211, 153, 0.12)",
    accentPrimary: "#34d399",
    accentSecondary: "#6ee7b7",
    accentGlow: "rgba(52, 211, 153, 0.35)",
  },
  {
    id: "rose-dark",
    name: "Rose Dark",
    emoji: "🌹",
    mode: "dark",
    bgPrimary: "#0f0a0c",
    bgSecondary: "#1a1014",
    cardBg: "#221520",
    headerBg: "rgba(15, 10, 12, 0.88)",
    inputBg: "#2a1a24",
    textPrimary: "#f5e8ef",
    textSecondary: "#b88898",
    textMuted: "#7a4e60",
    borderSubtle: "rgba(251, 113, 133, 0.08)",
    borderHover: "rgba(251, 113, 133, 0.18)",
    btnSecondaryBg: "rgba(251, 113, 133, 0.06)",
    btnSecondaryHover: "rgba(251, 113, 133, 0.12)",
    accentPrimary: "#fb7185",
    accentSecondary: "#fda4af",
    accentGlow: "rgba(251, 113, 133, 0.35)",
  },
  {
    id: "amber-light",
    name: "Amber Light",
    emoji: "☀️",
    mode: "light",
    bgPrimary: "#fffbf0",
    bgSecondary: "#fff5e0",
    cardBg: "#ffffff",
    headerBg: "rgba(255, 251, 240, 0.88)",
    inputBg: "#fff3d6",
    textPrimary: "#2d2410",
    textSecondary: "#6b5c38",
    textMuted: "#b0a070",
    borderSubtle: "rgba(245, 158, 11, 0.12)",
    borderHover: "rgba(245, 158, 11, 0.25)",
    btnSecondaryBg: "rgba(245, 158, 11, 0.06)",
    btnSecondaryHover: "rgba(245, 158, 11, 0.12)",
    accentPrimary: "#f59e0b",
    accentSecondary: "#fbbf24",
    accentGlow: "rgba(245, 158, 11, 0.3)",
  },
  {
    id: "lavender-light",
    name: "Lavender Light",
    emoji: "💜",
    mode: "light",
    bgPrimary: "#f5f0ff",
    bgSecondary: "#ede5ff",
    cardBg: "#ffffff",
    headerBg: "rgba(245, 240, 255, 0.88)",
    inputBg: "#ede5ff",
    textPrimary: "#1e1035",
    textSecondary: "#5c4880",
    textMuted: "#9580b8",
    borderSubtle: "rgba(139, 92, 246, 0.12)",
    borderHover: "rgba(139, 92, 246, 0.25)",
    btnSecondaryBg: "rgba(139, 92, 246, 0.06)",
    btnSecondaryHover: "rgba(139, 92, 246, 0.12)",
    accentPrimary: "#8b5cf6",
    accentSecondary: "#a78bfa",
    accentGlow: "rgba(139, 92, 246, 0.3)",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    emoji: "🌃",
    mode: "dark",
    bgPrimary: "#080c18",
    bgSecondary: "#0e1428",
    cardBg: "#131b33",
    headerBg: "rgba(8, 12, 24, 0.88)",
    inputBg: "#182240",
    textPrimary: "#e0e8ff",
    textSecondary: "#8090c0",
    textMuted: "#405080",
    borderSubtle: "rgba(99, 102, 241, 0.08)",
    borderHover: "rgba(99, 102, 241, 0.18)",
    btnSecondaryBg: "rgba(99, 102, 241, 0.06)",
    btnSecondaryHover: "rgba(99, 102, 241, 0.12)",
    accentPrimary: "#6366f1",
    accentSecondary: "#818cf8",
    accentGlow: "rgba(99, 102, 241, 0.35)",
  },
];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  activePreset: ColorPreset;
  setPreset: (id: string) => void;
  presets: ColorPreset[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  activePreset: COLOR_PRESETS[0],
  setPreset: () => {},
  presets: COLOR_PRESETS,
});

function applyPreset(preset: ColorPreset) {
  const root = document.documentElement;
  root.style.setProperty("--bg-primary", preset.bgPrimary);
  root.style.setProperty("--bg-secondary", preset.bgSecondary);
  root.style.setProperty("--card-bg", preset.cardBg);
  root.style.setProperty("--header-bg", preset.headerBg);
  root.style.setProperty("--input-bg", preset.inputBg);
  root.style.setProperty("--text-primary", preset.textPrimary);
  root.style.setProperty("--text-secondary", preset.textSecondary);
  root.style.setProperty("--text-muted", preset.textMuted);
  root.style.setProperty("--border-subtle", preset.borderSubtle);
  root.style.setProperty("--border-hover", preset.borderHover);
  root.style.setProperty("--btn-secondary-bg", preset.btnSecondaryBg);
  root.style.setProperty("--btn-secondary-hover", preset.btnSecondaryHover);
  root.style.setProperty("--accent-violet", preset.accentPrimary);
  root.style.setProperty("--accent-fuchsia", preset.accentSecondary);
  root.style.setProperty("--accent-glow", preset.accentGlow);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [presetId, setPresetId] = useState("violet-dark");
  const [mounted, setMounted] = useState(false);

  const activePreset = COLOR_PRESETS.find((p) => p.id === presetId) || COLOR_PRESETS[0];

  useEffect(() => {
    setMounted(true);
    const savedPreset = localStorage.getItem("syncnotes-preset");
    if (savedPreset) {
      const preset = COLOR_PRESETS.find((p) => p.id === savedPreset);
      if (preset) {
        setPresetId(savedPreset);
        setTheme(preset.mode);
        applyPreset(preset);
        document.documentElement.classList.toggle("dark", preset.mode === "dark");
        return;
      }
    }
    const savedTheme = localStorage.getItem("syncnotes-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("syncnotes-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Find a preset matching the new theme
    const newPreset = COLOR_PRESETS.find((p) => p.mode === newTheme) || COLOR_PRESETS[0];
    setPresetId(newPreset.id);
    applyPreset(newPreset);
    localStorage.setItem("syncnotes-preset", newPreset.id);
  };

  const setPreset = (id: string) => {
    const preset = COLOR_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setTheme(preset.mode);
    applyPreset(preset);
    localStorage.setItem("syncnotes-preset", id);
    localStorage.setItem("syncnotes-theme", preset.mode);
    document.documentElement.classList.toggle("dark", preset.mode === "dark");
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#0a0a0f]" />;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, activePreset, setPreset, presets: COLOR_PRESETS }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
