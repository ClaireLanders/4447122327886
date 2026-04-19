import { Habit, HabitContext, HabitLog, HabitLogContext, Target } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  target: Target;
};

export default function TargetCard({ target }: Props) {
  const router = useRouter();
  const habitContext = useContext(HabitContext);
  const logContext = useContext(HabitLogContext);

  const habitName = habitContext?.habits.find(
    (h: Habit) => h.id === target.habit_id)?.name


   // Calculating  progress from logs, by calculating the start of the current period
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let startDate = todayStr;
  if(target.period ==='weekly'){
    const d = new Date(today);
    // Getting Monday of the current week
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    startDate = d.toISOString().split('T')[0];
  }else if (target.period == 'monthly'){
    // getting first day of current month
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate = d.toISOString().split('T')[0];
  }

  const relevantLogs = logContext?.habitLogs.filter(
    (log: HabitLog) =>
        log.habit_id === target.habit_id &&
        log.date >= startDate &&
        log.date <= todayStr
  ) || [];

  const progress = relevantLogs.reduce((sum,log) => sum + log.count, 0);
  const remaining = target.goal - progress;
  const met = progress >= target.goal;
  const percentage = target.goal > 0 ? Math.round((progress / target.goal) * 100) : 0;

  // navigate to target detail screen when card is tapped
  const openDetails = () =>
    router.push({ 
      pathname: '/target/[id]',
      params: { id: target.id.toString() } 
    });
  // summary string for screen reader accessibility
  const targetSummary = `${habitName} target, ${target.period}, ${percentage}% complete`;


  return (
    <Pressable
      accessibilityLabel={`${targetSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <Text style={styles.name}>Habit: {habitName}</Text>
      <Text>Period: {target.period}</Text>
      <Text>Goal: {target.goal}</Text>
      <Text>Progress: {progress} / {target.goal} ({percentage}%)</Text>
      <Text style={{ color: progress > target.goal ? '#DAA520' : met ? 'green' : 'red' }}>
      { progress > target.goal
        ? 'Target Exceeded! (+${progress-taget.goal} over)'
        : met? 'Target met!'
        : '${remaining} remaining'}   
       </Text>

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