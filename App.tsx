import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthStack } from './navigation/AuthStack';
import { AppTabs } from './navigation/AppTabs';
import { SplashScreen } from './screens/SplashScreen';
import { queryClient } from './services/queryClient';

ExpoSplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {status === 'authenticated' ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
