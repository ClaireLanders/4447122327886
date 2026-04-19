import TargetCard from '@/components/TargetCard';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, TargetContext } from '../_layout';

export default function TargetsScreen() {
  const router = useRouter();
  const context = useContext(TargetContext);

  if (!context) return null;

  const { targets } = context;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, marginBottom: 10 }}>Targets</Text>

        <PrimaryButton
          label="Add Target"
          variant="primary"
          onPress={() => router.push({ pathname: '../add_target' })}
        />

        {targets.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No targets set yet.</Text>
        ) : (
          targets.map((target: Target) => (
            <TargetCard key={target.id} target={target} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}