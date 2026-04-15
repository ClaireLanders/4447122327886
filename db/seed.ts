import { db } from './client';
import { habits } from './schema';

export async function seedHabitsIfEmpty() {
  const existing = await db.select().from(habits);
  if (existing.length > 0) return;

  await db.insert(habits).values([
    { name: 'Morning Run', category: 'Fitness', date: '2024-01-01', count: 1 },
    { name: 'Read', category: 'Learning', date: '2024-01-01', count: 2 },
    { name: 'Meal Prep', category: 'Health', date: '2024-01-02', count: 1 },
  ]);
}