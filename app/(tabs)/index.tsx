import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit, HabitContext } from '../_layout';


export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(HabitContext);

  if (!context) return null;

  const { habits } = context;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, marginBottom: 10 }}>Habits</Text>

        <PrimaryButton
          label="Add Habit"
          variant="primary"
          onPress={() => router.push({ pathname: '../add_habit' })}
        />

        {habits.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No habits added yet.</Text>
        ) : (
          habits.map((habit: Habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}