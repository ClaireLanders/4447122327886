import { CATEGORY_COLOURS } from '@/constants/colours';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  selected: string;
  onSelect: (colour: string) => void;
};

export default function ColourPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {CATEGORY_COLOURS.map((colour) => {
        const isSelected = selected === colour;
        return (
          <Pressable
            key={colour}
            accessibilityLabel={`Select colour ${colour}`}
            accessibilityRole="button"
            onPress={() => onSelect(colour)}
            style={[
              styles.swatchWrapper,
              isSelected && styles.selectedWrapper,
            ]}
          >
            <View style={[styles.swatch,
            { backgroundColor: colour },
              isSelected && styles.swatchSelected,]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  swatchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    width: '33.333%',
  },
  selectedWrapper: {
  },
  swatch: {
    borderColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    height: 44,
    width: 44,
  },

  swatchSelected: {
  borderColor: '#0F172A',
  borderWidth: 3,
},
});