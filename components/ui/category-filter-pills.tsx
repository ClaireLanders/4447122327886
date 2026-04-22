import { Category } from '@/app/_layout';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

type Props = {
  categories: Category[];
  selected: string;
  onSelect: (categoryName: string) => void;
  includeAll?: boolean;
};

export default function CategoryFilterPills({ categories, selected, onSelect, includeAll = true }: Props) {
  const options = includeAll
    ? ['All', ...categories.map((c) => c.name).sort()]
    : categories.map((c) => c.name).sort();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.rowContent}
    >
      {options.map((catName) => {
        const isSelected = selected === catName;
        const categoryObj = categories.find((c) => c.name === catName);
        const borderColour = categoryObj?.colour ?? '#94A3B8';
        return (
          <Pressable
            key={catName}
            accessibilityLabel={`Filter by category ${catName}`}
            accessibilityRole="button"
            onPress={() => onSelect(catName)}
            style={[
              styles.pill,
              { borderColor: borderColour },
              isSelected && { backgroundColor: borderColour },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                isSelected && styles.pillTextSelected,
              ]}
            >
              {catName}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 10,
  },
  rowContent: {
    gap: 8,
    paddingRight: 18,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
});