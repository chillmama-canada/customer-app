import { useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '../navigation/ChatStack';
import { ChatInput } from '../components/ChatInput';
import { MessageBubble } from '../components/MessageBubble';
import { HelperSwipeDeck } from '../components/HelperSwipeDeck';
import { QuickReplies } from '../components/QuickReplies';
import { BookingListCard } from '../components/BookingListCard';
import { PreviousHelperCard } from '../components/PreviousHelperCard';
import { SlotPicker } from '../components/SlotPicker';
import { useChatFlow } from '../contexts/ChatFlowContext';
import type { ChatMessage } from '../hooks/useChatMessages';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatHome'>;

// The scripted Butler routine (greeting -> upcoming bookings -> new
// service -> category -> rebook-or-recommend -> swipe -> book -> confirm)
// lives in ChatFlowContext so HelperDetailScreen can continue the same
// conversation after "Book an appointment." This screen just renders it.
export function ChatScreen({ navigation }: Props) {
  const { messages, sendFreeText, selectQuickReply, selectBooking, selectSlot, requestMoreSlots } = useChatFlow();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const goToHelperDetail = (helperId: string) => navigation.navigate('HelperDetail', { helperId });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          style={styles.flex}
          contentContainerStyle={styles.listContent}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            switch (item.kind) {
              case 'helper-cards':
                return (
                  <View testID="chat-helper-cards-message" style={styles.cardsRow}>
                    <View style={styles.cardsContainer}>
                      <HelperSwipeDeck helpers={item.helpers} onSwipeRight={(helper) => goToHelperDetail(helper.id)} />
                    </View>
                  </View>
                );
              case 'previous-helper':
                return (
                  <PreviousHelperCard helper={item.helper} onPress={() => goToHelperDetail(item.helper.id)} />
                );
              case 'quick-replies':
                return <QuickReplies message={item} onSelect={(optionId) => selectQuickReply(item.id, optionId)} />;
              case 'booking-list':
                return (
                  <BookingListCard message={item} onSelect={(bookingId) => selectBooking(item.id, bookingId)} />
                );
              case 'slot-picker':
                return (
                  <SlotPicker
                    message={item}
                    onSelectSlot={(slot) => selectSlot(item.id, slot)}
                    onRequestMore={() => requestMoreSlots(item.id)}
                  />
                );
              case 'text':
              default:
                return <MessageBubble message={item} />;
            }
          }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
        <ChatInput onSend={sendFreeText} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
  },
  cardsRow: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  cardsContainer: {
    height: 460,
  },
});
