import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { View } from 'react-native';
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
      <FormField label="Period" value={period} onChangeText={setPeriod} placeholder="Period (weekly or monthly)"/>
      <FormField label= "Goal" value={goal} onChangeText={setGoal} placeholder="Goal"keyboardType="numeric"/>

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
    </View>
  );
}