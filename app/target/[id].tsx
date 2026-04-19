import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { Target, TargetContext } from '../_layout';

export default function TargetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TargetContext);

  if (!context) return null;

  const { targets, setTargets } = context;

  const target = targets.find((t: Target) => t.id === Number(id));
  if (!target) return null;

  const deleteTarget = async () => {
    await db.delete(targetsTable).where(eq(targetsTable.id, Number(id)));
    const rows = await db.select().from(targetsTable);
    setTargets(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Target</Text>
      <Text>Habit ID: {target.habit_id}</Text>
      <Text>Period: {target.period}</Text>
      <Text>Goal: {target.goal}</Text>

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