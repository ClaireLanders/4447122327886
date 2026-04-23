import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_HOUR_KEY = 'reminderHour';
const REMINDER_MINUTE_KEY = 'reminderMinute';
const REMINDER_ENABLED_KEY = 'reminderEnabled';
const REMINDER_ID_KEY = 'reminderNotificationId';

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelExistingReminder(): Promise<void> {
  const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY);
  if (existingId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    } catch {
      // stale id — ignore
    }
  }
  await AsyncStorage.removeItem(REMINDER_ID_KEY);
  await AsyncStorage.setItem(REMINDER_ENABLED_KEY, 'false');
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  await cancelExistingReminder();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Daily reminder',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to log your habits',
      body: 'Take a minute to record what you did today.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await AsyncStorage.setItem(REMINDER_ID_KEY, id);
  await AsyncStorage.setItem(REMINDER_HOUR_KEY, String(hour));
  await AsyncStorage.setItem(REMINDER_MINUTE_KEY, String(minute));
  await AsyncStorage.setItem(REMINDER_ENABLED_KEY, 'true');
  return id;
}

export async function getReminderSettings(): Promise<{ enabled: boolean; hour: number; minute: number }> {
  const [enabled, hourStr, minuteStr] = await Promise.all([
    AsyncStorage.getItem(REMINDER_ENABLED_KEY),
    AsyncStorage.getItem(REMINDER_HOUR_KEY),
    AsyncStorage.getItem(REMINDER_MINUTE_KEY),
  ]);
  return {
    enabled: enabled === 'true',
    hour: hourStr ? Number(hourStr) : 20,
    minute: minuteStr ? Number(minuteStr) : 0,
  };
}