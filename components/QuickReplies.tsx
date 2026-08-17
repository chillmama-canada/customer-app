import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { QuickRepliesChatMessage } from '../hooks/useChatMessages';

interface QuickRepliesProps {
  message: QuickRepliesChatMessage;
  onSelect: (optionId: string) => void;
}

export function QuickReplies({ message, onSelect }: QuickRepliesProps) {
  const resolved = Boolean(message.selectedOptionId);

  return (
    <View style={styles.row}>
      <View style={styles.container}>
        {message.options.map((option) => {
          const isSelected = message.selectedOptionId === option.id;
          return (
            <Pressable
              key={option.id}
              testID={`quick-reply-${option.id}`}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                resolved && !isSelected && styles.chipDimmed,
              ]}
              onPress={() => onSelect(option.id)}
              disabled={resolved}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{option.label}</Text>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    maxWidth: '92%',
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.teal,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.teal,
  },
  chipDimmed: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.tealDark,
  },
  chipTextSelected: {
    color: colors.white,
  },
});
