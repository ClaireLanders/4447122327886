import { AuthContext } from '@/app/_layout';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { hashPassword, saveSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    if (!fname.trim() || !lname.trim() || !username.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    const existing = await db.select().from(users).where(eq(users.username, username.trim()));
    if (existing.length > 0) {
      setError('Username already taken');
      return;
    }
    const hash = await hashPassword(password);
    await db.insert(users).values({
      username: username.trim(),
      password_hash: hash,
      created_at: new Date().toISOString(),
      fname: fname.trim(),
      lname: lname.trim(),
    });
    const inserted = await db.select().from(users).where(eq(users.username, username.trim()));
    const newUser = inserted[0];
    await saveSession(newUser.id);
    auth?.setCurrentUserId(newUser.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create account</Text>

        <FormField label="First name" value={fname} onChangeText={setFname} />
        <FormField label="Last name" value={lname} onChangeText={setLname} />
        <FormField label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} />
        <FormField label="Password" value={password} onChangeText={setPassword} secureTextEntry />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonRow}>
          <PrimaryButton label="Register" onPress={handleRegister} />
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton label="Already have an account? Log in" onPress={() => router.replace('/login')} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  container: {
    flexGrow: 1,
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