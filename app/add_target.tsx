import FormField from '@/components/ui/form-field';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, View } from 'react-native';
import { TargetContext } from './_layout';

export default function AddTarget() {
  const router = useRouter();
  const context = useContext(TargetContext);

  if (!context) return null;

  const { setTargets } = context;

  const [habitId, setHabitId] = useState('1');
  const [period, setPeriod] = useState('weekly');
  const [goal, setGoal] = useState('');

  const saveTarget = async () => {
    if (!goal.trim()) return;

    await db.insert(targetsTable).values({
      user_id: 1,
      habit_id: Number(habitId) || 1,
      period,
      goal: Number(goal) || 0,
    });

    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField label="Habit ID" value={habitId} onChangeText={setHabitId} keyboardType="numeric" />
      <FormField label="Period (weekly or monthly)" value={period} onChangeText={setPeriod}/>
      <FormField label="Goal" value={goal} onChangeText={setGoal} keyboardType="numeric"/>

      <Button title="Save Target" onPress={saveTarget} disabled={!goal.trim()} />
    </View>
  );
}