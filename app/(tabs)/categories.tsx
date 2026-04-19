import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
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

        <Button
          title="Add Category"
          onPress={() => router.push({ pathname: '../add-category' })}
        />

        {categories.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No categories yet.</Text>
        ) : (
          categories.map((category: Category) => (
            <View key={category.id} style={{ marginBottom: 12, padding: 10, borderWidth: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 20, height: 20, borderRadius: 10,
                  backgroundColor: category.colour, marginRight: 10
                }} />
                <Text style={{ fontSize: 18 }}>{category.name}</Text>
              </View>
              <Text>Icon: {category.icon}</Text>
              <Button
                title="View"
                onPress={() =>
                  router.push({
                    pathname: '/category/[id]',
                    params: { id: category.id.toString() }
                  })
                }
              />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}