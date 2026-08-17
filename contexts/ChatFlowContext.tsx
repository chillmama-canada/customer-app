import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  getCategories,
  getUpcomingBookings,
  getSlots,
  createBooking,
  type Category,
  type UpcomingBooking,
} from '../services/bookingsApi';
import { getRecommendedHelpers, getPreviousHelpers, type HelperRecommendation } from '../services/helpersApi';
import {
  nextMessageId,
  type ChatMessage,
  type QuickReplyOption,
} from '../hooks/useChatMessages';

// Stand-in for real intent parsing until the AI backend is wired up — see
// OPEN-QUESTIONS.md "AI chatbot backend architecture." The scripted routine
// below (greeting -> upcoming bookings -> new service -> category ->
// rebook-or-recommend -> swipe -> book -> confirm) runs once per login and
// simulates what a real assistant would do; free text still gets the
// simpler keyword-triggered swipe-deck shortcut from before.
const RESPONSE_DELAY_MS = 550;
const BOOKING_INTENT_PATTERN = /\b(clean(?:ing)?|book(?:ing)?|helpers?|nann(?:y|ies)|babysit(?:ter|ting)?|sitter)\b/i;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface StartBookingParams {
  serviceId: string;
  helperName: string;
  serviceTitle: string;
}

interface ChatFlowContextValue {
  messages: ChatMessage[];
  sendFreeText: (text: string) => void;
  selectQuickReply: (messageId: string, optionId: string) => void;
  selectBooking: (messageId: string, bookingId: string) => void;
  selectSlot: (messageId: string, slotIso: string) => void;
  requestMoreSlots: (messageId: string) => void;
  startBookingForService: (params: StartBookingParams) => void;
}

const ChatFlowContext = createContext<ChatFlowContextValue | undefined>(undefined);

export function ChatFlowProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Mirrors `messages` for handlers that need a synchronous, always-current
  // read (e.g. "find the message this tap belongs to") without performing
  // side effects inside a setState updater — React may invoke updater
  // callbacks more than once (notably under Strict Mode in dev), so any
  // side effect (API call, appending another message) placed inside one
  // could double-fire, which is a real bug for e.g. booking creation.
  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const selectedCategoryRef = useRef<{ id: string; name: string } | null>(null);
  const greetedRef = useRef(false);

  const appendMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...newMessages]);
  }, []);

  const patchMessage = useCallback((messageId: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? ({ ...m, ...patch } as ChatMessage) : m))
    );
  }, []);

  const assistantTurn = useCallback(
    async (build: () => ChatMessage[] | Promise<ChatMessage[]>) => {
      await wait(RESPONSE_DELAY_MS);
      const built = await build();
      if (built.length > 0) appendMessages(built);
    },
    [appendMessages]
  );

  const text = useCallback(
    (body: string): ChatMessage => ({ id: nextMessageId('text'), kind: 'text', role: 'assistant', text: body }),
    []
  );

  const quickReplies = useCallback(
    (options: QuickReplyOption[]): ChatMessage => ({
      id: nextMessageId('qr'),
      kind: 'quick-replies',
      role: 'assistant',
      options,
    }),
    []
  );

  // ── Step F: swipe-deck recommendations ──────────────────────────
  const showRecommendations = useCallback(
    async (categoryId?: string) => {
      await assistantTurn(async () => {
        let helpers: HelperRecommendation[];
        try {
          helpers = await getRecommendedHelpers(categoryId);
        } catch {
          return [text("I couldn't load helper recommendations just now — please try again shortly.")];
        }
        if (helpers.length === 0) {
          return [text('I couldn’t find any helpers for that right now — please try again shortly.')];
        }
        return [
          text('Here are some helpers — swipe through, or tap a photo to see more.'),
          { id: nextMessageId('cards'), kind: 'helper-cards', role: 'assistant', helpers },
        ];
      });
    },
    [assistantTurn, text]
  );

  // ── Step E: recommend vs. rebook a previous helper ──────────────
  const checkPreviousHelper = useCallback(
    async (categoryId: string, categoryName: string) => {
      let previous: HelperRecommendation[] = [];
      try {
        previous = await getPreviousHelpers(categoryId);
      } catch {
        // fall through to recommendations if this lookup fails
      }

      if (previous.length === 0) {
        await showRecommendations(categoryId);
        return;
      }

      const priorHelper = previous[0];
      await assistantTurn(() => [
        text(
          `Would you like me to recommend new helpers for ${categoryName}, or rebook ${priorHelper.name}, who you've used before?`
        ),
        quickReplies([
          { id: `rebook:${priorHelper.id}`, label: `Rebook ${priorHelper.name}` },
          { id: 'recommend', label: 'Show me recommendations' },
        ]),
      ]);
    },
    [assistantTurn, showRecommendations, text, quickReplies]
  );

  // ── Step D: category picker ──────────────────────────────────────
  const askCategory = useCallback(async () => {
    await assistantTurn(async () => {
      let categories: Category[];
      try {
        categories = await getCategories();
      } catch {
        return [text("I couldn't load service categories just now — please try again shortly.")];
      }
      return [
        text('What kind of help do you need?'),
        quickReplies(categories.map((c) => ({ id: `category:${c.id}:${c.name}`, label: c.name }))),
      ];
    });
  }, [assistantTurn, text, quickReplies]);

  // ── Step C: ask about a new service ───────────────────────────────
  // `hasNoBookings` distinguishes "you genuinely have zero upcoming
  // bookings" (step B's own fall-through) from "you have some, but chose
  // not to review them right now" (declining the booking-list's "Not right
  // now" option) — those need different wording, not the same claim that
  // you have nothing upcoming.
  const askNewService = useCallback(
    async (hasNoBookings: boolean) => {
      await assistantTurn(() => [
        text(
          hasNoBookings
            ? "You don't have any upcoming bookings. Would you like to book a new service?"
            : 'No problem. Would you like to book another service?'
        ),
        quickReplies([
          { id: 'new-service:yes', label: 'Yes, please' },
          { id: 'new-service:no', label: 'Not right now' },
        ]),
      ]);
    },
    [assistantTurn, text, quickReplies]
  );

  // ── Step B: check upcoming bookings ──────────────────────────────
  const checkUpcomingBookings = useCallback(async () => {
    let bookings: UpcomingBooking[] = [];
    let fetchFailed = false;

    await assistantTurn(async () => {
      try {
        bookings = await getUpcomingBookings();
      } catch {
        fetchFailed = true;
        return [text("I couldn't load your bookings just now — please try again shortly.")];
      }

      if (bookings.length === 0) return [];

      const plural = bookings.length > 1;
      return [
        text(
          plural
            ? `You have ${bookings.length} upcoming bookings. Want help with one of them?`
            : 'You have an upcoming booking. Want help with it?'
        ),
        { id: nextMessageId('bookings'), kind: 'booking-list', role: 'assistant', bookings },
        quickReplies([{ id: 'bookings:none', label: 'Not right now' }]),
      ];
    });

    if (!fetchFailed && bookings.length === 0) {
      await askNewService(true);
    }
  }, [assistantTurn, text, quickReplies, askNewService]);

  // ── Step 1: greeting, runs once per login ────────────────────────
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;

    (async () => {
      await assistantTurn(() => [
        text(`Hi ${customer?.name?.split(' ')[0] ?? 'there'}! I'm your Chillmama assistant.`),
      ]);
      await checkUpcomingBookings();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── User interaction handlers ─────────────────────────────────────

  const sendFreeText = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      appendMessages([{ id: nextMessageId('user'), kind: 'text', role: 'user', text: trimmed }]);

      if (BOOKING_INTENT_PATTERN.test(trimmed)) {
        showRecommendations();
      }
    },
    [appendMessages, showRecommendations]
  );

  const selectBooking = useCallback(
    (messageId: string, bookingId: string) => {
      const msg = messagesRef.current.find((m) => m.id === messageId);
      if (!msg || msg.kind !== 'booking-list' || msg.selectedBookingId) return;
      const booking = msg.bookings.find((b) => b.id === bookingId);
      if (!booking) return;

      patchMessage(messageId, { selectedBookingId: bookingId });
      appendMessages([
        { id: nextMessageId('user'), kind: 'text', role: 'user', text: `Tell me about my ${booking.serviceTitle} booking` },
      ]);
      assistantTurn(() => [
        text(
          `Your ${booking.serviceTitle} with ${booking.helperName} is scheduled for ${formatDateTime(
            booking.scheduledAt
          )}${booking.address ? ` at ${booking.address}` : ''}. Fee: $${booking.amountCad.toFixed(0)} CAD.`
        ),
        text("I can't reschedule or cancel bookings yet, but that's coming soon! Let me know if there's anything else."),
      ]);
    },
    [patchMessage, appendMessages, assistantTurn, text]
  );

  const selectQuickReply = useCallback(
    (messageId: string, optionId: string) => {
      const msg = messagesRef.current.find((m) => m.id === messageId);
      if (!msg || msg.kind !== 'quick-replies' || msg.selectedOptionId) return;
      const option = msg.options.find((o) => o.id === optionId);
      if (!option) return;

      patchMessage(messageId, { selectedOptionId: optionId });
      appendMessages([{ id: nextMessageId('user'), kind: 'text', role: 'user', text: option.label }]);

      if (optionId === 'bookings:none') {
        askNewService(false);
      } else if (optionId === 'new-service:yes') {
        askCategory();
      } else if (optionId === 'new-service:no') {
        assistantTurn(() => [text("No problem — I'm here whenever you need help.")]);
      } else if (optionId.startsWith('category:')) {
        const [, categoryId, categoryName] = optionId.split(':');
        selectedCategoryRef.current = { id: categoryId, name: categoryName };
        checkPreviousHelper(categoryId, categoryName);
      } else if (optionId === 'recommend') {
        showRecommendations(selectedCategoryRef.current?.id);
      } else if (optionId.startsWith('rebook:')) {
        const helperId = optionId.slice('rebook:'.length);
        assistantTurn(async () => {
          const prev = await getPreviousHelpers(selectedCategoryRef.current?.id ?? '');
          const helper = prev.find((h) => h.id === helperId);
          if (!helper) return [text("I couldn't find that helper's details — please try again.")];
          return [{ id: nextMessageId('prev'), kind: 'previous-helper', role: 'assistant', helper }];
        });
      }
    },
    [patchMessage, appendMessages, askNewService, askCategory, checkPreviousHelper, showRecommendations, assistantTurn, text]
  );

  const startBookingForService = useCallback(
    ({ serviceId, helperName, serviceTitle }: StartBookingParams) => {
      assistantTurn(async () => {
        try {
          const result = await getSlots(serviceId, 0);
          if (result.slots.length === 0) {
            return [text(`I couldn't find any open times for ${helperName} right now — please try again later.`)];
          }
          return [
            text(`Great choice! Here are a few times that work for both you and ${helperName}:`),
            {
              id: nextMessageId('slots'),
              kind: 'slot-picker',
              role: 'assistant',
              serviceId,
              helperName,
              serviceTitle,
              slots: result.slots,
              hasMore: result.hasMore,
            },
          ];
        } catch {
          return [text("I couldn't check availability just now — please try again shortly.")];
        }
      });
    },
    [assistantTurn, text]
  );

  const requestMoreSlots = useCallback(
    (messageId: string) => {
      const msg = messagesRef.current.find((m) => m.id === messageId);
      if (!msg || msg.kind !== 'slot-picker' || msg.resolved) return;

      patchMessage(messageId, { resolved: true });
      const nextOffset = msg.slots.length;

      assistantTurn(async () => {
        try {
          const result = await getSlots(msg.serviceId, nextOffset);
          if (result.slots.length === 0) {
            return [text("That's all the open times I have for now — let me know if you'd like to try a different helper.")];
          }
          return [
            {
              id: nextMessageId('slots'),
              kind: 'slot-picker',
              role: 'assistant',
              serviceId: msg.serviceId,
              helperName: msg.helperName,
              serviceTitle: msg.serviceTitle,
              slots: result.slots,
              hasMore: result.hasMore,
            },
          ];
        } catch {
          return [text("I couldn't check availability just now — please try again shortly.")];
        }
      });
    },
    [patchMessage, assistantTurn, text]
  );

  const selectSlot = useCallback(
    (messageId: string, slotIso: string) => {
      const msg = messagesRef.current.find((m) => m.id === messageId);
      if (!msg || msg.kind !== 'slot-picker' || msg.resolved) return;

      patchMessage(messageId, { resolved: true, selectedSlot: slotIso });
      appendMessages([{ id: nextMessageId('user'), kind: 'text', role: 'user', text: formatDateTime(slotIso) }]);

      assistantTurn(async () => {
        try {
          const booking = await createBooking({ serviceId: msg.serviceId, scheduledAt: slotIso });
          return [
            text(
              `You're all set! Your ${booking.serviceTitle} with ${booking.helperName} is confirmed for ${formatDateTime(
                booking.scheduledAt
              )}. Let me know if there's anything else I can help with.`
            ),
          ];
        } catch (err) {
          return [
            text(err instanceof Error ? err.message : "That time didn't go through — please try picking another slot."),
          ];
        }
      });
    },
    [patchMessage, appendMessages, assistantTurn, text]
  );

  const value: ChatFlowContextValue = {
    messages,
    sendFreeText,
    selectQuickReply,
    selectBooking,
    selectSlot,
    requestMoreSlots,
    startBookingForService,
  };

  return <ChatFlowContext.Provider value={value}>{children}</ChatFlowContext.Provider>;
}

export function useChatFlow(): ChatFlowContextValue {
  const context = useContext(ChatFlowContext);
  if (!context) throw new Error('useChatFlow must be used within a ChatFlowProvider');
  return context;
}
