import type { Category, Habit, HabitLog } from '@/app/_layout';
import { db } from '@/db/client';
import { categories, habit_logs, habits } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportUserDataToCSV(userId: number): Promise<void> {
  const habitRows = await db.select().from(habits).where(eq(habits.user_id, userId));
  const categoryRows = await db.select().from(categories).where(eq(categories.user_id, userId));
  const userHabitIds = habitRows.map((h: Habit) => h.id);
  const logRows = userHabitIds.length > 0
    ? await db.select().from(habit_logs).where(inArray(habit_logs.habit_id, userHabitIds))
    : [];

  const headers = ['Date', 'Habit', 'Category', 'Count', 'Notes'];
  const dataRows = logRows.map((log: HabitLog) => {
    const habit = habitRows.find((h: Habit) => h.id === log.habit_id);
    const category = categoryRows.find((c: Category) => c.id === habit?.category_id);
    return [
      log.date,
      habit?.name ?? '',
      category?.name ?? '',
      String(log.count),
      log.notes ?? '',
    ].map(escapeCSVField).join(',');
  });

  const csv = [headers.join(','), ...dataRows].join('\n');

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `habit-logs-${dateStr}.csv`;
  const fileUri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(fileUri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'text/csv',
    dialogTitle: 'Export habit logs',
    UTI: 'public.comma-separated-values-text',
  });
}