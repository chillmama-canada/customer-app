import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { colors } from '../theme/colors';
import { login, AuthApiError } from '../services/authApi';
import { saveTokens } from '../services/tokenStorage';
import { SsoButtons } from '../components/SsoButtons';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login({ email: email.trim(), password });
      await saveTokens(result.accessToken, result.refreshToken);
      signIn(result.customer);
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>Welcome back — pick up right where you left off.</Text>

          <View style={styles.ssoSection}>
            <SsoButtons />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              testID="login-email-input"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.grayLight}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              testID="login-password-input"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.grayLight}
              secureTextEntry
              autoComplete="password"
              editable={!loading}
            />
          </View>

          <Pressable
            testID="login-submit-button"
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Log in</Text>
            )}
          </Pressable>

          <Pressable
            testID="login-goto-register"
            style={styles.linkRow}
            onPress={() => navigation.replace('Register')}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkTextBold}>Create one</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.ink,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  ssoSection: {
    marginTop: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.pink,
  },
  field: {
    marginTop: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink2,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  primaryButton: {
    marginTop: 28,
    backgroundColor: colors.teal,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  linkRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: colors.gray,
  },
  linkTextBold: {
    color: colors.tealDark,
    fontWeight: '700',
  },
});
