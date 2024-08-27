import type { Note } from "types/models";
import { insertDB, saveDB, getDB } from "db";

export const newNote = async (note: Note["content"], tags: Note["tags"]) => {
  const data = {
    tags,
    content: note,
    id: Date.now(),
  };
  await insertDB(data);
  return data;
};

export const getAllNotes = async () => {
  const { notes } = await getDB();
  return notes;
};

export const findNotes = async (filter: string) => {
  const notes = await getAllNotes();
  return notes.filter((note) =>
    note.content.toLowerCase().includes(filter.toLowerCase()),
  );
};

export const removeNote = async (id: Note["id"]) => {
  const notes = await getAllNotes();
  const match = notes.find((note) => note.id === id);

  if (match) {
    const newNotes = notes.filter((note) => note.id !== id);
    await saveDB({ notes: newNotes });
    return match;
  }
};

export const removeAllNotes = () => saveDB({ notes: [] });
