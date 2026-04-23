import { Category } from '@/app/_layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  const router = useRouter();

  const openDetails = () =>
    router.push({
      pathname: '/category/[id]',
      params: { id: category.id.toString() }
    });

  const categorySummary = `${category.name} category`;

  return (
    <Pressable
      accessibilityLabel={`${categorySummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.row}>
        <MaterialCommunityIcons
          name={category.icon as any}
          size={28}
          color={category.colour}
          style={styles.icon}
        />
        <Text style={styles.name}>{category.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 12,
  },
  name: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '500',
  },
});