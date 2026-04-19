import { Category } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

type Props = {
  category: Category;
};

export default function CategoryCard({ category }: Props) {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
    <View style={{width: 20, height: 20, borderRadius: 10,backgroundColor: category.colour, marginRight: 10}} />
      <Text style={{ fontSize: 18 }}>{category.name}</Text>
      <Text>Icon: {category.icon}</Text>

      <Button
        title="View"
        onPress={() =>
          router.push({ pathname: '/category/[id]', params: { id: category.id.toString() } })
        }
      />
    </View>
  );
}