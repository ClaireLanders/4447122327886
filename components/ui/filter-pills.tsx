import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

type PillOption = {
  value: string;
  label: string;
  colour?: string;
};

type Props = {
  options: PillOption[];
  selected: string;
  onSelect: (value: string) => void;
  accessibilityLabelPrefix?: string;
  fallbackColour?: string;
};

export default function FilterPills({
  options,
  selected,
  onSelect,
  accessibilityLabelPrefix = 'Filter',
  fallbackColour = '#1E5F8A',
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.rowContent}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;
        const borderColour = option.colour ?? fallbackColour;
        return (
          <Pressable
            key={option.value}
            accessibilityLabel={`${accessibilityLabelPrefix} ${option.label}`}
            accessibilityRole="button"
            onPress={() => onSelect(option.value)}
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
              {option.label}
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