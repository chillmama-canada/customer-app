import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { SlotPickerChatMessage } from '../hooks/useChatMessages';

interface SlotPickerProps {
  message: SlotPickerChatMessage;
  onSelectSlot: (slotIso: string) => void;
  onRequestMore: () => void;
}

function formatSlot(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function SlotPicker({ message, onSelectSlot, onRequestMore }: SlotPickerProps) {
  const disabled = Boolean(message.resolved);

  return (
    <View style={styles.row}>
      <View style={styles.container}>
        {message.slots.map((slot) => {
          const isSelected = message.selectedSlot === slot;
          return (
            <Pressable
              key={slot}
              testID={`slot-${slot}`}
              style={[styles.chip, isSelected && styles.chipSelected, disabled && !isSelected && styles.chipDimmed]}
              onPress={() => onSelectSlot(slot)}
              disabled={disabled}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{formatSlot(slot)}</Text>
            </Pressable>
          );
        })}

        {message.hasMore ? (
          <Pressable
            testID="slot-picker-more"
            style={[styles.moreButton, disabled && styles.chipDimmed]}
            onPress={onRequestMore}
            disabled={disabled}
          >
            <Text style={styles.moreButtonText}>Show more times</Text>
          </Pressable>
        ) : null}
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
  chip: {
    borderWidth: 1,
    borderColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.teal,
  },
  chipDimmed: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.tealDark,
    textAlign: 'center',
  },
  chipTextSelected: {
    color: colors.white,
  },
  moreButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray,
    textDecorationLine: 'underline',
  },
});
