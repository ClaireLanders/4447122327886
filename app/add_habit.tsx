import CategorySelector from '@/components/ui/category-selector';
import FormField from '@/components/ui/form-field';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthContext, CategoryContext, HabitContext } from './_layout';

export default function AddHabit() {
  const router = useRouter();
  const habitContext = useContext(HabitContext);
  const categoryContext = useContext(CategoryContext);
  const auth = useContext(AuthContext);

  if (!habitContext || !categoryContext || auth?.currentUserId == null) return null;

  const { setHabits } = habitContext;
  const { categories } = categoryContext;
  const userId = auth.currentUserId;

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const saveHabit = async () => {
    if (!name.trim()) return;
    if (selectedCategoryId === null) return;

    await db.insert(habitsTable).values({
      user_id: userId,
      category_id: selectedCategoryId,
      name,
      created_at: new Date().toISOString().split('T')[0],
      notes: notes || null,
    });

    const rows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, userId));
    setHabits(rows);
    router.back();
  };

  return (
    <View style={styles.container}>
      <FormField label="Habit name" value={name} onChangeText={setName} />
      <FormField label="Notes (optional)" value={notes} onChangeText={setNotes} />

      <Text style={styles.label}>Category</Text>
      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
        onAddNew={() => router.push({ pathname: '/add_category' })}
      />
      {categories.length === 0 && (
        <Text style={styles.hint}>
          You have no categories yet. Add one before creating a habit.
        </Text>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="Save"
          onPress={saveHabit}
          disabled={!name.trim() || selectedCategoryId === null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  
  hint: {
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 12,
  },
  buttonRow: {
    marginTop: 12,
  },
}); 