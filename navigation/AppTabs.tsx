import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatStack } from './ChatStack';
import { ProfileStack } from './ProfileStack';
import { BookingsScreen } from '../screens/BookingsScreen';
import { PerksScreen } from '../screens/PerksScreen';
import { colors } from '../theme/colors';

export type AppTabParamList = {
  Chat: undefined;
  Bookings: undefined;
  Perks: undefined;
  Profile: undefined;
};

const ICONS: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
  Chat: 'chatbubble-ellipses',
  Bookings: 'calendar',
  Perks: 'pricetags',
  Profile: 'person-circle',
};

const TAB_LABELS: Record<keyof AppTabParamList, string> = {
  Chat: 'Chillmama',
  Bookings: 'My Bookings',
  Perks: 'Perks',
  Profile: 'Profile',
};

const ACTIVE_TINT = colors.white;
const INACTIVE_TINT = 'rgba(255, 255, 255, 0.6)';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Chat and Profile render their own nested stacks (each screen sets
        // its own header there) — showing a header here too would double up.
        headerShown: route.name !== 'Chat' && route.name !== 'Profile',
        headerTitle: TAB_LABELS[route.name],
        headerStyle: { backgroundColor: colors.teal },
        headerTintColor: colors.white,
        headerTitleStyle: { color: colors.white },
        tabBarLabel: route.name === 'Chat' ? 'Chat' : TAB_LABELS[route.name],
        tabBarActiveTintColor: ACTIVE_TINT,
        tabBarInactiveTintColor: INACTIVE_TINT,
        tabBarStyle: { backgroundColor: colors.teal, borderTopWidth: 0 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof AppTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Perks" component={PerksScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
