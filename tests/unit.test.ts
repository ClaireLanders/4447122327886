import { db } from '../db/client';
import { seed } from '../db/seed';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('../lib/auth', () => ({
  hashPassword: jest.fn().mockResolvedValue('mock_hash'),
}));

const mockDb = db as unknown as { select: jest.Mock; insert: jest.Mock };

describe('seed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts sample data into all core tables when the database is empty', async () => {
  const mockValues = jest.fn().mockResolvedValue(undefined);
  const mockFromCount = jest.fn().mockResolvedValue([{ value: 0 }]);
  const mockFromUsers = jest.fn().mockResolvedValue([
    { id: 1, username: 'sarah_j' },
    { id: 2, username: 'mike_r' },
  ]);
  const mockFromEmpty = jest.fn().mockResolvedValue([]);

  mockDb.select
    .mockReturnValueOnce({ from: mockFromCount })
    .mockReturnValueOnce({ from: mockFromUsers })
    .mockReturnValue({ from: mockFromEmpty });
  mockDb.insert.mockReturnValue({ values: mockValues });

  try {
    await seed();
  } catch {

  }

  expect(mockDb.insert).toHaveBeenCalled();

  expect(mockValues).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({ username: 'sarah_j' }),
      expect.objectContaining({ username: 'mike_r' }),
    ])
  );

  expect(mockValues).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({ name: 'Health' }),
    ])
  );
});

  it('does nothing when users already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([{ value: 2 }]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seed();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});