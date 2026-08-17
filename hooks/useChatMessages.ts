import { useCallback, useState } from 'react';

export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  text: string;
}

const PLACEHOLDER_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    text: "Hi! I'm your Chillmama assistant. What kind of help do you need?",
  },
  {
    id: '2',
    role: 'user',
    text: 'I want to arrange a cleaning service tomorrow.',
  },
  {
    id: '3',
    role: 'assistant',
    text: 'Sure — do you have a preferred time of day, and any language preference for the helper?',
  },
];

// No AI or backend wired up yet — sending just appends the message locally.
export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>(PLACEHOLDER_MESSAGES);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', text: trimmed },
    ]);
  }, []);

  return { messages, sendMessage };
}
