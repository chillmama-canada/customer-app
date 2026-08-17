import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatScreen } from '../screens/ChatScreen';
import { HelperDetailScreen } from '../screens/HelperDetailScreen';
import { ChatFlowProvider } from '../contexts/ChatFlowContext';

export type ChatStackParamList = {
  ChatHome: undefined;
  HelperDetail: { helperId: string };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

// Wrapped in its own provider (not lifted to App.tsx) so the conversation
// state is scoped to the Chat tab's lifetime — it resets if this stack ever
// remounts (e.g. on logout/login), rather than needing explicit teardown.
export function ChatStack() {
  return (
    <ChatFlowProvider>
      <Stack.Navigator>
        <Stack.Screen name="ChatHome" component={ChatScreen} options={{ headerTitle: 'Chillmama' }} />
        <Stack.Screen
          name="HelperDetail"
          component={HelperDetailScreen}
          options={{ headerTitle: 'Helper profile' }}
        />
      </Stack.Navigator>
    </ChatFlowProvider>
  );
}
