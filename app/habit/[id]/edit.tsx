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
  const [category, setCategory] = useState(habit.category);
  const [date, setDate] = useState(habit.date);

  const saveChanges = () => {
    setHabits(
      habits.map(h =>
        h.id === Number(id)
          ? { ...h, name, category, date }
          : h
      )
    );
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput value={name} onChangeText={setName}/>
      <TextInput value={category} onChangeText={setCategory}/>
      <TextInput value={date} onChangeText={setDate} />

      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
}