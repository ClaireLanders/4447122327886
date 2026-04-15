import { Button, Text, View } from 'react-native';

type HabitCardProps = {
    id: number;
    name: string;
    category: string;
    date: string;
    count: number;
    onUpdate: (id: number, delta: number) => void;
    onRemove: (id: number) => void;

};

export default function HabitCard({ id, name, category, date, count, onUpdate, onRemove }:
HabitCardProps) {
    return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
        <Text style={{ fontSize: 18 }}>{name}</Text>
        <Text>Category: {category}</Text>
        <Text>Date: {date}</Text>

        <Text style={{marginTop: 10}}>Count: {count}</Text>
        <Button title="+1" onPress={() => onUpdate(id, 1)} />
        <Button title="-1" onPress={() => onUpdate(id, - 1)} />

        <Text>
            {count > 0 && 'Positive'}
            {count < 0 && 'Negative'}
            {count === 0 && 'Zero' }
        </Text>
        <View style={{ marginTop: 5 }}>
            <Button title="Remove" onPress={() => onRemove(id)} />
        </View>
    </View>
    );
}