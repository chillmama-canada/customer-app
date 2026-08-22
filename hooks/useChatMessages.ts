import type { HelperRecommendation } from '../services/helpersApi';
import type { UpcomingBooking } from '../services/bookingsApi';

export type ChatMessageRole = 'user' | 'assistant';

export interface TextChatMessage {
  id: string;
  kind: 'text';
  role: ChatMessageRole;
  text: string;
}

export interface QuickReplyOption {
  id: string;
  label: string;
  // Category picker only — falls back to the parent category's icon
  // server-side when a category has none of its own (see
  // GET /api/mobile/categories).
  iconUrl?: string | null;
}

export interface QuickRepliesChatMessage {
  id: string;
  kind: 'quick-replies';
  role: 'assistant';
  options: QuickReplyOption[];
  selectedOptionId?: string;
}

export interface HelperCardsChatMessage {
  id: string;
  kind: 'helper-cards';
  role: 'assistant';
  helpers: HelperRecommendation[];
}

export interface PreviousHelperChatMessage {
  id: string;
  kind: 'previous-helper';
  role: 'assistant';
  helper: HelperRecommendation;
}

export interface BookingListChatMessage {
  id: string;
  kind: 'booking-list';
  role: 'assistant';
  bookings: UpcomingBooking[];
  selectedBookingId?: string;
}

export interface SlotPickerChatMessage {
  id: string;
  kind: 'slot-picker';
  role: 'assistant';
  serviceId: string;
  helperName: string;
  serviceTitle: string;
  slots: string[];
  hasMore: boolean;
  resolved?: boolean;
  selectedSlot?: string;
}

export type ChatMessage =
  | TextChatMessage
  | QuickRepliesChatMessage
  | HelperCardsChatMessage
  | PreviousHelperChatMessage
  | BookingListChatMessage
  | SlotPickerChatMessage;

let idCounter = 0;
export function nextMessageId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}
