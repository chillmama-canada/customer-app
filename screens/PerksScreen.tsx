import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { usePromotions } from '../hooks/usePromotions';
import type { Promotion } from '../services/promotionsApi';

function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const textColor = isLightColor(promotion.bgColor) ? colors.ink : colors.white;
  return (
    <View style={[styles.card, { backgroundColor: promotion.bgColor }]}>
      <Text style={[styles.cardTitle, { color: textColor }]}>{promotion.title}</Text>
      <Text style={[styles.cardBody, { color: textColor }]}>{promotion.description}</Text>
      <View style={[styles.ctaButton, { borderColor: textColor }]}>
        <Text style={[styles.ctaText, { color: textColor }]}>{promotion.ctaText}</Text>
      </View>
    </View>
  );
}

// Daily perks/discounts — reuses the same Promotion data the webapp admin
// panel manages, not a separate mobile-only concept.
export function PerksScreen() {
  const { data: promotions, isLoading, isError } = usePromotions();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <ActivityIndicator color={colors.teal} />
      </SafeAreaView>
    );
  }

  if (isError || !promotions || promotions.length === 0) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.emptyTitle}>No perks right now</Text>
        <Text style={styles.emptySubtitle}>Check back soon for daily perks and discounts.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {promotions.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 32,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  cardBody: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  ctaButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '800',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
