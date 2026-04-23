import { Category, CategoryContext, Habit } from '@/app/_layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  habits: Habit[];
  selectedId: number | null;
  onSelect: (habitId: number) => void;
};

export default function HabitSelector({ habits, selectedId, onSelect }: Props) {
  const categoryContext = useContext(CategoryContext);
  const categories = categoryContext?.categories || [];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.rowContent}
    >
      {habits.map((habit) => {
        const isSelected = selectedId === habit.id;
        const category = categories.find((c: Category) => c.id === habit.category_id);
        const categoryColour = category?.colour ?? '#94A3B8';
        const categoryIcon = category?.icon;

        return (
          <Pressable
            key={habit.id}
            accessibilityLabel={`Select habit ${habit.name}`}
            accessibilityRole="button"
            onPress={() => onSelect(habit.id)}
            style={[
              styles.chip,
              { borderColor: categoryColour },
              isSelected && { backgroundColor: categoryColour },
            ]}
          >
            <View style={styles.chipContent}>
              {categoryIcon && (
                <MaterialCommunityIcons
                  name={categoryIcon as any}
                  size={16}
                  color={isSelected ? '#FFFFFF' : categoryColour}
                  style={styles.chipIcon}
                />
              )}
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {habit.name}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
  },
  rowContent: {
    gap: 8,
    paddingRight: 18,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});