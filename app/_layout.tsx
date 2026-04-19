import { db } from '@/db/client';
import { categories as categoriesTable, habit_logs as habitLogsTable, habits as habitsTable, targets as targetsTable } from '@/db/schema';
import { seed } from '@/db/seed';
import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';


export type Habit = {
  id: number;
  user_id: number;
  category_id: number;
  name: string;
  created_at: string;
  notes:string | null;
};

export type Category = {
  id: number;
  user_id: number;
  name: string;
  colour: string;
  icon: string;
};

export type HabitLog = {
  id: number;
  habit_id: number;
  date: string;
  count: number;
  notes: string | null;
};

export type Target = {
  id: number;
  user_id: number;
  habit_id: number;
  period: string;
  goal: number;
};

type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

type CategoryContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

type HabitLogContextType = {
  habitLogs: HabitLog[];
  setHabitLogs: React.Dispatch<React.SetStateAction<HabitLog[]>>;
};

type TargetContextType = {
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
};

export const HabitContext = createContext<HabitContextType | null>(null);
export const CategoryContext = createContext<CategoryContextType | null>(null);
export const HabitLogContext = createContext<HabitLogContextType | null>(null);
export const TargetContext = createContext<TargetContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await seed();
      const habitRows = await db.select().from (habitsTable);
      const categoryRows = await db.select().from(categoriesTable);
      const habitLogRows = await db.select().from(habitLogsTable);
      const targetRows = await db.select().from(targetsTable);
      setHabits(habitRows);
      setCategories(categoryRows);
      setHabitLogs(habitLogRows);
      setTargets(targetRows);
    };
    void loadData();
  }, []);

  return (
    <HabitContext.Provider value={{ habits, setHabits }}>
      <CategoryContext.Provider value={{ categories, setCategories}}>
        <HabitLogContext.Provider value={{ habitLogs, setHabitLogs}}>
          <TargetContext.Provider value={{ targets, setTargets }}>
            <Stack />
          </TargetContext.Provider>
        </HabitLogContext.Provider>
      </CategoryContext.Provider>
    </HabitContext.Provider>
  );
}