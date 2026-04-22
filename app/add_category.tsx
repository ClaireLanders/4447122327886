import FormField from '@/components/ui/form-field';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, View } from 'react-native';
import { AuthContext, CategoryContext } from './_layout';

export default function AddCategory() {
  const router = useRouter();
  const context = useContext(CategoryContext);
  const auth = useContext(AuthContext);

  if (!context || auth?.currentUserId == null) return null;

  const { setCategories } = context;
  const userId = auth.currentUserId;

  const [name, setName] = useState('');
  const [colour, setColour] = useState('#4CAF50');
  const [icon, setIcon] = useState('');

  const saveCategory = async () => {
    if (!name.trim()) return;

    await db.insert(categoriesTable).values({
      user_id: userId,
      name,
      colour,
      icon,
    });

    const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.user_id, userId));
    setCategories(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField label="Category name" value={name} onChangeText={setName} />
      <FormField label="Colour (hex e.g. #4CAF50)" value={colour} onChangeText={setColour} />
      <FormField label="Icon name" value={icon} onChangeText={setIcon} />

      <Button title="Save" onPress={saveCategory} disabled={!name.trim()} />
    </View>
  );
}