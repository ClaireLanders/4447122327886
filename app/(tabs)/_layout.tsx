import AvatarButton from '@/components/ui/AvatarButton';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{headerRight: () => <AvatarButton/>}}>
      <Tabs.Screen name="index" options={{ title: 'Habits' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="logs" options={{ title: 'Logs' }} />
      <Tabs.Screen name="targets" options={{ title: 'Targets' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
    </Tabs>
  );
}