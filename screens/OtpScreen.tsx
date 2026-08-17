import { useEffect, useState } from 'react';
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
import { verifyOtp, resendOtp, AuthApiError } from '../services/authApi';
import { saveTokens } from '../services/tokenStorage';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

const RESEND_COOLDOWN_SECONDS = 60;

export function OtpScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const { signIn } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  // Only ever set when the backend is outside its production environment —
  // see debugOtpField() in the webapp's src/lib/auth/otp.ts. __DEV__ is a
  // second, independent gate so this can never surface in a release build.
  const [devOtp, setDevOtp] = useState(route.params.debugOtp);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    setError('');
    setInfo('');
    if (otp.length !== 6) {
      setError('Enter the 6-digit code.');
      return;
    }

    setVerifying(true);
    try {
      const result = await verifyOtp({ email, otp });
      await saveTokens(result.accessToken, result.refreshToken);
      signIn(result.customer);
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);
    try {
      const result = await resendOtp({ email });
      setInfo('A new code is on its way.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setDevOtp(result.debugOtp);
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to <Text style={styles.emailText}>{email}</Text>. Enter it below
            to finish creating your account.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {info ? <Text style={styles.infoText}>{info}</Text> : null}

          {__DEV__ && devOtp ? (
            <Pressable
              testID="otp-dev-fill-button"
              style={styles.devBanner}
              onPress={() => setOtp(devOtp)}
            >
              <Text style={styles.devBannerText}>
                Dev mode — no email is actually sent. Code: <Text style={styles.devBannerCode}>{devOtp}</Text>{' '}
                (tap to fill)
              </Text>
            </Pressable>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Verification code</Text>
            <TextInput
              testID="otp-code-input"
              style={styles.otpInput}
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="000000"
              placeholderTextColor={colors.grayLight}
              keyboardType="number-pad"
              maxLength={6}
              editable={!verifying}
            />
          </View>

          <Pressable
            testID="otp-verify-button"
            style={[styles.primaryButton, (verifying || otp.length !== 6) && styles.primaryButtonDisabled]}
            onPress={handleVerify}
            disabled={verifying || otp.length !== 6}
          >
            {verifying ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>Verify</Text>
            )}
          </Pressable>

          <Pressable
            testID="otp-resend-button"
            style={styles.linkRow}
            onPress={handleResend}
            disabled={resending || cooldown > 0}
          >
            <Text style={styles.linkText}>
              {cooldown > 0 ? (
                `Resend code in ${cooldown}s`
              ) : resending ? (
                'Sending...'
              ) : (
                <>
                  Didn't get it? <Text style={styles.linkTextBold}>Resend code</Text>
                </>
              )}
            </Text>
          </Pressable>

          <Pressable
            testID="otp-goto-register"
            style={styles.linkRow}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>Wrong email? Go back</Text>
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
    lineHeight: 20,
  },
  emailText: {
    fontWeight: '700',
    color: colors.ink2,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.pink,
  },
  infoText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.tealDark,
  },
  devBanner: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.pink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.tealLightest,
  },
  devBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink2,
    lineHeight: 17,
  },
  devBannerCode: {
    fontWeight: '900',
    color: colors.tealDark,
  },
  field: {
    marginTop: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink2,
    marginBottom: 6,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 12,
    textAlign: 'center',
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
