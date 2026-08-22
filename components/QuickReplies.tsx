import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { QuickRepliesChatMessage } from '../hooks/useChatMessages';

interface QuickRepliesProps {
  message: QuickRepliesChatMessage;
  onSelect: (optionId: string) => void;
}

export function QuickReplies({ message, onSelect }: QuickRepliesProps) {
  const resolved = Boolean(message.selectedOptionId);
  const hasIcons = message.options.some((o) => 'iconUrl' in o);

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
              {hasIcons ? (
                option.iconUrl ? (
                  <Image source={{ uri: option.iconUrl }} style={styles.chipIcon} resizeMode="contain" />
                ) : (
                  <Ionicons
                    name="pricetag-outline"
                    size={16}
                    color={isSelected ? colors.white : colors.tealDark}
                    style={styles.chipIconFallback}
                  />
                )
              ) : null}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  chipIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  chipIconFallback: {
    marginRight: 6,
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
