import FormField from '@/components/ui/form-field';
import { db } from '@/db/client';
import { habit_logs as habitLogsTable } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.habitRow}>
        {habits.map((habit: Habit) => {
          const isSelected = selectedHabitId === habit.id;
          return (
            <Pressable
              key={habit.id}
              accessibilityLabel={`Select habit ${habit.name}`}
              accessibilityRole="button"
              onPress={() => setSelectedHabitId(habit.id)}
              style={[styles.habitChip, isSelected && styles.habitChipSelected]}
            >
              <Text style={[styles.habitText, isSelected && styles.habitTextSelected]}>
                {habit.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
  habitRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  habitChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 2,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  habitChipSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  habitText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  habitTextSelected: {
    color: '#FFFFFF',
  },
  hint: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
  },
});