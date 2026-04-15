import { Stack } from 'expo-router';
import { createContext, useState } from 'react';

export type Habit = {
  id: number;
  name: string;
  category: string;
  date: string;
  count: number;
};

type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export const HabitContext = createContext<HabitContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: 'Morning Run', category: 'Fitness', date: '2026-04-08', count: 0 },
    { id: 2, name: 'Meditation', category: 'Mindfulness', date: '2026-04-09', count: 0 },
    { id: 3, name: 'Read a Book', category: 'Learning', date: '2026-04-10', count: 0 },
  ]);

  return (
    <HabitContext.Provider value={{ habits, setHabits }}>
      <Stack />
    </HabitContext.Provider>
  );
}