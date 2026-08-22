import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/ProfileStack';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

// UI shell — account preferences/settings aren't wired up yet. Name/email
// come from whatever the last login/register response returned (see
// AuthContext + services/customerStorage.ts), not a live profile fetch.
export function ProfileScreen({ navigation }: Props) {
  const { customer, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  };

  const initial = customer?.name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <Text testID="profile-name" style={styles.name}>
          {customer?.name ?? 'Unknown'}
        </Text>
        <Text testID="profile-email" style={styles.email}>
          {customer?.email ?? '—'}
        </Text>

        <Text style={styles.subtitle}>Preferences and account settings are coming soon.</Text>

        <Pressable
          testID="profile-liked-helpers-button"
          style={styles.menuRow}
          onPress={() => navigation.navigate('LikedHelpers')}
        >
          <Ionicons name="heart" size={18} color={colors.pink} />
          <Text style={styles.menuRowText}>Liked helpers</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.grayLight} />
        </Pressable>

        <Pressable
          testID="profile-logout-button"
          style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color={colors.pink} />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={18} color={colors.pink} />
              <Text style={styles.logoutButtonText}>Log out</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.tealDark,
  },
  name: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
  email: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '500',
    color: colors.grayLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.pink,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: colors.pink,
    fontSize: 15,
    fontWeight: '700',
  },
});
