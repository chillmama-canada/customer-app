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
import { register, AuthApiError } from '../services/authApi';
import { SsoButtons } from '../components/SsoButtons';
import { validatePassword, PASSWORD_HINT } from '../services/passwordValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Fill in your name, email, and password.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const result = await register({ name: name.trim(), email: email.trim(), password });
      navigation.navigate('Otp', { email: result.email, debugOtp: result.debugOtp });
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Just a few details to get started.</Text>

          <View style={styles.ssoSection}>
            <SsoButtons />
          </View>

          <View style={styles.form}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                testID="register-name-input"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Jane Doe"
                placeholderTextColor={colors.grayLight}
                autoComplete="name"
                editable={!loading}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                testID="register-email-input"
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
                testID="register-password-input"
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text.slice(0, 16))}
                placeholder="e.g. Chillmama1!"
                placeholderTextColor={colors.grayLight}
                secureTextEntry
                autoComplete="password-new"
                maxLength={16}
                editable={!loading}
              />
              <Text style={styles.hintText}>{PASSWORD_HINT}</Text>
            </View>

            <Pressable
              testID="register-submit-button"
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Create account</Text>
              )}
            </Pressable>
          </View>

          <Pressable
            testID="register-goto-login"
            style={styles.linkRow}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Log in</Text>
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
  form: {
    marginTop: 4,
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
  hintText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: colors.grayLight,
    lineHeight: 16,
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
    marginTop: 24,
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
