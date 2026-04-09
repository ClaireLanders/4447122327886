import TaskCard from '@/components/TaskCard';
import { View } from 'react-native';

export default function IndexScreen() {
return (
<View style={{ padding: 20 }}>
  <TaskCard name="Task 1" category="cat 1" date="2026-04-08"/>
  <TaskCard name="Task2" category="cat 2" date="2026-04-09"/>
</View>
  );
}