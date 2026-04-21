import { Dimensions, StyleSheet, Text, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type CategoryProgress = {
  name: string;
  percentage: number;
  colour: string;
};

type Props = {
  data: CategoryProgress[];
};

export default function ProgressBarChart({ data }: Props) {
  const filtered = data.filter(d => d.percentage > 0);
  if (filtered.length === 0) return null;

  return (
    <View>
      {filtered.map((item) => (
        <View key={item.name} style={styles.row}>
          <Text style={styles.label}>{item.name}</Text>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: item.percentage > 100
                  ? `100%`
                  : `${item.percentage}%`,
                  backgroundColor: item.colour,
                  opacity: 0.85,
                },
              ]}
            />

            <View style={styles.goalLine} />
          </View>
          <Text style={[
            styles.percentText,
            { color: item.percentage > 100 ? '#DAA520' : item.percentage >= 100 ? 'green' : '#334155' }
          ]}>
            {item.percentage}%
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    width: 90,
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  barBackground: {
    flex: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    opacity: 0.85,
  },
  goalLine: {
    position: 'absolute',
    left: '100%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#0F172A',
  },
  percentText: {
    width: 50,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
  },
});