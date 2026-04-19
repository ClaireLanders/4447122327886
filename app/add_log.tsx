import { db } from '@/db/client';
import { habit_logs as habitLogsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { HabitLogContext } from './_layout';

export default function AddLog() {
  const router = useRouter();
  const context = useContext(HabitLogContext);

  if (!context) return null;

  const { setHabitLogs } = context;

  const [habitId, setHabitId] =useState('1');
  const [count, setCount] = useState('1');
  const [notes, setNotes] = useState('');

  const saveLog = async () => {
    await db.insert(habitLogsTable).values({
      habit_id: Number(habitId) || 1,
      date: new Date().toISOString().split('T')[0],
      count: Number(count) || 0,
      notes: notes || null,
    });

    const rows = await db.select().from(habitLogsTable);
    setHabitLogs(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
        <TextInput placeholder="Habit ID" value={habitId} onChangeText={setHabitId}
        keyboardType="numeric" style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
        <TextInput placeholder="Count" value={count} onChangeText={setCount}
        keyboardType="numeric" style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
        <TextInput placeholder="Notes (optional)" value={notes} onChangeText={setNotes}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />

      <Button title="Log Habit" onPress={saveLog} />
    </View>
  );
}