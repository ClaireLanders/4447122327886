import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Category, CategoryContext } from '../../_layout';

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(CategoryContext);

  if (!context) return null;

  const { categories, setCategories } = context;

  const category = categories.find((c: Category) => c.id === Number(id));
  if (!category) return null;

  const [name, setName] = useState(category.name);
  const [colour, setColour] = useState(category.colour);
  const [icon, setIcon] = useState(category.icon);

  const saveChanges = async () => {
    await db.update(categoriesTable)
      .set({ name, colour, icon })
      .where(eq(categoriesTable.id, Number(id)));

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput value={name} onChangeText={setName} placeholder="Name" />
      <TextInput value={colour} onChangeText={setColour} placeholder="Colour" />
      <TextInput value={icon} onChangeText={setIcon} placeholder="Icon" />

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
    </View>
  );
}