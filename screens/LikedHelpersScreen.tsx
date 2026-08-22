import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import { useLikedHelpers } from '../hooks/useLikedHelpers';
import { unlikeHelperService, type HelperRecommendation } from '../services/helpersApi';

function LikedHelperRow({ helper, onUnlike }: { helper: HelperRecommendation; onUnlike: (serviceId: string) => void }) {
  return (
    <View style={styles.row}>
      {helper.photoUrl ? (
        <Image source={{ uri: helper.photoUrl }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <Ionicons name="person" size={24} color={colors.grayLight} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {helper.name}
        </Text>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {helper.serviceTitle}
        </Text>
        <View style={styles.statsRow}>
          <Ionicons name="star" size={13} color={colors.teal} />
          <Text style={styles.statsText}>{helper.rating.toFixed(1)}</Text>
          <Text style={styles.statsDivider}>·</Text>
          <Text style={styles.statsText}>${helper.fee.toFixed(0)} CAD</Text>
        </View>
      </View>

      <Pressable
        testID={`unlike-${helper.serviceId}`}
        style={styles.unlikeButton}
        onPress={() => onUnlike(helper.serviceId)}
      >
        <Ionicons name="heart" size={22} color={colors.pink} />
      </Pressable>
    </View>
  );
}

// Helpers the customer swiped right on (see HelperSwipeDeck) — the Butler
// also prioritizes these when a matching category is recommended again.
export function LikedHelpersScreen() {
  const { data: helpers, isLoading, isError } = useLikedHelpers();
  const queryClient = useQueryClient();

  const unlikeMutation = useMutation({
    mutationFn: unlikeHelperService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpers', 'liked'] });
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <ActivityIndicator color={colors.teal} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.emptySubtitle}>Couldn't load your liked helpers — try again shortly.</Text>
      </SafeAreaView>
    );
  }

  if (!helpers || helpers.length === 0) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.emptyTitle}>No liked helpers yet</Text>
        <Text style={styles.emptySubtitle}>
          Swipe right on a helper in Chat to save them here for later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={helpers}
        keyExtractor={(item) => item.serviceId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <LikedHelperRow helper={item} onUnlike={(serviceId) => unlikeMutation.mutate(serviceId)} />
        )}
      />
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
  listContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.tealLight,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  serviceTitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: colors.tealDark,
  },
  statsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  statsDivider: {
    fontSize: 12,
    color: colors.grayLight,
  },
  unlikeButton: {
    padding: 8,
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
