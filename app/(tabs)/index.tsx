import HabitCard from '@/components/HabitCard';
import { useState } from 'react';
import { View } from 'react-native';

type Habit ={
  id: number;
  name: string;
  category: string;
  date: string;
  count: number;
}

export default function IndexScreen() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: 'Morning Run', category: 'Fitness', date: '2026-04-08', count: 0 },
    { id: 2, name: 'Meditation', category: 'Mindfulness', date: '2026-04-09', count: 0 },
    { id: 3, name: 'Read a Book', category: 'Learning', date: '2026-04-10', count: 0 },
  ]);

  const updateCount = (id: number, delta: number) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === id
          ? { ...habit, count: habit.count + delta }
          : habit
      )
    );
  };


return (
  <View style={{ padding: 20 }}>
    {habits.map(habit =>(
      <HabitCard
      key={habit.id}
      {...habit}
      onUpdate={updateCount}
      /> 
    ))}
  </View>
);
}