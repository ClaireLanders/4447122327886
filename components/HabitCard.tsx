import { Habit } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

type Props = {
  habit: Habit;
};

export default function HabitCard({habit}: Props) {
    const router = useRouter();

    return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontSize: 18 }}>{habit.name}</Text>
        <Text>Category: {habit.category_id}</Text>
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
        