"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, RefreshCw, Zap } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  noteCount: number;
}

export default function Header({ onRefresh, isRefreshing, noteCount }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06] bg-[var(--header-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[var(--header-bg)] animate-pulse" />
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

          {/* Actions */}
          <div className="flex items-center gap-2">
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
