import CategoryCard from '@/components/CategoryCard';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CategoryContext } from '../_layout';

export default function CategoriesScreen() {
  const router = useRouter();
  const context = useContext(CategoryContext);

  if (!context) return null;

  const { categories } = context;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, marginBottom: 10 }}>Categories</Text>

        <PrimaryButton
          label="Add Category"
          variant="primary"
          onPress={() => router.push({ pathname: '../add_category' })}
        />

        {categories.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No categories yet.</Text>
        ) : (
          categories.map((category: Category) => (
          <CategoryCard key={category.id} category={category} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}