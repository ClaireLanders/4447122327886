import { render, waitFor } from '@testing-library/react-native';
import IndexScreen from '../app/(tabs)/index';
import { AuthContext, CategoryContext, Habit, HabitContext, HabitLogContext, TargetContext } from '../app/_layout';

jest.mock('@/db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useSegments: () => [],
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

const mockHabit: Habit = {
  id: 1,
  user_id: 1,
  category_id: 1,
  name: 'Test Habit',
  created_at: '2025-03-02T08:00:00Z',
  notes: null,
};

const mockCategory = {
  id: 1,
  user_id: 1,
  name: 'Health',
  colour: '#4CAF50',
  icon: 'heart-pulse',
};

describe('IndexScreen', () => {
  it('renders the habit on screen', async () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ currentUserId: 1, setCurrentUserId: jest.fn() }}>
        <CategoryContext.Provider value={{ categories: [mockCategory], setCategories: jest.fn() }}>
          <HabitContext.Provider value={{ habits: [mockHabit], setHabits: jest.fn() }}>
            <HabitLogContext.Provider value={{ habitLogs: [], setHabitLogs: jest.fn() }}>
              <TargetContext.Provider value={{ targets: [], setTargets: jest.fn() }}>
                <IndexScreen />
              </TargetContext.Provider>
            </HabitLogContext.Provider>
          </HabitContext.Provider>
        </CategoryContext.Provider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Test Habit')).toBeTruthy();
    });
  });
});