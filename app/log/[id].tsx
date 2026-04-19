import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habit_logs as habitLogsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { HabitLog, HabitLogContext } from '../_layout';

export default function LogDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitLogContext);

  if (!context) return null;

  const { habitLogs, setHabitLogs } = context;

  const log = habitLogs.find((l: HabitLog) => l.id === Number(id));
  if (!log) return null;

  const deleteLog = async () => {
    await db.delete(habitLogsTable).where(eq(habitLogsTable.id, Number(id)));
    const rows = await db.select().from(habitLogsTable);
    setHabitLogs(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Habit Log</Text>
      <Text>Habit ID: {log.habit_id}</Text>
      <Text>Date: {log.date}</Text>
      <Text>Count: {log.count}</Text>
      {log.notes && <Text>Notes: {log.notes}</Text>}

      <Button
        title="Edit"
        onPress={() =>
          router.push({ pathname: '../log/[id]/edit', params: { id } })
        }
      />
      <PrimaryButton label="Delete" variant="danger" onPress={deleteLog} />
      <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()} />
    </View>
  );
}