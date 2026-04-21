import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type CategoryTotal = {
  name: string;
  total: number;
  colour: string;
};

type Props = {
  data: CategoryTotal[];
};

export default function CategoryPieChart({ data }: Props) {
  if (data.length === 0 || data.every(d => d.total === 0)) return null;

  const pieData = data.map((item) => ({
    name: item.name,
    population: item.total,
    color: item.colour,
    legendFontColor: '#334155',
    legendFontSize: 13,
  }));

  return (
    <PieChart
      data={pieData}
      width={screenWidth - 36}
      height={200}
      chartConfig={{
        color: () => '#000',
      }}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="15"
    />
  );
}