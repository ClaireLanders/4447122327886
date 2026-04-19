import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { CategoryContext } from './_layout';


export default function AddCategory() {
  const router = useRouter();
  const context = useContext(CategoryContext);

  if (!context) return null;

  const { setCategories } = context;

  const [name, setName] = useState('');
  const [colour, setColour] = useState('#4CAF50');
  const [icon, setIcon] = useState('');

  const saveCategory = async () => {
    if (!name.trim()) return;

    await db.insert(categoriesTable).values({
      user_id: 1,
      name,
      colour,
      icon,
    });

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Category name" value={name} onChangeText={setName}
      style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}/>
      <TextInput placeholder="Colour (hex e.g. #4CAF50)" value={colour} onChangeText={setColour}
      style={{ borderWidth: 1, marginVertical: 5, padding: 5 }} />
      <TextInput placeholder="Icon name" value={icon} onChangeText={setIcon}
      style={{ borderWidth: 1, marginVertical: 5, padding: 5 }}/>

      <Button title="Save"  onPress={saveCategory} disabled={!name.trim()} />
    </View>
  );
}