import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const sqlite = openDatabaseSync('habits.db');
sqlite.execSync(`
  CREATE TABLE IF NOT EXISTS users(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   username TEXT NOT NULL,
   password_hash TEXT NOT NULL,
   created_at TEXT NOT NULL,
   fname TEXT NOT NULL,
   lname TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS categories(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_id INTEGER,
   name TEXT NOT NULL,
   colour TEXT NOT NULL,
   icon TEXT NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
  CREATE TABLE IF NOT EXISTS habit_logs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (habit_id) REFERENCES habits(id)
  );
  CREATE TABLE IF NOT EXISTS targets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    habit_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    goal INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (habit_id) REFERENCES habits(id)
  );

`);


export const db = drizzle(sqlite);