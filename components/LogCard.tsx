import { Habit, HabitContext, HabitLog } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  log: HabitLog;
};

export default function LogCard({ log }: Props) {
  const router = useRouter();
  const habitContext = useContext(HabitContext);

  const habitName = habitContext?.habits.find(
    (h: Habit) => h.id === log.habit_id
  )?.name;

  // navigate to log detail screen when card is tapped
  const openDetails = () =>
    router.push({
      pathname: '/log/[id]',
      params: { id: log.id.toString() } 
    });

 // summary string for screen reader accessibility
  const logSummary = `${habitName} log, ${log.date}, count ${log.count}`;

  return (
    <Pressable
      accessibilityLabel={`${logSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <Text style={styles.name}>Habit: {habitName}</Text>
      <Text>Date: {log.date}</Text>
      <Text>Count: {log.count}</Text>
      {log.notes && <Text>Notes: {log.notes}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    fontSize: 18,
  },
});