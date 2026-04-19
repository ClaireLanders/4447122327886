import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habit_logs as habitLogsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { View } from 'react-native';
import { HabitLog, HabitLogContext } from '../../_layout';

export default function EditLog() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitLogContext);

  if (!context) return null;

  const { habitLogs, setHabitLogs } = context;

  const log = habitLogs.find((l: HabitLog) => l.id === Number(id));
  if (!log) return null;

  const [count, setCount] = useState(String(log.count));
  const [notes, setNotes] = useState(log.notes || '');

  const saveChanges = async () => {
    await db.update(habitLogsTable)
      .set({ count: Number(count) || 0, notes: notes || null })
      .where(eq(habitLogsTable.id, Number(id)));

    const rows = await db.select().from(habitLogsTable);
    setHabitLogs(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField label="Log Count" value={count} onChangeText={setCount} placeholder="Count" keyboardType="numeric"/>
      <FormField label="Log Notes" value={notes} onChangeText={setNotes} placeholder="Notes (optional)"/>

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
    </View>
  );
}