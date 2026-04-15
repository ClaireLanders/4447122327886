import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
  count: integer('count').notNull().default(0),
});