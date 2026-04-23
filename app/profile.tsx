import { AuthContext, CategoryContext, Habit, HabitContext, HabitLogContext, TargetContext } from '@/app/_layout';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable, habit_logs as habitLogsTable, habits as habitsTable, targets as targetsTable, users } from '@/db/schema';
import { clearSession } from '@/lib/auth';
import { exportUserDataToCSV } from '@/lib/csvExport';
import { cancelExistingReminder, getReminderSettings, scheduleDailyReminder } from '@/lib/notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eq, inArray } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, View } from 'react-native';
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
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());



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

  useEffect(() => {
  const loadReminder = async () => {
    const { enabled, hour, minute } = await getReminderSettings();
    setReminderEnabled(enabled);
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    setReminderTime(d);
  };
  void loadReminder();
}, []);

  const handleExport = async () => {
    if (auth?.currentUserId == null) return;
    try {
      await exportUserDataToCSV(auth.currentUserId);
    } catch (err) {
      Alert.alert('Export failed', err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

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
  const handleReminderToggle = async (enabled: boolean) => {
  setReminderEnabled(enabled);
  if (enabled) {
    const id = await scheduleDailyReminder(reminderTime.getHours(), reminderTime.getMinutes());
    if (!id) {
      setReminderEnabled(false);
      Alert.alert('Permission required', 'Notifications permission was not granted.');
    }
  } else {
    await cancelExistingReminder();
  }
};

const handleTimeChange = async (_event: unknown, date?: Date) => {
  if (!date) return;
  setReminderTime(date);
  if (reminderEnabled) {
    await scheduleDailyReminder(date.getHours(), date.getMinutes());
  }
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
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Daily reminder</Text>
          <View style={styles.reminderRow}>
            <Text style={styles.value}>{reminderEnabled ? 'On' : 'Off'}</Text>
            <Switch value={reminderEnabled} onValueChange={handleReminderToggle} />
          </View>
          {reminderEnabled && (
            <View style={styles.reminderTimeRow}>
              <Text style={styles.label}>Reminder time</Text>
              <DateTimePicker
                mode="time"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                value={reminderTime}
                onChange={handleTimeChange}
              />
            </View>
          )}
        </View>
        
        <View style={styles.buttonRow}>
          <PrimaryButton label="Export data (CSV)" onPress={handleExport} variant="secondary" />
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
    backgroundColor: '#F5EFE6',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    color: '#1E5F8A',
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
  reminderRow: {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
},
reminderTimeRow: {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
},
});