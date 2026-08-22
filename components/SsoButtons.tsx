import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Providers are UI-only for now — there's no backend OAuth token-exchange
// endpoint yet (see WEBAPP-CHANGES-NEEDED.md). Swap handlePress for the real
// sign-in flow once that's wired up.
const PROVIDERS = [
  { key: 'google', label: 'Continue with Google', icon: 'logo-google' },
  { key: 'apple', label: 'Continue with Apple', icon: 'logo-apple' },
  { key: 'facebook', label: 'Continue with Facebook', icon: 'logo-facebook' },
] as const;

export function SsoButtons() {
  const handlePress = (label: string) => {
    Alert.alert('Coming soon', `${label} isn't available yet — use email and password for now.`);
  };

  return (
    <View>
      <View style={styles.row}>
        {PROVIDERS.map((provider) => (
          <Pressable
            key={provider.key}
            testID={`sso-${provider.key}-button`}
            accessibilityLabel={provider.label}
            style={styles.button}
            onPress={() => handlePress(provider.label)}
          >
            <Ionicons name={provider.icon} size={22} color={colors.ink} />
          </Pressable>
        ))}
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
});
