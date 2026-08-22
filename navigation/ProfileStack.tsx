import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LikedHelpersScreen } from '../screens/LikedHelpersScreen';
import { colors } from '../theme/colors';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  LikedHelpers: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.teal },
        headerTintColor: colors.white,
        headerTitleStyle: { color: colors.white },
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ headerTitle: 'Profile' }} />
      <Stack.Screen
        name="LikedHelpers"
        component={LikedHelpersScreen}
        options={{ headerTitle: 'Liked helpers' }}
      />
    </Stack.Navigator>
  );
}
