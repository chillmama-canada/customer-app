import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

// Providers are UI-only for now — there's no backend OAuth token-exchange
// endpoint yet (see WEBAPP-CHANGES-NEEDED.md). Swap handlePress for the real
// sign-in flow once that's wired up.
const PROVIDERS = [
  { key: 'google', label: 'Continue with Google' },
  { key: 'apple', label: 'Continue with Apple' },
  { key: 'facebook', label: 'Continue with Facebook' },
] as const;

export function SsoButtons() {
  const handlePress = (label: string) => {
    Alert.alert('Coming soon', `${label} isn't available yet — use email and password for now.`);
  };

  return (
    <View>
      {PROVIDERS.map((provider) => (
        <Pressable
          key={provider.key}
          testID={`sso-${provider.key}-button`}
          style={styles.button}
          onPress={() => handlePress(provider.label)}
        >
          <Text style={styles.buttonText}>{provider.label}</Text>
        </Pressable>
      ))}

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
