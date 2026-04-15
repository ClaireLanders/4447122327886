import HabitCard from '@/components/HabitCard';
import { useState } from 'react';
import { Button, ScrollView, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

    const removeHabit = (id: number) => {
      setHabits(prev => prev.filter(habit => habit.id !== id));
  };

    const resetAll = () => {
      setHabits(prev =>
        prev.map(habit => ({ ...habit, count: 0 }))
    );
  };

  const total = habits.reduce((sum, h) => sum + h.count, 0);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const saveHabit = () => {
    if (!name.trim()) return;

    if (editingId) {
      setHabits(prev =>
        prev.map(habit =>
          habit.id === editingId
            ? { ...habit, name, category, date }
            : habit
        )
      );
      setEditingId(null);
    } else {
      const newHabit = {
        id: Date.now(),
        name,
        category,
        date,
        count: 0,
      };
      setHabits(prev => [...prev, newHabit]);
    }

    setName('');
    setCategory('');
    setDate('');
  };

  const [editingId, setEditingId] = useState<number | null>(null);


return (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Total: {total}</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}
      />
      <Button
        title={editingId ? "Save Changes" : "Add Habit"}
        onPress={saveHabit}
        disabled={!name.trim()}
      />
      <Button title="Reset All" onPress={resetAll} />
      {habits.length === 0 ? (
        <Text>No habits added yet.</Text>
      ) : (
        habits.map(habit => (
          <HabitCard
            key={habit.id}
            {...habit}
            onUpdate={updateCount}
            onRemove={removeHabit}
            onEdit={(id) => {
              const habit = habits.find(h => h.id === id);
              if (!habit) return;

              setEditingId(id);
              setName(habit.name);
              setCategory(habit.category);
              setDate(habit.date);
            }}
          />
        ))
      )}

    </ScrollView>
</SafeAreaView>
);
}