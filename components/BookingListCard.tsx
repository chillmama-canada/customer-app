import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { BookingListChatMessage } from '../hooks/useChatMessages';

interface BookingListCardProps {
  message: BookingListChatMessage;
  onSelect: (bookingId: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function BookingListCard({ message, onSelect }: BookingListCardProps) {
  const resolved = Boolean(message.selectedBookingId);

  return (
    <View style={styles.row}>
      <View style={styles.container}>
        {message.bookings.map((booking) => {
          const isSelected = message.selectedBookingId === booking.id;
          return (
            <Pressable
              key={booking.id}
              testID={`booking-row-${booking.id}`}
              style={[styles.row_, isSelected && styles.rowSelected, resolved && !isSelected && styles.rowDimmed]}
              onPress={() => onSelect(booking.id)}
              disabled={resolved}
            >
              <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>
              <Text style={styles.detail}>with {booking.helperName}</Text>
              <Text style={styles.detail}>{formatDate(booking.scheduledAt)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  container: {
    width: '92%',
    gap: 8,
  },
  row_: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.white,
  },
  rowSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealLightest,
  },
  rowDimmed: {
    opacity: 0.5,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  detail: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
  },
});
