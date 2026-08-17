import { useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../components/ChatInput';
import { MessageBubble } from '../components/MessageBubble';
import { useChatMessages } from '../hooks/useChatMessages';
import type { ChatMessage } from '../hooks/useChatMessages';

export function ChatScreen() {
  const { messages, sendMessage } = useChatMessages();
  const listRef = useRef<FlatList<ChatMessage>>(null);

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
          renderItem={({ item }) => <MessageBubble message={item} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
        <ChatInput onSend={sendMessage} />
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
});
