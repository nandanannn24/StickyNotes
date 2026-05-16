"use server";

import { prisma } from "@/lib/prisma";
import { NoteType } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export type NoteData = {
  id: string;
  type: NoteType;
  content: string;
  title: string | null;
  createdAt: Date;
  pinned: boolean;
};

export async function getNotes(): Promise<NoteData[]> {
  const notes = await prisma.note.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
  return notes;
}

export async function createNote(
  type: NoteType,
  content: string,
  title?: string
): Promise<NoteData> {
  let resolvedTitle = title || null;

  if (type === "LINK" && !title) {
    try {
      const url = new URL(content);
      resolvedTitle = url.hostname.replace("www.", "");
    } catch {
      resolvedTitle = null;
    }
  }

  const note = await prisma.note.create({
    data: {
      type,
      content,
      title: resolvedTitle,
    },
  });

  revalidatePath("/");
  return note;
}

export async function deleteNote(id: string): Promise<void> {
  await prisma.note.delete({ where: { id } });
  revalidatePath("/");
}

export async function togglePinNote(id: string): Promise<NoteData> {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new Error("Note not found");

  const updated = await prisma.note.update({
    where: { id },
    data: { pinned: !note.pinned },
  });

  revalidatePath("/");
  return updated;
}

export async function fetchLinkMetadata(
  url: string
): Promise<{ title: string | null; description: string | null }> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "SyncNotes/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
    );

    return {
      title: titleMatch?.[1]?.trim() || null,
      description: descMatch?.[1]?.trim() || null,
    };
  } catch {
    return { title: null, description: null };
  }
}
