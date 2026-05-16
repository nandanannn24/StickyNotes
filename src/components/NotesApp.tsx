"use client";

import { useState, useCallback, useEffect, useOptimistic, useTransition } from "react";
import { NoteType } from "@/generated/prisma/client";
import {
  getNotes,
  createNote,
  deleteNote,
  togglePinNote,
  type NoteData,
} from "@/app/actions";
import Header from "./Header";
import CreateNote from "./CreateNote";
import NoteCard from "./NoteCard";
import ToolsPage from "./ToolsPage";
import { ClipboardList } from "lucide-react";

interface NotesAppProps {
  initialNotes: NoteData[];
}

type OptimisticAction =
  | { type: "add"; note: NoteData }
  | { type: "delete"; id: string }
  | { type: "togglePin"; id: string };

export default function NotesApp({ initialNotes }: NotesAppProps) {
  const [notes, setNotes] = useState<NoteData[]>(initialNotes);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activePage, setActivePage] = useState<"notes" | "tools">("notes");
  const [, startTransition] = useTransition();

  const [optimisticNotes, addOptimistic] = useOptimistic(
    notes,
    (state: NoteData[], action: OptimisticAction) => {
      switch (action.type) {
        case "add":
          return [action.note, ...state];
        case "delete":
          return state.filter((n) => n.id !== action.id);
        case "togglePin":
          return state.map((n) =>
            n.id === action.id ? { ...n, pinned: !n.pinned } : n
          );
        default:
          return state;
      }
    }
  );

  // Sort: pinned first, then by date
  const sortedNotes = [...optimisticNotes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const refreshNotes = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getNotes();
      setNotes(fresh);
    } catch (err) {
      console.error("Failed to refresh:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Keyboard shortcut: Ctrl+N to open create note
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setActivePage("notes");
        const btn = document.querySelector("[data-create-trigger]") as HTMLButtonElement;
        btn?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreate = useCallback(
    async (type: NoteType, content: string, title?: string) => {
      const tempNote: NoteData = {
        id: `temp-${Date.now()}`,
        type,
        content,
        title: title || null,
        createdAt: new Date(),
        pinned: false,
      };

      startTransition(() => {
        addOptimistic({ type: "add", note: tempNote });
      });

      const real = await createNote(type, content, title);
      setNotes((prev) => [real, ...prev]);
    },
    [addOptimistic, startTransition]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      startTransition(() => {
        addOptimistic({ type: "delete", id });
      });

      try {
        await deleteNote(id);
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        console.error("Failed to delete:", err);
        refreshNotes();
      }
    },
    [addOptimistic, startTransition, refreshNotes]
  );

  const handleTogglePin = useCallback(
    async (id: string) => {
      startTransition(() => {
        addOptimistic({ type: "togglePin", id });
      });

      try {
        const updated = await togglePinNote(id);
        setNotes((prev) =>
          prev.map((n) => (n.id === id ? updated : n))
        );
      } catch (err) {
        console.error("Failed to toggle pin:", err);
        refreshNotes();
      }
    },
    [addOptimistic, startTransition, refreshNotes]
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header
        onRefresh={refreshNotes}
        isRefreshing={isRefreshing}
        noteCount={notes.length}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      {activePage === "notes" ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <CreateNote onSubmit={handleCreate} />

          {sortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6">
                <ClipboardList className="w-10 h-10 text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                No notes yet
              </h2>
              <p className="text-sm text-[var(--text-muted)] max-w-sm">
                Start by adding a text snippet, link, or image. Your notes sync
                instantly across all your devices.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {sortedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                  isOptimistic={note.id.startsWith("temp-")}
                />
              ))}
            </div>
          )}
        </main>
      ) : (
        <ToolsPage />
      )}
    </div>
  );
}
