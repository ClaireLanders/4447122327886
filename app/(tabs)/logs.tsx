import LogCard from '@/components/LogCard';
import DatePicker from '@/components/ui/date-picker';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit, HabitContext, HabitLog, HabitLogContext } from '../_layout';

export default function LogsScreen() {
  const router = useRouter();
  const context = useContext(HabitLogContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHabit, setSelectedHabit] = useState('All');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());


  if (!context) return null;

  const { habitLogs } = context;
  const habitContext = useContext(HabitContext);
  const habits = habitContext?.habits || [];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredLogs = habitLogs.filter((log: HabitLog) => {
    const habitName = habits.find((h: Habit) => h.id === log.habit_id)?.name || '';

    const matchesSearch =
      normalizedQuery.length === 0 ||
      habitName.toLowerCase().includes(normalizedQuery) ||
      (log.notes && log.notes.toLowerCase().includes(normalizedQuery));

    const matchesHabit =
      selectedHabit === 'All' || habitName === selectedHabit;
    
    const matchesDate =
      log.date >= startDate.toISOString().split('T')[0] &&
      log.date <= endDate.toISOString().split('T')[0];

    return matchesSearch && matchesHabit && matchesDate;
  });

  const habitOptions = ['All',...Array.from(
    new Set(
      habitLogs.map((log: HabitLog) => {
        const habit = habits.find((h: Habit) => h.id === log.habit_id);
        return habit?.name || 'Unknown';
      })
    )
  ).sort(),
];



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
        <View style={styles.filterRow}>
          {habitOptions.map((hab) => {
            const isSelected = selectedHabit === hab;
            return (
              <Pressable
                key={hab}
                accessibilityLabel={`Filter by habit ${hab}`}
                accessibilityRole="button"
                onPress={() => setSelectedHabit(hab)}
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
                  {hab}
                </Text>
              </Pressable>
            );
          })}
        </View>

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
  filterRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 10,
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
});