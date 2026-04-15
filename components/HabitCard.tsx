import { useState } from 'react';
import { Button, Text, View } from 'react-native';

type HabitCardProps = {
    name: string;
    category: string;
    date: string;
};

export default function HabitCard({ name, category, date }:
HabitCardProps) {
    const [count, setCount] = useState(0);

    return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontSize: 18 }}>{name}</Text>
        <Text>Category: {category}</Text>
        <Text>Date: {date}</Text>

        <Text style={{marginTop: 10}}>Count: {count}</Text>
        <Button title="+1" onPress={() => setCount(count + 1)} />
        <Button title="-1" onPress={() => setCount(count - 1)} />

        <Text>
            {count > 0 && 'Positive'}
            {count < 0 && 'Negative'}
            {count === 0 && 'Zero' }
        </Text>
    </View>
    );
}