import LogCard from '@/components/LogCard';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitLog, HabitLogContext } from '../_layout';

export default function LogsScreen() {
  const router = useRouter();
  const context = useContext(HabitLogContext);

  if (!context) return null;

  const { habitLogs } = context;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, marginBottom: 10 }}>Habit Logs</Text>

        <PrimaryButton
          label="Log a Habit"
          variant="primary"
          onPress={() => router.push({ pathname: '../add_log' })}
        />

        {habitLogs.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No logs yet.</Text>
        ) : (
          habitLogs.map((log: HabitLog) => (
            <LogCard key={log.id} log={log} />            
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}