import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Target, TargetContext } from '../../_layout';

export default function EditTarget() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TargetContext);

  if (!context) return null;

  const { targets, setTargets } = context;

  const target = targets.find((t: Target) => t.id === Number(id));
  if (!target) return null;

  const [period, setPeriod] = useState(target.period);
  const [goal, setGoal] = useState(String(target.goal));

  const saveChanges = async () => {
    await db.update(targetsTable)
      .set({ period, goal: Number(goal) || 0 })
      .where(eq(targetsTable.id, Number(id)));

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput value={period} onChangeText={setPeriod} placeholder="Period (weekly or monthly)"
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
      <TextInput value={goal} onChangeText={setGoal} placeholder="Goal"
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
    </View>
  );
}