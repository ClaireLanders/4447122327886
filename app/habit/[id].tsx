import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { Habit, HabitContext } from '../_layout';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { habits, setHabits } = context;

  const habit = habits.find((h: Habit) => h.id === Number(id));
  if (!habit) return null;

  const deleteHabit = async () => {
    await db.delete(habitsTable).where(eq(habitsTable.id, Number(id)));
    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{habit.name}</Text>
      <Text>Category ID: {habit.category_id}</Text>
      <Text>Created: {habit.created_at}</Text>
      {habit.notes && <Text>Notes: {habit.notes}</Text>}
      

      <Button
        title="Edit"
        onPress={() =>
          router.push({
            pathname: '../habit/[id]/edit',
            params: { id }
          })
        }
      />
      <Button title="Delete" onPress={deleteHabit} />
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}