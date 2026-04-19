import { Category } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  const router = useRouter();

  // navigate to log detail screen when card is tapped
  const openDetails = () =>
    router.push({
      pathname: '/category/[id]', 
      params: { id: category.id.toString() } 
    });

  // summary string for screen reader accessibility
  const categorySummary = `${category.name} category`;

  return (
    <Pressable
          accessibilityLabel={`${categorySummary}, view details`}
          accessibilityRole="button"
          onPress={openDetails}
          style={({ pressed }) => [
            styles.card,
            pressed ? styles.cardPressed : null,
    ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 20, height: 20, borderRadius: 10,
          backgroundColor: category.colour, marginRight: 10
        }} />
        <Text style={styles.name}>{category.name}</Text>
      </View>
      <Text>Icon: {category.icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    fontSize: 18,
  },
});