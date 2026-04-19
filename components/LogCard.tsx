import { HabitLog } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

type Props = {
  log: HabitLog;
};

export default function LogCard({ log }: Props) {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
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
  );
}