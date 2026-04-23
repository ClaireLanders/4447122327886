import { CATEGORY_ICONS } from '@/constants/icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  selected: string;
  onSelect: (icon: string) => void;
  tintColour?: string;
};

export default function IconPicker({ selected, onSelect, tintColour = '#0F172A' }: Props) {
  return (
    <View style={styles.grid}>
      {CATEGORY_ICONS.map((icon) => {
        const isSelected = selected === icon;
        return (
          <Pressable
            key={icon}
            accessibilityLabel={`Select icon ${icon}`}
            accessibilityRole="button"
            onPress={() => onSelect(icon)}
            style={[
              styles.wrapper,
              isSelected && styles.wrapperSelected,
            ]}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={28}
              color={isSelected ? tintColour : '#64748B'}
            />
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
  wrapper: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    padding: 8,
    width: '20%',
  },
  wrapperSelected: {
    backgroundColor: '#F1F5F9',
    borderColor: '#0F172A',
  },
});