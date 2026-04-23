import ProgressBarChart from '@/components/ui/bar-chart';
import FilterPills from '@/components/ui/filter-pills';
import CategoryPieChart from '@/components/ui/pie-chart';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CategoryContext, Habit, HabitContext, HabitLog, HabitLogContext, Target, TargetContext } from '../_layout';

export default function InsightsScreen() {
  const habitContext = useContext(HabitContext);
  const categoryContext = useContext(CategoryContext);
  const logContext = useContext(HabitLogContext);
  const [period, setPeriod] = useState('weekly');
  const targetContext = useContext(TargetContext);

  if (!habitContext || !categoryContext || !logContext || !targetContext) return null;

  const { habits } = habitContext;
  const { categories } = categoryContext;
  const { habitLogs } = logContext;
  const { targets } = targetContext;


  const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let startDate = todayStr;
    if (period === 'daily') {
    startDate = todayStr;
    } else if (period === 'weekly') {
    const d = new Date(today);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    startDate = d.toISOString().split('T')[0];
    } else if (period === 'monthly') {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate = d.toISOString().split('T')[0];
    }

    
    const periodLogs = habitLogs.filter(
    (log: HabitLog) => log.date >= startDate && log.date <= todayStr
    );

    const categoryTotals = categories.map((cat: Category) => {
    const categoryHabitIds = habits
        .filter((h: Habit) => h.category_id === cat.id)
        .map((h: Habit) => h.id);

    const total = periodLogs
        .filter((log: HabitLog) => categoryHabitIds.includes(log.habit_id))
        .length;

    return { name: cat.name, total, colour: cat.colour};
    });

    // bar chart calculations
    const categoryProgress = categories.map((cat: Category) => {

    const categoryHabitIds = habits
        .filter((h: Habit) => h.category_id === cat.id)
        .map((h: Habit) => h.id);

    const categoryTargets = targets.filter((t: Target) =>
        categoryHabitIds.includes(t.habit_id) && t.period === period
    );

    const totalGoal =  categoryTargets.reduce((sum, t) => sum + t.goal, 0);

    const totalProgress = categoryTargets.reduce((sum, t) => {
        const habitProgress = periodLogs
      .filter((log: HabitLog) => log.habit_id === t.habit_id)
      .reduce((s, log) => s + log.count, 0);
    return sum + habitProgress;
  }, 0);

    const percentage = totalGoal > 0 ? Math.round((totalProgress / totalGoal) * 100) : 0;

    return { name: cat.name, percentage, colour: cat.colour};
    });
    
 


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Insights</Text>
          <FilterPills
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          selected={period}
          onSelect={setPeriod}
          accessibilityLabelPrefix="View insights for"
          fallbackColour='#1E5F8A'
        /> 
        <Text style={styles.sectionTitle}>Progress VS Goals</Text>
        <ProgressBarChart data={categoryProgress} />
        <Text style={styles.sectionTitle}>Category distribution</Text>
        <Text style={styles.subtitle}>Log entries by category</Text>
        <CategoryPieChart data={categoryTotals} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  content: {
    padding: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 16,
  },

sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginTop: 24,
  marginBottom: 8,
},
});