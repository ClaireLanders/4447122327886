import TaskCard from '@/components/TaskCard';
import { useState } from 'react';
import { View } from 'react-native';

export default function IndexScreen() {
  const [tasks] = useState([
    {id: 1, name:"Meal Prep", category:"Health", date:"2026-04-08"},
    {id: 2, name:"Walk", category:"Health", date:"2026-04-09"},
    {id: 3, name:"Plan essay", category:"College work", date:"2026-04-10"}
  ]);
return (
<View style={{ padding: 20 }}>
  {tasks.map(task =>(
    <TaskCard
    key={task.id}
    name={task.name}
    category={task.category}
    date={task.date}
    /> 
  ))}
</View>
);
}