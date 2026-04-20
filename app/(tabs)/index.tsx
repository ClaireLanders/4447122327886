import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CategoryContext, Habit, HabitContext } from '../_layout';


export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(HabitContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categoryContext = useContext(CategoryContext);
  const categories = categoryContext?.categories || [];
 

  if (!context) return null;

  const { habits } = context;

  const normalizedQuery = searchQuery.trim().toLowerCase();

 
  const filteredHabits = habits.filter((habit: Habit) => {
    // Text search, if text entered matches habit name or notes
    const matchesSearch =
      normalizedQuery.length === 0 ||
      habit.name.toLowerCase().includes(normalizedQuery) ||
      (habit.notes && habit.notes.toLowerCase().includes(normalizedQuery));

      const categoryName = categories.find(
        (c: Category) => c.id === habit.category_id
      )?.name;
      const matchesCategory = 
      selectedCategory === 'All' || categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
  });

  const categoryOptions = ['All', ...Array.from(
    new Set(
      habits.map((habit: Habit) => {
        const cat = categories.find((c: Category) => c.id === habit.category_id);
        return cat?.name || 'Unknown';
      })
    )
  ).sort(),
];

 
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
      <Text style={styles.title}>Habits</Text>
      <Text style={styles.subtitle}>{habits.length} tracked</Text>

        <PrimaryButton
          label="Add Habit"
          variant="primary"
          onPress={() => router.push({ pathname: '../add_habit' })}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or notes"
          style={styles.searchInput}
        />
        <View style={styles.filterRow}>
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
            <Pressable
              key={cat}
              accessibilityLabel={`Filter by category ${cat}`}
              accessibilityRole="button"
              onPress={() => setSelectedCategory(cat)}
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
              {cat}
            </Text>
            </Pressable>
          );
        })}
      </View>
        {filteredHabits.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No habits match your search.</Text>
        ) : (
          filteredHabits.map((habit: Habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        )}
     </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 10,
  },

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