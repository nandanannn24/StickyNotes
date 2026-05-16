"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import {
  Sun,
  Moon,
  RefreshCw,
  Zap,
  Palette,
  X,
  Wrench,
  StickyNote,
} from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  noteCount: number;
  activePage: "notes" | "tools";
  onPageChange: (page: "notes" | "tools") => void;
}

export default function Header({
  onRefresh,
  isRefreshing,
  noteCount,
  activePage,
  onPageChange,
}: HeaderProps) {
  const { theme, toggleTheme, activePreset, setPreset, presets } = useTheme();
  const [showPalette, setShowPalette] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06] bg-[var(--header-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})`,
                  boxShadow: `0 8px 24px ${activePreset.accentGlow}`,
                }}
              >
                <Zap
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div
                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--header-bg)] animate-pulse"
                style={{ backgroundColor: "#4ade80" }}
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                SyncNotes
              </h1>
              <p className="text-[10px] sm:text-xs text-[var(--text-muted)] -mt-0.5 font-medium">
                {noteCount} {noteCount === 1 ? "note" : "notes"} synced
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-[var(--btn-secondary-bg)] rounded-xl p-1 border border-[var(--border-subtle)]">
            <button
              onClick={() => onPageChange("notes")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activePage === "notes"
                  ? "text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
              style={
                activePage === "notes"
                  ? {
                      background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})`,
                    }
                  : {}
              }
            >
              <StickyNote className="w-3.5 h-3.5" />
              Notes
            </button>
            <button
              onClick={() => onPageChange("tools")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activePage === "tools"
                  ? "text-white shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
              style={
                activePage === "tools"
                  ? {
                      background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})`,
                    }
                  : {}
              }
            >
              <Wrench className="w-3.5 h-3.5" />
              Tools
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile nav */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={() => onPageChange("notes")}
                className={`p-2.5 rounded-xl border transition-all duration-200 ${
                  activePage === "notes"
                    ? "text-white border-transparent"
                    : "text-[var(--text-muted)] bg-[var(--btn-secondary-bg)] border-[var(--border-subtle)]"
                }`}
                style={
                  activePage === "notes"
                    ? {
                        background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})`,
                      }
                    : {}
                }
              >
                <StickyNote className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange("tools")}
                className={`p-2.5 rounded-xl border transition-all duration-200 ${
                  activePage === "tools"
                    ? "text-white border-transparent"
                    : "text-[var(--text-muted)] bg-[var(--btn-secondary-bg)] border-[var(--border-subtle)]"
                }`}
                style={
                  activePage === "tools"
                    ? {
                        background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})`,
                      }
                    : {}
                }
              >
                <Wrench className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="group relative p-2.5 rounded-xl bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] 
                         border border-[var(--border-subtle)] transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh notes"
            >
              <RefreshCw
                className={`w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </button>

            {/* Theme Palette */}
            <div className="relative">
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="group relative p-2.5 rounded-xl bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] 
                           border border-[var(--border-subtle)] transition-all duration-200"
                title="Change theme"
              >
                <Palette
                  className="w-4 h-4 transition-colors"
                  style={{ color: activePreset.accentPrimary }}
                />
              </button>

              {showPalette && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPalette(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl shadow-black/30 p-4 min-w-[280px] animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        🎨 Theme Presets
                      </h3>
                      <button
                        onClick={() => setShowPalette(false)}
                        className="p-1 rounded-lg hover:bg-[var(--btn-secondary-bg)] text-[var(--text-muted)]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setPreset(preset.id);
                            setShowPalette(false);
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 text-left ${
                            activePreset.id === preset.id
                              ? "border-2 scale-[1.02]"
                              : "border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                          }`}
                          style={
                            activePreset.id === preset.id
                              ? { borderColor: preset.accentPrimary }
                              : {}
                          }
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm"
                            style={{
                              background: `linear-gradient(135deg, ${preset.accentPrimary}, ${preset.accentSecondary})`,
                            }}
                          >
                            {preset.mode === "dark" ? (
                              <Moon className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <Sun className="w-3.5 h-3.5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[var(--text-primary)] leading-tight">
                              {preset.name}
                            </p>
                            <p className="text-[9px] text-[var(--text-muted)]">
                              {preset.mode === "dark" ? "Dark" : "Light"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="group relative p-2.5 rounded-xl bg-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-hover)] 
                         border border-[var(--border-subtle)] transition-all duration-200"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
