import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { Category, CategoryContext } from '../_layout';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(CategoryContext);

  if (!context) return null;

  const { categories, setCategories } = context;

  const category = categories.find((c: Category) => c.id === Number(id));
  if (!category) return null;

  const deleteCategory = async () => {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(id)));
    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{
          width: 24, height: 24, borderRadius: 12,
          backgroundColor: category.colour, marginRight: 10
        }} />
        <Text style={{ fontSize: 22 }}>{category.name}</Text>
      </View>
      <Text>Icon: {category.icon}</Text>
      <Text>Colour: {category.colour}</Text>

      <Button
        title="Edit"
        onPress={() =>
          router.push({
            pathname: '../category/[id]/edit',
            params: { id }
          })
        }
      />
      <PrimaryButton label="Delete" variant="danger" onPress={deleteCategory} />
      <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()} />
    </View>
  );
}