import { AuthContext } from '@/app/_layout';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { hashPassword, saveSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!username.trim() || !password) {
      setError('Please enter both username and password');
      return;
    }
    const hash = await hashPassword(password);
    const matches = await db.select().from(users).where(eq(users.username, username.trim()));
    const user = matches[0];
    if (!user || user.password_hash !== hash) {
      setError('Incorrect username or password');
      return;
    }
    await saveSession(user.id);
    auth?.setCurrentUserId(user.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Log in</Text>

        <FormField
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonRow}>
          <PrimaryButton label="Log in" onPress={handleLogin} />
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton label="Don't have an account? Register" onPress={() => router.replace('/register')} variant="secondary" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5EFE6',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#1E5F8A',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  error: {
    color: '#DC2626',
    marginBottom: 12,
  },
  buttonRow: {
    marginTop: 12,
  },
});