import HabitCard from '@/components/HabitCard';
import CategoryFilterPills from '@/components/ui/category-filter-pills';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';
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
    // Text search for if text entered matches habit name or notes
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
          accessibilityLabel='Search habits'
          style={styles.searchInput}
        />
        <CategoryFilterPills
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
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
 
});