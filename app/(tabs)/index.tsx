import HabitCard from '@/components/HabitCard';
import { useState } from 'react';
import { View } from 'react-native';


export default function IndexScreen() {
  const [habits] = useState([
    { id: 1, name: 'Morning Run', category: 'Fitness', date: '2026-04-08', count: 0 },
    { id: 2, name: 'Meditation', category: 'Mindfulness', date: '2026-04-09', count: 0 },
    { id: 3, name: 'Read a Book', category: 'Learning', date: '2026-04-10', count: 0 },
  ]);

return (
  <View style={{ padding: 20 }}>
    {habits.map(habit =>(
      <HabitCard
      key={habit.id}
      name={habit.name}
      category={habit.category}
      date={habit.date}
      /> 
    ))}
  </View>
);
}