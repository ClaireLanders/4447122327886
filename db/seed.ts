import { hashPassword } from '@/lib/auth';
import { count } from 'drizzle-orm';
import { db } from './client';
import { categories, habit_logs, habits, targets, users } from './schema';

export async function seed() {
  // Check if data already exists
  const existingUsers = await db.select({ value: count() }).from(users);
  if (existingUsers[0].value > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  console.log('Seeding database...');

  // --- Users ---

const sarahHash = await hashPassword('password123');
const mikeHash = await hashPassword('password123');

  await db.insert(users).values([
    { username: 'sarah_j', password_hash: sarahHash, created_at: '2025-03-01T10:00:00Z', fname: 'Sarah', lname: 'Johnson' },
    { username: 'mike_r', password_hash: mikeHash, created_at: '2025-03-05T14:30:00Z', fname: 'Mike', lname: 'Rivera' },
  ]);
  const insertedUsers = await db.select().from(users);

  const sarahId = insertedUsers[0].id;
  const mikeId = insertedUsers[1].id;

  // --- Categories ---
  await db.insert(categories).values([
    { user_id: sarahId, name: 'Health', colour: '#4CAF50', icon: 'heart-pulse' },
    { user_id: sarahId, name: 'Fitness', colour: '#FF5722', icon: 'dumbbell' },
    { user_id: sarahId, name: 'Mindfulness', colour: '#9C27B0', icon: 'brain' },
    { user_id: mikeId, name: 'Productivity', colour: '#2196F3', icon: 'rocket' },
    { user_id: mikeId, name: 'Wellness', colour: '#FF9800', icon: 'leaf' },
  ]);
  const insertedCategories = await db.select().from(categories);

  const [catHealth, catFitness, catMindfulness, catProductivity, catWellness] = insertedCategories;

  // --- Habits ---
  await db.insert(habits).values([
    { user_id: sarahId, category_id: catHealth.id, name: 'Drink 8 glasses of water', created_at: '2025-03-02T08:00:00Z', notes: 'Stay hydrated throughout the day' },
    { user_id: sarahId, category_id: catHealth.id, name: 'Take vitamins', created_at: '2025-03-02T08:00:00Z', notes: null },
    { user_id: sarahId, category_id: catFitness.id, name: 'Morning run', created_at: '2025-03-03T07:00:00Z', notes: 'At least 3km' },
    { user_id: sarahId, category_id: catMindfulness.id, name: 'Meditate', created_at: '2025-03-03T07:30:00Z', notes: '10 minutes minimum' },
    { user_id: mikeId, category_id: catProductivity.id, name: 'Read 30 minutes', created_at: '2025-03-06T09:00:00Z', notes: 'Non-fiction preferred' },
    { user_id: mikeId, category_id: catProductivity.id, name: 'No phone before 9am', created_at: '2025-03-06T09:00:00Z', notes: null },
    { user_id: mikeId, category_id: catWellness.id, name: 'Sleep by 11pm', created_at: '2025-03-07T20:00:00Z', notes: 'Wind down at 10:30' },
    { user_id: mikeId, category_id: catWellness.id, name: 'Walk 10k steps', created_at: '2025-03-07T08:00:00Z', notes: null },
  ]);
  const insertedHabits = await db.select().from(habits);

  const [hWater, hVitamins, hRun, hMeditate, hRead, hNoPhone, hSleep, hWalk] = insertedHabits;

  // --- Habit Logs ---
  // Generate dates for the past 4 weeks
  const today = new Date();
  const dateStr = (daysAgo: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const habitLogValues: { habit_id: number; date: string; count: number; notes: string | null }[] = [];

  // Sarah's water habit — mostly consistent, some misses
  for (let i = 0; i < 28; i++) {
    if (i === 5 || i === 12 || i === 20) continue; // skipped days
    habitLogValues.push({ habit_id: hWater.id, date: dateStr(i), count: i % 7 === 0 ? 6 : 8, notes: null });
  }

  // Sarah's vitamins — very consistent
  for (let i = 0; i < 28; i++) {
    if (i === 9) continue;
    habitLogValues.push({ habit_id: hVitamins.id, date: dateStr(i), count: 1, notes: null });
  }

  // Sarah's run — 3-4 times a week
  for (let i = 0; i < 28; i++) {
    const dayOfWeek = new Date(today.getTime() - i * 86400000).getDay();
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5 || (dayOfWeek === 6 && i % 2 === 0)) {
      habitLogValues.push({ habit_id: hRun.id, date: dateStr(i), count: 1, notes: i === 2 ? 'New personal best — 5km!' : null });
    }
  }

  // Sarah's meditation — building up over time
  for (let i = 0; i < 21; i++) {
    if (i === 4 || i === 11 || i === 15 || i === 18) continue;
    habitLogValues.push({ habit_id: hMeditate.id, date: dateStr(i), count: 1, notes: null });
  }

  // Mike's reading — fairly consistent
  for (let i = 0; i < 25; i++) {
    if (i === 3 || i === 7 || i === 14 || i === 19) continue;
    habitLogValues.push({ habit_id: hRead.id, date: dateStr(i), count: 1, notes: i === 0 ? 'Finished Atomic Habits' : null });
  }

  // Mike's no-phone — struggles early on, improves
  for (let i = 0; i < 25; i++) {
    const succeeded = i < 10 ? (i % 3 !== 0) : (i % 5 !== 0);
    if (succeeded) {
      habitLogValues.push({ habit_id: hNoPhone.id, date: dateStr(i), count: 1, notes: null });
    }
  }

  // Mike's sleep — weekend misses
  for (let i = 0; i < 25; i++) {
    const dayOfWeek = new Date(today.getTime() - i * 86400000).getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) continue; // misses Fri/Sat
    habitLogValues.push({ habit_id: hSleep.id, date: dateStr(i), count: 1, notes: null });
  }

  // Mike's walk — most days
  for (let i = 0; i < 25; i++) {
    if (i === 6 || i === 13 || i === 22) continue;
    const steps = 8000 + Math.floor(Math.abs(Math.sin(i * 2.7)) * 6000);
    habitLogValues.push({ habit_id: hWalk.id, date: dateStr(i), count: steps, notes: null });
  }

  await db.insert(habit_logs).values(habitLogValues);

  // --- Targets ---
  await db.insert(targets).values([
    { user_id: sarahId, habit_id: hWater.id, period: 'daily', goal: 8 },
    { user_id: sarahId, habit_id: hRun.id, period: 'weekly', goal: 4 },
    { user_id: sarahId, habit_id: hMeditate.id, period: 'weekly', goal: 5 },
    { user_id: mikeId, habit_id: hRead.id, period: 'monthly', goal: 25 },
    { user_id: mikeId, habit_id: hWalk.id, period: 'daily', goal: 10000 },
  ]);

  console.log('Database seeded successfully.');
}