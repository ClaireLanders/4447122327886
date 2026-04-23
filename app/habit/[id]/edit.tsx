import CategorySelector from '@/components/ui/category-selector';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext, CategoryContext, Habit, HabitContext } from '../../_layout';

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(HabitContext);
  const categoryContext = useContext(CategoryContext);
  const auth = useContext(AuthContext);

  if (!context || !categoryContext || auth?.currentUserId == null) return null;

  const { habits, setHabits } = context;
  const { categories } = categoryContext;
  const userId = auth.currentUserId;

  const habit = habits.find((h: Habit) => h.id === Number(id));
  if (!habit) return null;

  const [name, setName] = useState(habit.name);
  const [notes, setNotes] = useState(habit.notes || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(habit.category_id);

  const saveChanges = async () => {
    if (!name.trim() || selectedCategoryId === null) return;

    await db.update(habitsTable)
      .set({ name, notes: notes || null, category_id: selectedCategoryId })
      .where(eq(habitsTable.id, Number(id)));

    const rows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, userId));
    setHabits(rows);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField label="Habit Name" value={name} onChangeText={setName} />
      <FormField label="Habit Notes" value={notes} onChangeText={setNotes} />

      <Text style={styles.label}>Category</Text>
      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
        onAddNew={() => router.push({ pathname: '/add_category' })}
      />

      <PrimaryButton label="Save Changes" variant="primary" onPress={saveChanges} />
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