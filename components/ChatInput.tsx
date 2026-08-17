import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Message Chillmama..."
        placeholderTextColor="#8E8E93"
        multiline
        onSubmitEditing={handleSend}
      />
      <Pressable
        style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!text.trim()}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F1F1F4',
    borderRadius: 20,
    marginRight: 8,
    color: '#1C1C1E',
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
