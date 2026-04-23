import { Category, CategoryContext, Habit, HabitContext, HabitLog } from '@/app/_layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  log: HabitLog;
};

export default function LogCard({ log }: Props) {
  const router = useRouter();
  const habitContext = useContext(HabitContext);
  const categoryContext = useContext(CategoryContext);

  const habit = habitContext?.habits.find((h: Habit) => h.id === log.habit_id);
  const habitName = habit?.name;
  const category = categoryContext?.categories.find((c: Category) => c.id === habit?.category_id);
  const categoryColour = category?.colour ?? '#CBD5E1';
  const categoryIcon = category?.icon;

  const openDetails = () =>
    router.push({
      pathname: '/log/[id]',
      params: { id: log.id.toString() }
    });

  const logSummary = `${habitName} log, ${log.date}, count ${log.count}`;

  return (
    <Pressable
      accessibilityLabel={`${logSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: categoryColour },
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.headerRow}>
        {categoryIcon && (
          <MaterialCommunityIcons
            name={categoryIcon as any}
            size={22}
            color={categoryColour}
            style={styles.icon}
          />
        )}
        <Text style={styles.name}>{habitName}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{log.date}</Text>
        <Text style={styles.count}>Count: {log.count}</Text>
      </View>
      {log.notes && <Text style={styles.notes}>{log.notes}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  name: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  meta: {
    color: '#64748B',
    fontSize: 13,
  },
  count: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  notes: {
    color: '#334155',
    fontSize: 14,
    marginTop: 8,
  },
});