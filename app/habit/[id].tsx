import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { AuthContext, Habit, HabitContext } from '../_layout';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  const auth = useContext(AuthContext);

  if (!context || auth?.currentUserId == null) return null;

  const { habits, setHabits } = context;
  const userId = auth.currentUserId;

  const habit = habits.find((h: Habit) => h.id === Number(id));
  if (!habit) return null;

  const deleteHabit = async () => {
    await db.delete(habitsTable).where(eq(habitsTable.id, Number(id)));
    const rows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, userId));
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
      <PrimaryButton label="Delete" variant="danger" onPress={deleteHabit} />
      <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()} />
    </View>
  );
}