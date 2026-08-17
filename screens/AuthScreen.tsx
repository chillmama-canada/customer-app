import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Auth'>;

export function AuthScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../assets/mascot.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.wordmark}>
          <Text style={styles.wordmarkInk}>Chill</Text>
          <Text style={styles.wordmarkTeal}>mama</Text>
        </Text>
        <Text style={styles.subtitle}>Log in or create an account to get started.</Text>

        <View style={styles.actions}>
          <Pressable
            testID="auth-login-button"
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Log in</Text>
          </Pressable>
          <Pressable
            testID="auth-register-button"
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Create account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 96,
    height: 96,
  },
  wordmark: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '900',
  },
  wordmarkInk: {
    color: colors.ink,
  },
  wordmarkTeal: {
    color: colors.teal,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    textAlign: 'center',
  },
  actions: {
    marginTop: 32,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.teal,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
});
