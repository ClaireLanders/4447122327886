import { Target } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

type Props = {
  target: Target;
};

export default function TargetCard({ target }: Props) {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
      <Text style={{ fontSize: 18 }}>Habit ID: {target.habit_id}</Text>
      <Text>Period: {target.period}</Text>
      <Text>Goal: {target.goal}</Text>

      <Button
        title="View"
        onPress={() =>
          router.push({ pathname: '/target/[id]', params: { id: target.id.toString() } })
        }
      />
    </View>
  );
}