import { Category, CategoryContext, Habit } from '@/app/_layout';
import PrimaryButton from '@/components/ui/primary-button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  habit: Habit;
};

export default function HabitCard({ habit }: Props) {
  const router = useRouter();
  const categoryContext = useContext(CategoryContext);

  const category = categoryContext?.categories.find((c: Category) => c.id === habit.category_id);
  const categoryName = category?.name;
  const categoryColour = category?.colour ?? '#CBD5E1';
  const categoryIcon = category?.icon;

  const openDetails = () =>
    router.push({
      pathname: '/habit/[id]',
      params: { id: habit.id.toString() }
    });

  const habitSummary = `${habit.name}, ${categoryName}`;

  return (
    <Pressable
      accessibilityLabel={`${habitSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: categoryColour },
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.headerRow}>
        {categoryIcon && (
          <MaterialCommunityIcons
            name={categoryIcon as any}
            size={22}
            color={categoryColour}
            style={styles.icon}
          />
        )}
        <Text style={styles.name}>{habit.name}</Text>
      </View>
      <Text style={styles.meta}>{categoryName}</Text>
      <Text style={styles.meta}>Created: {habit.created_at}</Text>
      {habit.notes && <Text style={styles.notes}>{habit.notes}</Text>}

      <View style={styles.buttonRow}>
        <PrimaryButton
          label="Log Habit"
          variant="secondary"
          compact
          onPress={() =>
            router.push({ pathname: '/add_log', params: { habitId: habit.id.toString() } })
          }
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  name: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '600',
  },
  meta: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  notes: {
    color: '#334155',
    fontSize: 14,
    marginTop: 8,
  },
  buttonRow: {
    alignItems: 'center',
    marginTop: 12,
  },
});