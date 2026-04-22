import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const SESSION_KEY = 'currentUserId';

export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
}

export async function saveSession(userId: number): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, String(userId));
}

export async function loadSession(): Promise<number | null> {
  const value = await AsyncStorage.getItem(SESSION_KEY);
  return value ? Number(value) : null;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}