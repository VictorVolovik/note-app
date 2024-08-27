import { DB, Note } from "types/models";

const DB_PATH = new URL("../db.json", import.meta.url).pathname;

export const getDB = async (): Promise<DB> => {
  const dbBlob = Bun.file(DB_PATH);
  const db = await dbBlob.text();
  return JSON.parse(db);
};

export const saveDB = async (db: DB) => {
  await Bun.write(DB_PATH, JSON.stringify(db, null, 2));
  return db;
};

export const insertDB = async (data: Note) => {
  const db = await getDB();
  db.notes.push(data);
  await saveDB(db);
  return data;
};
