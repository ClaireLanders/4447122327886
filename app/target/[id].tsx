import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { Habit, HabitContext, HabitLog, HabitLogContext, Target, TargetContext } from '../_layout';

export default function TargetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TargetContext);
  const habitContext = useContext(HabitContext);
  const logContext = useContext(HabitLogContext);

  if (!context) return null;

  const { targets, setTargets } = context;

  const target = targets.find((t: Target) => t.id === Number(id));
  if (!target) return null;

  const habitName = habitContext?.habits.find(
    (h: Habit) => h.id === target.habit_id)?.name;

  // Calculating  progress from logs, by calculating the start of the current period
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let startDate = todayStr;
  if(target.period ==='weekly'){
    const d = new Date(today);
    // Getting Monday of the current week
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    startDate = d.toISOString().split('T')[0];
  }else if (target.period == 'monthly'){
    // getting first day of current month
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate = d.toISOString().split('T')[0];
  }

  const relevantLogs = logContext?.habitLogs.filter(
    (log: HabitLog) =>
        log.habit_id === target.habit_id &&
        log.date >= startDate &&
        log.date <= todayStr
  ) || [];

  const progress = relevantLogs.reduce((sum,log) => sum + log.count, 0);
  const remaining = target.goal - progress;
  const met = progress >= target.goal;
  const percentage = target.goal > 0 ? Math.round((progress / target.goal) * 100): 0;

  const deleteTarget = async () => {
    await db.delete(targetsTable).where(eq(targetsTable.id, Number(id)));
    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Target</Text>
      <Text>Habit: {habitName}</Text>
      <Text>Period: {target.period}</Text>
      <Text>Goal: {target.goal}</Text>
      <Text>Progress: {progress} / {target.goal} ({percentage}%)</Text>
      <Text style={{ color: progress > target.goal ? '#DAA520' : met ? 'green' : 'red' }}>
      { progress > target.goal
        ? 'Target Exceeded! (+${progress-taget.goal} over)'
        : met? 'Target met!'
        : '${remaining} remaining'}   
       </Text>
      <Button
        title="Edit"
        onPress={() =>
          router.push({ pathname: '../target/[id]/edit', params: { id } })
        }
      />
      <Button title="Delete" onPress={deleteTarget} />
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}