import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { HelperRecommendation } from '../services/helpersApi';

interface HelperCardProps {
  helper: HelperRecommendation;
  // Tapping the photo itself opens the detail view — matches the dating-app
  // swipe convention more closely than requiring a separate button tap.
  onPressPhoto?: () => void;
}

export function HelperCard({ helper, onPressPhoto }: HelperCardProps) {
  const fullStars = Math.round(helper.rating);

  const photo = helper.photoUrl ? (
    <Image source={{ uri: helper.photoUrl }} style={styles.photoFill} resizeMode="cover" />
  ) : (
    <View style={[styles.photoFill, styles.photoPlaceholder]}>
      <Ionicons name="person" size={64} color={colors.grayLight} />
    </View>
  );

  return (
    <View style={styles.card}>
      {onPressPhoto ? (
        <Pressable testID="helper-card-photo" style={styles.photo} onPress={onPressPhoto}>
          {photo}
        </Pressable>
      ) : (
        <View style={styles.photo}>{photo}</View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {helper.name}
        </Text>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {helper.serviceTitle}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < fullStars ? 'star' : 'star-outline'}
                size={15}
                color={colors.teal}
                style={styles.star}
              />
            ))}
            <Text style={styles.ratingText}>{helper.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.jobsText}>{helper.jobsCompleted} jobs</Text>
        </View>

        <Text style={styles.fee}>${helper.fee.toFixed(0)} CAD</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  photo: {
    flex: 1,
    backgroundColor: colors.tealLight,
  },
  photoFill: {
    flex: 1,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 18,
    backgroundColor: colors.white,
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
  serviceTitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.tealDark,
  },
  statsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink2,
  },
  jobsText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
  },
  fee: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
});
