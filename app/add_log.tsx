import FormField from '@/components/ui/form-field';
import { db } from '@/db/client';
import { habit_logs as habitLogsTable } from '@/db/schema';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, View } from 'react-native';
import { HabitLogContext } from './_layout';

export default function AddLog() {
  const router = useRouter();
  const context = useContext(HabitLogContext);
  const {habitId} = useLocalSearchParams<{ habitId: string }>();

  if (!context) return null;

  const { setHabitLogs } = context;

  const [selectedHabitId, setSelectedHabitId] =useState(habitId || '1');
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
        <FormField label="Habit ID" value={selectedHabitId} onChangeText={setSelectedHabitId} keyboardType="numeric"/>
        <FormField label="Count" value={count} onChangeText={setCount} keyboardType="numeric"/>
        <FormField label="Notes (optional)" value={notes} onChangeText={setNotes}/>

      <Button title="Log Habit" onPress={saveLog} />
    </View>
  );
}