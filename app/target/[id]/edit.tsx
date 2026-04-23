import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthContext, Target, TargetContext } from '../../_layout';

export default function EditTarget() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TargetContext);
  const auth = useContext(AuthContext);

  if (!context || auth?.currentUserId == null) return null;

  const { targets, setTargets } = context;
  const userId = auth.currentUserId;

  const target = targets.find((t: Target) => t.id === Number(id));
  if (!target) return null;

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>(
    target.period as 'daily' | 'weekly' | 'monthly'
  );
  const [goal, setGoal] = useState(String(target.goal));

  const saveChanges = async () => {
    if (!goal.trim()) return;

    await db.update(targetsTable)
      .set({ period, goal: Number(goal) || 0 })
      .where(eq(targetsTable.id, Number(id)));

    const rows = await db.select().from(targetsTable).where(eq(targetsTable.user_id, userId));
    setTargets(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
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

      <FormField label="Goal" value={goal} onChangeText={setGoal} placeholder="Goal" keyboardType="numeric" />

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
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
    backgroundColor: '#1E5F8A',
    borderColor: '#1E5F8A',
  },
  chipText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});