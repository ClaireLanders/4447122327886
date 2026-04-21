// component from React Native Book Ch 22
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

export default function DatePicker({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <DateTimePicker
          mode="date"
          display="compact"
          value={value}
          onChange={(event, date) => {
            if (date) onChange(date);
          }}
        />
      </View>
    );
  }

  // Android — show on tap
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setShow(true)}
        style={styles.input}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        <Text>{value.toISOString().split('T')[0]}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          mode="date"
          value={value}
          onChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});