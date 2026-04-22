import { AuthContext, CategoryContext, Habit, HabitContext, HabitLogContext, TargetContext } from '@/app/_layout';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable, habit_logs as habitLogsTable, habits as habitsTable, targets as targetsTable, users } from '@/db/schema';
import { clearSession } from '@/lib/auth';
import { eq, inArray } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type UserInfo = {
  username: string;
  fname: string;
  lname: string;
  created_at: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const habitContext = useContext(HabitContext);
  const categoryContext = useContext(CategoryContext);
  const logContext = useContext(HabitLogContext);
  const targetContext = useContext(TargetContext);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (auth?.currentUserId == null) return;
      const rows = await db.select().from(users).where(eq(users.id, auth.currentUserId));
      if (rows[0]) {
        setUser({
          username: rows[0].username,
          fname: rows[0].fname,
          lname: rows[0].lname,
          created_at: rows[0].created_at,
        });
      }
    };
    void loadUser();
  }, [auth?.currentUserId]);

  const handleLogout = async () => {
    await clearSession();
    auth?.setCurrentUserId(null);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete profile',
      'This will permanently delete your account and all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (auth?.currentUserId == null) return;
            const userId = auth.currentUserId;

            const userHabits = await db.select().from(habitsTable).where(eq(habitsTable.user_id, userId));
            const userHabitIds = userHabits.map((h: Habit) => h.id);

            if (userHabitIds.length > 0) {
              await db.delete(habitLogsTable).where(inArray(habitLogsTable.habit_id, userHabitIds));
            }
            await db.delete(targetsTable).where(eq(targetsTable.user_id, userId));
            await db.delete(habitsTable).where(eq(habitsTable.user_id, userId));
            await db.delete(categoriesTable).where(eq(categoriesTable.user_id, userId));
            await db.delete(users).where(eq(users.id, userId));

            await clearSession();
            auth?.setCurrentUserId(null);
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.fname} {user.lname}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Member since</Text>
          <Text style={styles.value}>{user.created_at.split('T')[0]}</Text>
        </View>

        <View style={styles.buttonRow}>
          <PrimaryButton label="Log out" onPress={handleLogout} variant="secondary" />
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton label="Delete profile" onPress={handleDelete} variant="danger" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    color: '#0F766E',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  infoBlock: {
    marginBottom: 16,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    color: '#0F172A',
    fontSize: 16,
  },
  buttonRow: {
    marginTop: 12,
  },
});