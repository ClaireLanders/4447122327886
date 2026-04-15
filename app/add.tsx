import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { HabitContext } from './_layout';

export default function AddHabit() {
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { habits, setHabits } = context;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const saveHabit = () => {
    const newHabit = {
      id: Date.now(),
      name,
      category,
      date,
      count: 0,
    };

    setHabits([...habits, newHabit]);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
      <TextInput placeholder="Date" value={date} onChangeText={setDate}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />

      <Button title="Save" onPress={saveHabit} disabled={!name.trim()} />
    </View>
  );
}