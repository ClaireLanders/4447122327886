import type { HabitLog, Target } from '@/app/_layout';

function getPeriodStart(period: string, date: Date): Date {
  if (period === 'daily') {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  if (period === 'weekly') {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === 'monthly') {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  return new Date(date);
}

function shiftPeriod(period: string, date: Date, amount: number): Date {
  const d = new Date(date);
  if (period === 'daily') d.setDate(d.getDate() + amount);
  else if (period === 'weekly') d.setDate(d.getDate() + amount * 7);
  else if (period === 'monthly') d.setMonth(d.getMonth() + amount);
  return d;
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function calculateStreak(target: Target, logs: HabitLog[]): number {
  const relevantLogs = logs.filter((l) => l.habit_id === target.habit_id);
  if (relevantLogs.length === 0) return 0;

  let streak = 0;
  let periodStart = getPeriodStart(target.period, new Date());

  while (true) {
    const periodEnd = shiftPeriod(target.period, periodStart, 1);
    const startStr = toDateStr(periodStart);
    const endStr = toDateStr(periodEnd);

    const periodTotal = relevantLogs
      .filter((l) => l.date >= startStr && l.date < endStr)
      .reduce((sum, l) => sum + l.count, 0);

    if (periodTotal >= target.goal) {
      streak++;
      periodStart = shiftPeriod(target.period, periodStart, -1);
    } else {
      break;
    }
  }

  return streak;
}