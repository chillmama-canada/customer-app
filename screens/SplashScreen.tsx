import { Image, StyleSheet, Text, View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { colors } from '../theme/colors';

// Shown while AuthContext checks for a stored session — see contexts/AuthContext.tsx
// for the minimum-display timing and the session check itself.
export function SplashScreen() {
  return (
    <View style={styles.container} onLayout={() => ExpoSplashScreen.hideAsync()}>
      <Image
        source={require('../assets/mascot.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.wordmark}>
        <Text style={styles.wordmarkInk}>Chill</Text>
        <Text style={styles.wordmarkTeal}>mama</Text>
      </Text>
      <Text style={styles.tagline}>Your family's helper, on call.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tealLightest,
  },
  logo: {
    width: 140,
    height: 140,
  },
  wordmark: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '900',
  },
  wordmarkInk: {
    color: colors.ink,
  },
  wordmarkTeal: {
    color: colors.teal,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
});
