import { Stack } from 'expo-router';
import { createContext, useState } from 'react';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { seed } from '@/db/seed';

export type Habit = {
  id: number;
  user_id: number;
  category_id: number;
  name: string;
  category: string;
  created_at: string;
  notes:string;

};

type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export const HabitContext = createContext<HabitContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadHabits = async () => {
      await seed();
      const rows = await db.select().from habitsTable);
      setHabits(rows);
    };
    void loadHabits();
  }, []);

  return (
    <HabitContext.Provider value={{ habits, setHabits }}>
      <Stack />
    </HabitContext.Provider>
  );
}