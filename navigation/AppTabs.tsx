import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatStack } from './ChatStack';
import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

export type AppTabParamList = {
  Chat: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const ICONS: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
  Chat: 'chatbubble-ellipses',
  Bookings: 'calendar',
  Profile: 'person-circle',
};

const TAB_LABELS: Record<keyof AppTabParamList, string> = {
  Chat: 'Chillmama',
  Bookings: 'My Bookings',
  Profile: 'Profile',
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'Chat',
        headerTitle: TAB_LABELS[route.name],
        tabBarLabel: route.name === 'Chat' ? 'Chat' : TAB_LABELS[route.name],
        tabBarActiveTintColor: colors.tealDark,
        tabBarInactiveTintColor: colors.grayLight,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof AppTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
