import { Category, CategoryContext, Habit } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  habit: Habit;
};

export default function HabitCard({habit}: Props) {
    const router = useRouter();
    const categoryContext = useContext(CategoryContext);

    const categoryName = categoryContext?.categories.find(
        (c: Category) => c.id === habit.category_id)?.name;

    // navigate to log detail screen when card is tapped
    const openDetails = () =>
        router.push({
            pathname: '/habit/[id]', 
            params: { id: habit.id.toString() } 
        });
    
    // summary string for screen reader accessibility
    const habitSummary = `${habit.name}, ${categoryName}`;


    return (
    <Pressable
      accessibilityLabel={`${habitSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}>
        <Text style={{ fontSize: 18 }}>{habit.name}</Text>
        <Text>Category: {categoryName}</Text>
        <Text>Created: {habit.created_at}</Text>
        {habit.notes && <Text>Notes: {habit.notes}</Text>}

        <Button
        title="Log Habit"
        onPress={() =>
            router.push({pathname: '/add_log', params: { habitId: habit.id.toString()} })
        }
        />
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
        