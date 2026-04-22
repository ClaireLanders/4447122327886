import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { View } from 'react-native';
import { AuthContext, Category, CategoryContext } from '../../_layout';

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(CategoryContext);
  const auth = useContext(AuthContext);

  if (!context || auth?.currentUserId == null) return null;

  const { categories, setCategories } = context;
  const userId = auth.currentUserId;

  const category = categories.find((c: Category) => c.id === Number(id));
  if (!category) return null;

  const [name, setName] = useState(category.name);
  const [colour, setColour] = useState(category.colour);
  const [icon, setIcon] = useState(category.icon);

  const saveChanges = async () => {
    await db.update(categoriesTable)
      .set({ name, colour, icon })
      .where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.user_id, userId));
    setCategories(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField label="Category Name" value={name} onChangeText={setName} placeholder="Name" />
      <FormField label="Category Colour" value={colour} onChangeText={setColour} placeholder="Colour" />
      <FormField label="Category Icon" value={icon} onChangeText={setIcon} placeholder="Icon" />

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
    </View>
  );
}