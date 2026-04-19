import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Habits' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories'}}/>
      <Tabs.Screen name="logs" options={{ title: 'Logs' }} />
    </Tabs>
  );
}