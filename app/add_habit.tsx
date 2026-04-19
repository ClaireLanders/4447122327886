import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { HabitContext } from './_layout';


export default function AddHabit() {
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { setHabits } = context;

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const saveHabit = async() => {
    if(!name.trim()) return;

    await db.insert(habitsTable).values({
        user_id: 1,
        category_id: 1,
        name,
        // Getting today's date as an ISO string for SQLite text column
        created_at: new Date().toISOString().split('T')[0],
        notes: notes || null,

    });

    const rows = await db.select().from(habitsTable);
    setHabits(rows);
    router.back();
    };



  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Habit Name" value={name} onChangeText={setName}/>
      <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes}/>
   
      <Button title="Save" onPress={saveHabit} disabled={!name.trim()} />
    </View>
  );
}