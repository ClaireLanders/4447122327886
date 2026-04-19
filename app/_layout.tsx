import { db } from '@/db/client';
import { categories as categoriesTable, habits as habitsTable } from '@/db/schema';
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

type HabitContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

type CategoryContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const HabitContext = createContext<HabitContextType | null>(null);
export const CategoryContext = createContext<CategoryContextType | null>(null);


export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await seed();
      const habitRows = await db.select().from (habitsTable);
      const categoryRows = await db.select().from(categoriesTable);
      setHabits(habitRows);
      setCategories(categoryRows);
    };
    void loadData();
  }, []);

  return (
    <HabitContext.Provider value={{ habits, setHabits }}>
      <CategoryContext.Provider value={{ categories, setCategories}}>
      <Stack />
      </CategoryContext.Provider>
    </HabitContext.Provider>
  );
}