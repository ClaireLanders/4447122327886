import FormField from '@/components/ui/form-field';
import HabitSelector from '@/components/ui/habit-selector';
import { db } from '@/db/client';
import { habit_logs as habitLogsTable } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthContext, Habit, HabitContext, HabitLogContext } from './_layout';

export default function AddLog() {
  const router = useRouter();
  const logContext = useContext(HabitLogContext);
  const habitContext = useContext(HabitContext);
  const auth = useContext(AuthContext);
  const { habitId: paramHabitId } = useLocalSearchParams<{ habitId: string }>();

  if (!logContext || !habitContext || auth?.currentUserId == null) return null;

  const { setHabitLogs } = logContext;
  const { habits } = habitContext;

  const initialHabit = paramHabitId
    ? Number(paramHabitId)
    : habits[0]?.id ?? null;

  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(initialHabit);
  const [count, setCount] = useState('1');
  const [notes, setNotes] = useState('');

  const saveLog = async () => {
    if (selectedHabitId === null) return;

    await db.insert(habitLogsTable).values({
      habit_id: selectedHabitId,
      date: new Date().toISOString().split('T')[0],
      count: Number(count) || 0,
      notes: notes || null,
    });

    const userHabitIds = habits.map((h: Habit) => h.id);
    const rows = userHabitIds.length > 0
      ? await db.select().from(habitLogsTable).where(inArray(habitLogsTable.habit_id, userHabitIds))
      : [];
    setHabitLogs(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.label}>Habit</Text>
        <HabitSelector
          habits={habits}
          selectedId={selectedHabitId}
          onSelect={setSelectedHabitId}
        />
      {habits.length === 0 && (
        <Text style={styles.hint}>You have no habits yet. Add one before logging.</Text>
      )}

      <FormField label="Count" value={count} onChangeText={setCount} keyboardType="numeric" />
      <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} />

      <Button title="Log Habit" onPress={saveLog} disabled={selectedHabitId === null} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
 
  hint: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
  },
});