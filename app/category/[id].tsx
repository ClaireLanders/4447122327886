import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext, Category, CategoryContext } from '../_layout';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(CategoryContext);
  const auth = useContext(AuthContext);

  if (!context || auth?.currentUserId == null) return null;

  const { categories, setCategories } = context;
  const userId = auth.currentUserId;

  const category = categories.find((c: Category) => c.id === Number(id));
  if (!category) return null;

  const deleteCategory = async () => {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(id)));
    const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.user_id, userId));
    setCategories(rows);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name={category.icon as any}
          size={72}
          color={category.colour}
        />
      </View>
      <Text style={styles.name}>{category.name}</Text>

      <PrimaryButton
        label="Edit"
        variant="secondary"
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  iconWrap: {
    alignItems: 'center',
    marginVertical: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
});