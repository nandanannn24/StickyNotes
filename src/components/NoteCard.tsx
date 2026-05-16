"use client";

import { useState, useCallback } from "react";
import {
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Pin,
  PinOff,
  Type,
  Link2,
  ImageIcon,
  MoreVertical,
} from "lucide-react";
import type { NoteData } from "@/app/actions";

interface NoteCardProps {
  note: NoteData;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  isOptimistic?: boolean;
}

// Assign a persistent color based on note type
const TYPE_CONFIG = {
  TEXT: {
    icon: Type,
    gradient: "from-sky-500/15 to-cyan-500/10",
    accentBorder: "border-l-sky-500",
    badge: "bg-sky-500/15 text-sky-400",
    label: "Text",
  },
  LINK: {
    icon: Link2,
    gradient: "from-violet-500/15 to-purple-500/10",
    accentBorder: "border-l-violet-500",
    badge: "bg-violet-500/15 text-violet-400",
    label: "Link",
  },
  IMAGE: {
    icon: ImageIcon,
    gradient: "from-rose-500/15 to-pink-500/10",
    accentBorder: "border-l-rose-500",
    badge: "bg-rose-500/15 text-rose-400",
    label: "Image",
  },
};

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function NoteCard({
  note,
  onDelete,
  onTogglePin,
  isOptimistic,
}: NoteCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const config = TYPE_CONFIG[note.type];
  const Icon = config.icon;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = note.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [note.content]);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(note.id), 300);
  };

  const isBase64Image = note.content.startsWith("data:image/");

  return (
    <div
      className={`group relative break-inside-avoid mb-4 animate-fade-in transition-all duration-300 ${
        isDeleting ? "opacity-0 scale-95" : ""
      } ${isOptimistic ? "opacity-70" : ""}`}
    >
      <div
        className={`relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] 
                    border-l-[3px] ${config.accentBorder}
                    hover:border-[var(--border-hover)] hover:shadow-xl hover:shadow-black/10 
                    transition-all duration-300 overflow-hidden`}
      >
        {/* Pin indicator */}
        {note.pinned && (
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-amber-400 border-l-[24px] border-l-transparent z-10" />
        )}

        {/* Image Content */}
        {note.type === "IMAGE" && (
          <div className="relative w-full bg-black/20">
            {isBase64Image || isValidUrl(note.content) ? (
              <img
                src={note.content}
                alt={note.title || "Image note"}
                className="w-full max-h-64 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="p-8 flex items-center justify-center text-[var(--text-muted)]">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${config.badge}`}
              >
                <Icon className="w-2.5 h-2.5" />
                {config.label}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                {formatTimeAgo(note.createdAt)}
              </span>
            </div>

            {/* Actions */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-[var(--btn-secondary-bg)] text-[var(--text-muted)] 
                           opacity-0 group-hover:opacity-100 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                style={{ opacity: showMenu ? 1 : undefined }}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-40 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl shadow-xl shadow-black/20 py-1 min-w-[140px] animate-fade-in">
                    <button
                      onClick={() => {
                        onTogglePin(note.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--btn-secondary-bg)] transition-colors"
                    >
                      {note.pinned ? (
                        <PinOff className="w-3.5 h-3.5" />
                      ) : (
                        <Pin className="w-3.5 h-3.5" />
                      )}
                      {note.pinned ? "Unpin" : "Pin to top"}
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          {note.title && (
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5 line-clamp-1">
              {note.title}
            </h3>
          )}

          {/* Content */}
          {note.type === "TEXT" && (
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap break-words leading-relaxed line-clamp-6">
              {note.content}
            </p>
          )}

          {note.type === "LINK" && (
            <a
              href={note.content}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors break-all"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="underline decoration-violet-400/30 hover:decoration-violet-400 transition-colors line-clamp-2">
                {note.content}
              </span>
            </a>
          )}

          {/* Copy Button */}
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                copied
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-[var(--btn-secondary-bg)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-secondary-hover)]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>

            {/* Mobile-friendly action buttons (always visible on mobile) */}
            <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onTogglePin(note.id)}
                className="p-1.5 rounded-lg hover:bg-[var(--btn-secondary-bg)] text-[var(--text-muted)] transition-colors"
                title={note.pinned ? "Unpin" : "Pin"}
              >
                {note.pinned ? (
                  <PinOff className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Pin className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
