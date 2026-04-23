import { AuthContext } from '@/app/_layout';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function AvatarButton() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [initials, setInitials] = useState('');

  useEffect(() => {
    const loadInitials = async () => {
      if (auth?.currentUserId == null) {
        setInitials('');
        return;
      }
      const rows = await db.select().from(users).where(eq(users.id, auth.currentUserId));
      if (rows[0]) {
        const fi = rows[0].fname.charAt(0).toUpperCase();
        const li = rows[0].lname.charAt(0).toUpperCase();
        setInitials(`${fi}${li}`);
      }
    };
    void loadInitials();
  }, [auth?.currentUserId]);

  if (!initials) return null;

  return (
    <Pressable
      accessibilityLabel="Open profile"
      accessibilityRole="button"
      onPress={() => router.push('/profile')}
      style={({ pressed }) => [styles.avatar, pressed ? styles.pressed : null]}
    >
      <Text style={styles.text}>{initials}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#1E5F8A',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});