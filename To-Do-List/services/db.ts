import { Priority, ToDoItem } from "@/hooks/ToToiItem";
import * as SQLite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

const db = SQLite.openDatabaseSync("ToDo.db");

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let { user_version: currentDbVersion } =
    await db.getFirstAsync<any>("PRAGMA user_version");

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        date TEXT NOT NULL,
        priority INTEGER NOT NULL
      );
    `);

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export async function addItem(
  text: string,
  priority: Priority
): Promise<ToDoItem> {
  const date = new Date().toISOString();

  const result = await db.runAsync(
    `INSERT INTO todo (text, date, priority) VALUES (?, ?, ?);`,
    [text, date, priority]
  );

  return {
    id: result.lastInsertRowId,
    text,
    date: new Date(date),
    priority,
  };
}

export async function deleteItem(id: number) {
  await db.runAsync(`DELETE FROM todo WHERE id = ?;`, [id]);
}

export async function getItems(): Promise<ToDoItem[]> {
  const result = await db.getAllAsync<any>("SELECT * FROM todo;");

  return result.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));
}

export async function updateItem(item: ToDoItem) {
  await db.runAsync(
    `UPDATE todo SET text = ?, date = ?, priority = ? WHERE id = ?;`,
    [
      item.text,
      item.date.toISOString(),
      item.priority,
      item.id,
    ]
  );
}