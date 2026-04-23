import { Habit, HabitContext, HabitLog, HabitLogContext, Target } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  target: Target;
};

export default function TargetCard({ target }: Props) {
  const router = useRouter();
  const habitContext = useContext(HabitContext);
  const logContext = useContext(HabitLogContext);

  const habitName = habitContext?.habits.find(
    (h: Habit) => h.id === target.habit_id)?.name;


  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let startDate = todayStr;
  if (target.period === 'weekly') {
    const d = new Date(today);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    startDate = d.toISOString().split('T')[0];
  } else if (target.period === 'monthly') {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate = d.toISOString().split('T')[0];
  }

  const relevantLogs = logContext?.habitLogs.filter(
    (log: HabitLog) =>
      log.habit_id === target.habit_id &&
      log.date >= startDate &&
      log.date <= todayStr
  ) || [];

  const progress = relevantLogs.reduce((sum, log) => sum + log.count, 0);
  const remaining = target.goal - progress;
  const met = progress >= target.goal;
  const exceeded = progress > target.goal;
  const percentage = target.goal > 0 ? Math.round((progress / target.goal) * 100) : 0;
  const barWidth = Math.min(percentage, 100);

  const barColour = exceeded ? '#DAA520' : met ? '#16A34A' : '#1E5F8A';
  const statusText = exceeded
    ? `Exceeded by ${progress - target.goal}`
    : met
      ? 'Target met!'
      : `${remaining} remaining`;
  const statusColour = exceeded ? '#DAA520' : met ? '#16A34A' : '#DC2626';

  const openDetails = () =>
    router.push({
      pathname: '/target/[id]',
      params: { id: target.id.toString() }
    });

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
      <Text style={styles.name}>{habitName}</Text>
      <Text style={styles.period}>{target.period}</Text>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {progress} / {target.goal}
        </Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: barColour }]} />
      </View>

      <Text style={[styles.status, { color: statusColour }]}>{statusText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '600',
  },
  period: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  percentageText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  barBackground: {
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    borderRadius: 999,
    height: '100%',
  },
  status: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
});