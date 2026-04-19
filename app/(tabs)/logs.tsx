import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
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

        <Button
          title="Log a Habit"
          onPress={() => router.push({ pathname: '../add_log' })}
        />

        {habitLogs.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No logs yet.</Text>
        ) : (
          habitLogs.map((log: HabitLog) => (
            <View key={log.id} style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
              <Text style={{ fontSize: 18 }}>Habit ID: {log.habit_id}</Text>
              <Text>Date: {log.date}</Text>
              <Text>Count: {log.count}</Text>
              {log.notes && <Text>Notes: {log.notes}</Text>}
              <Button
                title="View"
                onPress={() =>
                  router.push({ pathname: '/log/[id]', params: { id: log.id.toString() } })
                }
              />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}