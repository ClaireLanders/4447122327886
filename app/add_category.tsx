import ColourPicker from '@/components/ui/colour-picker';
import FormField from '@/components/ui/form-field';
import IconPicker from '@/components/ui/icon-picker';
import { CATEGORY_COLOURS } from '@/constants/colours';
import { CATEGORY_ICONS } from '@/constants/icons';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthContext, CategoryContext } from './_layout';

export default function AddCategory() {
  const router = useRouter();
  const context = useContext(CategoryContext);
  const auth = useContext(AuthContext);

  if (!context || auth?.currentUserId == null) return null;

  const { setCategories } = context;
  const userId = auth.currentUserId;

  const [name, setName] = useState('');
  const [colour, setColour] = useState(CATEGORY_COLOURS[0]);
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);

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

      <Text style={styles.label}>Colour</Text>
      <ColourPicker selected={colour} onSelect={setColour} />

      <Text style={styles.label}>Icon</Text>
      <IconPicker selected={icon} onSelect={setIcon} />

      <Button title="Save" onPress={saveCategory} disabled={!name.trim()} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
});