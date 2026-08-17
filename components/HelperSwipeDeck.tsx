import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { HelperCard } from './HelperCard';
import { colors } from '../theme/colors';
import type { HelperRecommendation } from '../services/helpersApi';

interface HelperSwipeDeckProps {
  helpers: HelperRecommendation[];
  onSwipeLeft?: (helper: HelperRecommendation) => void;
  onSwipeRight: (helper: HelperRecommendation) => void;
  onEmpty?: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const OUT_OF_SCREEN_X = SCREEN_WIDTH * 1.5;
const ANIMATION_DURATION = 220;

export function HelperSwipeDeck({ helpers, onSwipeLeft, onSwipeRight, onEmpty }: HelperSwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const current = helpers[index];
  const upNext = helpers[index + 1];

  const advance = (direction: 'left' | 'right', helper: HelperRecommendation) => {
    if (direction === 'left') {
      onSwipeLeft?.(helper);
    } else {
      onSwipeRight(helper);
    }

    translateX.value = 0;
    translateY.value = 0;

    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (nextIndex >= helpers.length) {
      onEmpty?.();
    }
  };

  const triggerSwipe = (direction: 'left' | 'right') => {
    if (!current) return;
    const targetX = direction === 'right' ? OUT_OF_SCREEN_X : -OUT_OF_SCREEN_X;
    translateX.value = withTiming(targetX, { duration: ANIMATION_DURATION }, (finished) => {
      if (finished) runOnJS(advance)(direction, current);
    });
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const isSwipeRight = event.translationX > SWIPE_THRESHOLD;
      const isSwipeLeft = event.translationX < -SWIPE_THRESHOLD;

      if (isSwipeRight || isSwipeLeft) {
        runOnJS(triggerSwipe)(isSwipeRight ? 'right' : 'left');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-12, 0, 12],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const passBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  if (!current) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={40} color={colors.teal} />
          <Text style={styles.emptyTitle}>That's everyone for now</Text>
          <Text style={styles.emptySubtitle}>Ask again later for more recommendations.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.deck}>
        {upNext ? (
          <View style={[styles.cardWrapper, styles.nextCardWrapper]}>
            <HelperCard helper={upNext} />
          </View>
        ) : null}

        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.cardWrapper, cardStyle]}>
            <HelperCard helper={current} onPressPhoto={() => triggerSwipe('right')} />
            <Animated.View style={[styles.badge, styles.likeBadge, likeBadgeStyle]}>
              <Text style={styles.badgeText}>VIEW</Text>
            </Animated.View>
            <Animated.View style={[styles.badge, styles.passBadge, passBadgeStyle]}>
              <Text style={styles.badgeText}>PASS</Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          testID="swipe-pass-button"
          style={[styles.actionButton, styles.passButton]}
          onPress={() => triggerSwipe('left')}
        >
          <Ionicons name="close" size={28} color={colors.pink} />
        </Pressable>
        <Pressable
          testID="swipe-view-button"
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => triggerSwipe('right')}
        >
          <Ionicons name="eye" size={24} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  deck: {
    flex: 1,
  },
  cardWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nextCardWrapper: {
    top: 10,
    transform: [{ scale: 0.96 }],
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 24,
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  likeBadge: {
    right: 20,
    borderColor: colors.teal,
    transform: [{ rotate: '12deg' }],
  },
  passBadge: {
    left: 20,
    borderColor: colors.pink,
    transform: [{ rotate: '-12deg' }],
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 20,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.pink,
  },
  viewButton: {
    backgroundColor: colors.teal,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
    textAlign: 'center',
  },
});
