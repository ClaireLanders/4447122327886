import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { View } from 'react-native';
import { AuthContext, Habit, HabitContext } from '../../_layout';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  const auth = useContext(AuthContext);

  if (!context || auth?.currentUserId == null) return null;

  const { habits, setHabits } = context;
  const userId = auth.currentUserId;

  const habit = habits.find((h: Habit) => h.id === Number(id));
  if (!habit) return null;

  const [name, setName] = useState(habit.name);
  const [notes, setNotes] = useState(habit.notes || '');

  const saveChanges = async () => {
    await db.update(habitsTable)
      .set({ name, notes: notes || null })
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, userId));
    setHabits(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField label="Habit Name" value={name} onChangeText={setName} />
      <FormField label="Habit Notes" value={notes} onChangeText={setNotes} />

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
    </View>
  );
}