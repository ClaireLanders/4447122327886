import LogCard from '@/components/LogCard';
import CategoryFilterPills from '@/components/ui/category-filter-pills';
import DatePicker from '@/components/ui/date-picker';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CategoryContext, Habit, HabitContext, HabitLog, HabitLogContext } from '../_layout';

export default function LogsScreen() {
  const router = useRouter();
  const context = useContext(HabitLogContext);
  const habitContext = useContext(HabitContext);
  const categoryContext = useContext(CategoryContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());

  if (!context) return null;

  const { habitLogs } = context;
  const habits = habitContext?.habits || [];
  const categories = categoryContext?.categories || [];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredLogs = habitLogs.filter((log: HabitLog) => {
    const habit = habits.find((h: Habit) => h.id === log.habit_id);
    const habitName = habit?.name || '';
    const categoryName = categories.find((c: Category) => c.id === habit?.category_id)?.name || '';

    const matchesSearch =
      normalizedQuery.length === 0 ||
      habitName.toLowerCase().includes(normalizedQuery) ||
      (log.notes && log.notes.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      selectedCategory === 'All' || categoryName === selectedCategory;

    const matchesDate =
      log.date >= startDate.toISOString().split('T')[0] &&
      log.date <= endDate.toISOString().split('T')[0];

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, marginBottom: 10 }}>Habit Logs</Text>

        <PrimaryButton
          label="Log a Habit"
          variant="primary"
          onPress={() => router.push({ pathname: '../add_log' })}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by habit name or notes"
          accessibilityLabel='Search logs'
          style={styles.searchInput}
        />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <DatePicker label="From" value={startDate} onChange={setStartDate} />
          </View>
          <View style={{ flex: 1 }}>
            <DatePicker label="To" value={endDate} onChange={setEndDate} />
          </View>
        </View>

        <CategoryFilterPills
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {filteredLogs.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No logs yet.</Text>
        ) : (
          filteredLogs.map((log: HabitLog) => (
            <LogCard key={log.id} log={log} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});