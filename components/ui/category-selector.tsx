import { Category } from '@/app/_layout';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

type Props = {
  categories: Category[];
  selectedId: number | null;
  onSelect: (categoryId: number) => void;
  onAddNew?: () => void;
};

export default function CategorySelector({ categories, selectedId, onSelect, onAddNew }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.rowContent}
    >
      {categories.map((cat) => {
        const isSelected = selectedId === cat.id;
        return (
          <Pressable
            key={cat.id}
            accessibilityLabel={`Category ${cat.name}`}
            accessibilityRole="button"
            onPress={() => onSelect(cat.id)}
            style={[
              styles.chip,
              { borderColor: cat.colour },
              isSelected && { backgroundColor: cat.colour },
            ]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
      {onAddNew && (
        <Pressable
          accessibilityLabel="Add new category"
          accessibilityRole="button"
          onPress={onAddNew}
          style={[styles.chip, styles.addChip]}
        >
          <Text style={styles.addChipText}>+ New</Text>
        </Pressable>
      )}
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
  pill: {

  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  addChip: {
    backgroundColor: '#F1F5F9',
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  addChipText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
});