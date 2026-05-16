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
  Download,
} from "lucide-react";
import type { NoteData } from "@/app/actions";
import { useTheme } from "./ThemeProvider";

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
    label: "Text",
  },
  LINK: {
    icon: Link2,
    label: "Link",
  },
  IMAGE: {
    icon: ImageIcon,
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

async function downloadImage(src: string, filename: string) {
  try {
    if (src.startsWith("data:")) {
      // Base64 image — direct download
      const link = document.createElement("a");
      link.href = src;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // URL image — fetch as blob
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch {
    // Fallback: open in new tab for manual save
    window.open(src, "_blank");
  }
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
  const [isDownloading, setIsDownloading] = useState(false);
  const { activePreset } = useTheme();

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

  const handleDownload = async () => {
    setIsDownloading(true);
    const filename = note.title
      ? `${note.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`
      : `syncnotes-image-${Date.now()}.png`;
    await downloadImage(note.content, filename);
    setIsDownloading(false);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(note.id), 300);
  };

  const isBase64Image = note.content.startsWith("data:image/");

  // Dynamic badge/accent based on type + preset
  const typeAccentMap = {
    TEXT: activePreset.accentPrimary,
    LINK: activePreset.accentPrimary,
    IMAGE: activePreset.accentSecondary,
  };
  const accent = typeAccentMap[note.type];

  return (
    <div
      className={`group relative break-inside-avoid mb-4 animate-fade-in transition-all duration-300 ${
        isDeleting ? "opacity-0 scale-95" : ""
      } ${isOptimistic ? "opacity-70" : ""}`}
    >
      <div
        className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] 
                    border-l-[3px]
                    hover:border-[var(--border-hover)] hover:shadow-xl hover:shadow-black/10 
                    transition-all duration-300 overflow-hidden"
        style={{ borderLeftColor: accent }}
      >
        {/* Pin indicator */}
        {note.pinned && (
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-amber-400 border-l-[24px] border-l-transparent z-10" />
        )}

        {/* Image Content */}
        {note.type === "IMAGE" && (
          <div className="relative w-full bg-black/20 group/image">
            {isBase64Image || isValidUrl(note.content) ? (
              <>
                <img
                  src={note.content}
                  alt={note.title || "Image note"}
                  className="w-full max-h-64 object-cover"
                  loading="lazy"
                />
                {/* Download overlay for image */}
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="opacity-0 group-hover/image:opacity-100 transform scale-90 group-hover/image:scale-100 transition-all duration-300
                               flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold
                               shadow-xl backdrop-blur-md disabled:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${activePreset.accentPrimary}, ${activePreset.accentSecondary})`,
                    }}
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                </div>
              </>
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
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                style={{
                  backgroundColor: `${accent}20`,
                  color: accent,
                }}
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
                    {note.type === "IMAGE" && (
                      <button
                        onClick={() => {
                          handleDownload();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--btn-secondary-bg)] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Image
                      </button>
                    )}
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
              className="group/link flex items-center gap-2 text-sm transition-colors break-all"
              style={{ color: activePreset.accentPrimary }}
              onClick={(e) => {
                // Ensure link opens in new tab on all devices
                e.stopPropagation();
                window.open(note.content, "_blank", "noopener,noreferrer");
                e.preventDefault();
              }}
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="underline decoration-[var(--accent-violet)]/30 hover:decoration-[var(--accent-violet)] transition-colors line-clamp-2">
                {note.content}
              </span>
            </a>
          )}

          {/* Action buttons */}
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
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

              {/* Image download button - always visible */}
              {note.type === "IMAGE" && (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200
                             bg-[var(--btn-secondary-bg)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-secondary-hover)]
                             disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  {isDownloading ? "..." : "Save"}
                </button>
              )}

              {/* Link open button - always visible */}
              {note.type === "LINK" && (
                <button
                  onClick={() =>
                    window.open(note.content, "_blank", "noopener,noreferrer")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200
                             bg-[var(--btn-secondary-bg)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-secondary-hover)]"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open
                </button>
              )}
            </div>

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
