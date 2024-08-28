import { beforeEach, describe, test, expect, mock } from "bun:test";

mock.module("../db.js", () => ({
  insertDB: mock(),
  getDB: mock(),
  saveDB: mock(),
}));

const dbModuleMocked = await import("../db.js");
const insertDB = dbModuleMocked.insertDB as JestMock.Mock<
  typeof dbModuleMocked.insertDB
>;
const getDB = dbModuleMocked.getDB as JestMock.Mock<
  typeof dbModuleMocked.getDB
>;
const saveDB = dbModuleMocked.saveDB as JestMock.Mock<
  typeof dbModuleMocked.saveDB
>;

const { newNote, getAllNotes, removeNote } = await import("../notes.js");

beforeEach(() => {
  insertDB.mockClear();
  getDB.mockClear();
  saveDB.mockClear();
});

describe("cli app", () => {
  test("newNote inserts data and returns it", async () => {
    const note = "Test note";
    const tags = ["tag1", "tag2"];
    const data = {
      tags,
      content: note,
      id: Date.now(),
    };
    insertDB.mockResolvedValue(data);

    const result = await newNote(note, tags);
    expect(result).toEqual(data);
  });

  test("getAllNotes returns all notes", async () => {
    const notes = [
      { id: 1, content: "note 1", tags: [] },
      { id: 2, content: "note 2", tags: [] },
      { id: 3, content: "note 3", tags: [] },
    ];
    getDB.mockResolvedValue({ notes });

    const result = await getAllNotes();
    expect(result).toEqual(notes);
  });

  test("removeNote does nothing if id is not found", async () => {
    const notes = [
      { id: 1, content: "note 1", tags: [] },
      { id: 2, content: "note 2", tags: [] },
      { id: 3, content: "note 3", tags: [] },
    ];
    saveDB.mockResolvedValue({ notes });

    const idToRemove = 4;
    const result = await removeNote(idToRemove);
    expect(result).toBeUndefined();
  });
});
