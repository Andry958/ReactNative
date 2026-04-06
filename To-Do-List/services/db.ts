import { Priority, ToDoItem } from "@/hooks/ToToiItem";
import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;

  // Встановлюємо режим WAL
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // Створюємо таблицю, якщо її ще нема
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      date TEXT NOT NULL,
      priority INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Додаємо колонку completed (ігнорує помилку, якщо вже є)
  try {
    await db.execAsync(`
      ALTER TABLE todo ADD COLUMN completed INTEGER NOT NULL DEFAULT 0;
    `);
  } catch (e) {
    // нічого не робимо — колонка вже існує
  }

  // Оновлюємо версію бази
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
// 🔹 CRUD

export async function getItems(db: SQLiteDatabase): Promise<ToDoItem[]> {
  const result = await db.getAllAsync<any>("SELECT * FROM todo;");

  return result.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));
}

export async function addItem(
  db: SQLiteDatabase,
  text: string,
  priority: Priority,
  completed: boolean
): Promise<ToDoItem> {
  const date = new Date().toISOString();

  const result = await db.runAsync(
    `INSERT INTO todo (text, date, priority, completed) VALUES (?, ?, ?, ?);`,
    [text, date, priority, completed ? 1 : 0]
  );

  return {
    id: result.lastInsertRowId,
    text,
    date: new Date(date),
    priority,
    completed,
  };
}

export async function deleteItem(db: SQLiteDatabase, id: number) {
  await db.runAsync(`DELETE FROM todo WHERE id = ?;`, [id]);
}
export async function toggleItem(db: SQLiteDatabase, id: number, completed: boolean) {
  await db.runAsync(`UPDATE todo SET completed = ? WHERE id = ?;`, [
    completed ? 1 : 0,
    id,
  ]);
}
export async function updateItem(db: SQLiteDatabase, item: ToDoItem) {
  await db.runAsync(
    `UPDATE todo SET text = ?, date = ?, priority = ?, completed = ? WHERE id = ?;`,
    [
      item.text,
      item.date.toISOString(),
      item.priority,
      item.completed ? 1 : 0,
      item.id,
    ]
  );
}