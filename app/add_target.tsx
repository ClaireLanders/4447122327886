import FormField from '@/components/ui/form-field';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthContext, Habit, HabitContext, TargetContext } from './_layout';

export default function AddTarget() {
  const router = useRouter();
  const targetContext = useContext(TargetContext);
  const habitContext = useContext(HabitContext);
  const auth = useContext(AuthContext);

  if (!targetContext || !habitContext || auth?.currentUserId == null) return null;

  const { setTargets } = targetContext;
  const { habits } = habitContext;
  const userId = auth.currentUserId;

  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(habits[0]?.id ?? null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [goal, setGoal] = useState('');

  const saveTarget = async () => {
    if (!goal.trim() || selectedHabitId === null) return;

    await db.insert(targetsTable).values({
      user_id: userId,
      habit_id: selectedHabitId,
      period,
      goal: Number(goal) || 0,
    });

    const rows = await db.select().from(targetsTable).where(eq(targetsTable.user_id, userId));
    setTargets(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.label}>Habit</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {habits.map((habit: Habit) => {
          const isSelected = selectedHabitId === habit.id;
          return (
            <Pressable
              key={habit.id}
              accessibilityLabel={`Select habit ${habit.name}`}
              accessibilityRole="button"
              onPress={() => setSelectedHabitId(habit.id)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {habit.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {habits.length === 0 && (
        <Text style={styles.hint}>You have no habits yet. Add one before creating a target.</Text>
      )}

      <Text style={styles.label}>Period</Text>
      <View style={styles.row}>
        {(['daily', 'weekly', 'monthly'] as const).map((p) => {
          const isSelected = period === p;
          return (
            <Pressable
              key={p}
              accessibilityLabel={`Period ${p}`}
              accessibilityRole="button"
              onPress={() => setPeriod(p)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{p}</Text>
            </Pressable>
          );
        })}
      </View>

      <FormField label="Goal" value={goal} onChangeText={setGoal} keyboardType="numeric" />

      <Button
        title="Save Target"
        onPress={saveTarget}
        disabled={!goal.trim() || selectedHabitId === null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 2,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  chipText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  hint: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
  },
});