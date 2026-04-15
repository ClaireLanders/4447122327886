import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  password_hash: text('password_hash').notNull(),
  created_at: text('created_at').notNull(),
  fname: text('fname').notNull(),
  lname: text('lname').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  colour: text('colour').notNull(),
  icon: text('icon').notNull(),
});

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull().references(() => users.id),
  category_id: integer('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(),
  created_at: text('created_at').notNull(),
  notes: text('notes'),
});

export const habit_logs = sqliteTable('habit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habit_id: integer('habit_id').notNull().references(() => habits.id),
  date: text('date').notNull(),
  count: integer('count').notNull().default(0),
  notes: text('notes'),
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').notNull().references(() => users.id),
  habit_id: integer('habit_id').notNull().references(() => habits.id),
  period: text('period').notNull(),
  goal: integer('goal').notNull(),
});