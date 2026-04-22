import { db } from '@/db/client';
import { categories as categoriesTable, habit_logs as habitLogsTable, habits as habitsTable, targets as targetsTable } from '@/db/schema';
import { seed } from '@/db/seed';
import { loadSession } from '@/lib/auth';
import { eq, inArray } from 'drizzle-orm';
import { Stack, useRouter, useSegments } from 'expo-router';
import { createContext, useEffect, useState } from 'react';


export type Habit = {
  id: number;
  user_id: number;
  category_id: number;
  name: string;
  created_at: string;
  notes: string | null;
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

type AuthContextType = {
  currentUserId: number | null;
  setCurrentUserId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const HabitContext = createContext<HabitContextType | null>(null);
export const CategoryContext = createContext<CategoryContextType | null>(null);
export const HabitLogContext = createContext<HabitLogContextType | null>(null);
export const TargetContext = createContext<TargetContextType | null>(null);
export const AuthContext = createContext<AuthContextType | null>(null);

export default function RootLayout() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const init = async () => {
      await seed();
      const userId = await loadSession();
      setCurrentUserId(userId);
      setAuthLoaded(true);
    };
    void init();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUserId === null) {
        setHabits([]);
        setCategories([]);
        setHabitLogs([]);
        setTargets([]);
        return;
      }
      const habitRows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, currentUserId));
      const categoryRows = await db.select().from(categoriesTable).where(eq(categoriesTable.user_id, currentUserId));
      const targetRows = await db.select().from(targetsTable).where(eq(targetsTable.user_id, currentUserId));
      const userHabitIds = habitRows.map(h => h.id);
      const habitLogRows = userHabitIds.length > 0
        ? await db.select().from(habitLogsTable).where(inArray(habitLogsTable.habit_id, userHabitIds))
        : [];
      setHabits(habitRows);
      setCategories(categoryRows);
      setHabitLogs(habitLogRows);
      setTargets(targetRows);
    };
    void loadUserData();
  }, [currentUserId]);

  useEffect(() => {
    if (!authLoaded) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
    if (currentUserId === null && !inAuthGroup) {
      router.replace('/login');
    } else if (currentUserId !== null && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [authLoaded, currentUserId, segments]);

  return (
    <AuthContext.Provider value={{ currentUserId, setCurrentUserId }}>
      <HabitContext.Provider value={{ habits, setHabits }}>
        <CategoryContext.Provider value={{ categories, setCategories}}>
          <HabitLogContext.Provider value={{ habitLogs, setHabitLogs}}>
            <TargetContext.Provider value={{ targets, setTargets }}>
              <Stack screenOptions={{ headerShown: false}} />
            </TargetContext.Provider>
          </HabitLogContext.Provider>
        </CategoryContext.Provider>
      </HabitContext.Provider>
    </AuthContext.Provider>
  );
}