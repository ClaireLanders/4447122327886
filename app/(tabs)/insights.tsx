import ProgressBarChart from '@/components/ui/bar-chart';
import CategoryPieChart from '@/components/ui/pie-chart';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
        <View style={styles.filterRow}>
                {['daily', 'weekly', 'monthly'].map((p) => {
            const isSelected = period === p;
            return (
            <Pressable
                key={p}
                accessibilityLabel={`View ${p} insights`}
                accessibilityRole="button"
                onPress={() => setPeriod(p)}
                style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected,
                ]}
            >
                <Text
                style={[
                    styles.filterButtonText,
                    isSelected && styles.filterButtonTextSelected,
                ]}
                >
                {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
            </Pressable>
            );
        })}
        </View>       
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
  filterRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 10,
  marginBottom: 16,
},
filterButton: {
  backgroundColor: '#FFFFFF',
  borderColor: '#94A3B8',
  borderRadius: 999,
  borderWidth: 1,
  paddingHorizontal: 12,
  paddingVertical: 8,
},
filterButtonSelected: {
  backgroundColor: '#0F172A',
  borderColor: '#0F172A',
},
filterButtonText: {
  color: '#0F172A',
  fontSize: 14,
  fontWeight: '500',
},
filterButtonTextSelected: {
  color: '#FFFFFF',
},
sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginTop: 24,
  marginBottom: 8,
},
});