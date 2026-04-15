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

  const deleteHabit = () => {
    setHabits(habits.filter(h => h.id !== Number(id)));
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{habit.name}</Text>
      <Text>Category: {habit.category}</Text>
      <Text>Date: {habit.date}</Text>
      <Text>Count: {habit.count}</Text>

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