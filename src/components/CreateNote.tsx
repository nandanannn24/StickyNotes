"use client";

import { useState, useRef, useCallback } from "react";
import {
  Plus,
  Type,
  Link2,
  ImagePlus,
  Send,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { NoteType } from "@/generated/prisma/client";

interface CreateNoteProps {
  onSubmit: (type: NoteType, content: string, title?: string) => Promise<void>;
}

const NOTE_TYPES = [
  {
    type: "TEXT" as NoteType,
    icon: Type,
    label: "Text",
    placeholder: "Type or paste your text...",
    gradient: "from-sky-500 to-cyan-400",
    color: "sky",
  },
  {
    type: "LINK" as NoteType,
    icon: Link2,
    label: "Link",
    placeholder: "Paste a URL (https://...)",
    gradient: "from-violet-500 to-purple-400",
    color: "violet",
  },
  {
    type: "IMAGE" as NoteType,
    icon: ImagePlus,
    label: "Image",
    placeholder: "Paste image URL or upload...",
    gradient: "from-rose-500 to-pink-400",
    color: "rose",
  },
];

export default function CreateNote({ onSubmit }: CreateNoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeType, setActiveType] = useState<NoteType>("TEXT");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConfig = NOTE_TYPES.find((t) => t.type === activeType)!;

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Max 4MB for base64
      if (file.size > 4 * 1024 * 1024) {
        alert("Image must be smaller than 4MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setContent(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(activeType, content.trim(), title.trim() || undefined);
      setContent("");
      setTitle("");
      setImagePreview(null);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setContent("");
    setTitle("");
    setImagePreview(null);
  };

  // Floating action button (mobile) / inline bar
  if (!isOpen) {
    return (
      <>
        {/* Desktop inline bar */}
        <div className="hidden sm:block w-full max-w-2xl mx-auto mb-8">
          <button
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => textareaRef.current?.focus(), 100);
            }}
            className="w-full group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] 
                       bg-[var(--card-bg)] hover:border-violet-500/30 transition-all duration-300
                       p-4 flex items-center gap-3 cursor-text"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-[var(--text-muted)] text-sm font-medium">
              Add a new note, link, or image...
            </span>
            <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--btn-secondary-bg)] border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+N</span>
            </div>
          </button>
        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => textareaRef.current?.focus(), 100);
          }}
          className="sm:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl 
                     bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-2xl shadow-violet-500/40
                     flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-7 h-7 text-white" />
        </button>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none sm:pointer-events-none"
        onClick={resetAndClose}
      />

      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:relative sm:inset-auto sm:max-w-2xl sm:mx-auto sm:mb-8 animate-slide-up sm:animate-fade-in">
        <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Type selector */}
          <div className="flex items-center gap-1 p-3 border-b border-[var(--border-subtle)]">
            {NOTE_TYPES.map(({ type, icon: Icon, label, gradient }) => (
              <button
                key={type}
                onClick={() => {
                  setActiveType(type);
                  setContent("");
                  setImagePreview(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeType === type
                    ? `bg-gradient-to-r ${gradient} text-white shadow-md`
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-secondary-bg)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
            <button
              onClick={resetAndClose}
              className="ml-auto p-2 rounded-xl hover:bg-[var(--btn-secondary-bg)] text-[var(--text-muted)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Input area */}
          <div className="p-4 space-y-3">
            {/* Optional title */}
            {activeType !== "IMAGE" && (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="w-full bg-transparent text-sm font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 outline-none"
              />
            )}

            {/* Content input */}
            {activeType === "IMAGE" ? (
              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden bg-black/20">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-48 object-contain"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setContent("");
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 bg-[var(--input-bg)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 outline-none border border-[var(--border-subtle)] focus:border-violet-500/50 transition-colors"
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-400 text-white text-sm font-semibold hover:shadow-lg hover:shadow-rose-500/25 transition-all active:scale-[0.98]"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={activeConfig.placeholder}
                rows={3}
                className="w-full bg-[var(--input-bg)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 outline-none border border-[var(--border-subtle)] focus:border-violet-500/50 resize-none transition-colors"
                onKeyDown={handleKeyDown}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 pb-4 pt-0">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Ctrl+Enter to send</span>
              <span className="sm:hidden">Tap send to add</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white 
                         bg-gradient-to-r ${activeConfig.gradient} shadow-lg
                         hover:shadow-xl transition-all duration-200 active:scale-[0.97]
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none`}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Add Note
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
