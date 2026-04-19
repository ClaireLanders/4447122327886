import { Habit, HabitContext, HabitLog } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';

type Props = {
  log: HabitLog;
};

export default function LogCard({ log }: Props) {
  const router = useRouter();
  const habitContext = useContext(HabitContext);

  const habitName = habitContext?.habits.find(
    (h: Habit) => h.id === log.habit_id)?.name

  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>Habit: {habitName}</Text>
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