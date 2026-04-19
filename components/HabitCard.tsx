import { Category, CategoryContext, Habit } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';

type Props = {
  habit: Habit;
};

export default function HabitCard({habit}: Props) {
    const router = useRouter();
    const categoryContext = useContext(CategoryContext);

    const categoryName = categoryContext?.categories.find(
        (c: Category) => c.id === habit.category_id)?.name;

    return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontSize: 18 }}>{habit.name}</Text>
        <Text>Category: {categoryName}</Text>
        <Text>Created: {habit.created_at}</Text>
        {habit.notes && <Text>Notes: {habit.notes}</Text>}


        <Button
         title="View"
         onPress={() =>
            router.push({ pathname: '/habit/[id]', params: {id: habit.id.toString()} })
            }
        />

        <Button
        title="Log Habit"
        onPress={() =>
            router.push({pathname: '/add_log', params: { habitId: habit.id.toString()} })
        }
        />
    </View>
    );
}
        