import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { Habit, HabitContext } from '../../_layout';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { habits, setHabits } = context;

  const habit = habits.find((h: Habit) => h.id === Number(id));
  if (!habit) return null;

  const [name, setName] = useState(habit.name);
  const [notes, setNotes] = useState(habit.notes || '');

  const saveChanges = async() => {
    await db.update(habitsTable)
    .set({name, notes:notes || null})
    .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
  };


  return (
    <View style={{ padding: 20 }}>
      <TextInput value={name} onChangeText={setName}/>
      <TextInput value={notes} onChangeText={setNotes}/>


      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
}