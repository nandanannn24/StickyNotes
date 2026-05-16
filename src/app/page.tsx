import { getNotes } from "./actions";
import NotesApp from "@/components/NotesApp";

// Revalidate every 30 seconds for near-real-time sync
export const revalidate = 30;

export default async function HomePage() {
  const notes = await getNotes();

  return <NotesApp initialNotes={notes} />;
}
