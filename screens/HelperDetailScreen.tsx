import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '../navigation/ChatStack';
import { colors } from '../theme/colors';
import { useHelperDetail } from '../hooks/useHelperDetail';
import { useChatFlow } from '../contexts/ChatFlowContext';

type Props = NativeStackScreenProps<ChatStackParamList, 'HelperDetail'>;

// Basic detail view reachable from the swipe/tap flow — full review
// history, availability calendar, and certifications are Phase 2 (spec
// section 3.5); this shows what the /helpers/:id endpoint returns today.
export function HelperDetailScreen({ route, navigation }: Props) {
  const { helperId } = route.params;
  const { data: helper, isLoading, isError } = useHelperDetail(helperId);
  const { startBookingForService } = useChatFlow();

  const handleBookAppointment = () => {
    if (!helper) return;
    startBookingForService({
      serviceId: helper.serviceId,
      helperName: helper.name,
      serviceTitle: helper.serviceTitle,
    });
    navigation.navigate('ChatHome');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <ActivityIndicator color={colors.teal} />
      </SafeAreaView>
    );
  }

  if (isError || !helper) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <Text style={styles.errorText}>Couldn't load this helper's profile.</Text>
      </SafeAreaView>
    );
  }

  const fullStars = Math.round(helper.rating);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {helper.photoUrl ? (
          <Image source={{ uri: helper.photoUrl }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Ionicons name="person" size={72} color={colors.grayLight} />
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.name}>{helper.name}</Text>
          {helper.areaName ? <Text style={styles.area}>{helper.areaName}</Text> : null}

          <View style={styles.statsRow}>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < fullStars ? 'star' : 'star-outline'}
                  size={16}
                  color={colors.teal}
                />
              ))}
              <Text style={styles.ratingText}>{helper.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.jobsText}>{helper.jobsCompleted} jobs completed</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{helper.serviceTitle}</Text>
            <Text style={styles.cardBody}>{helper.serviceDescription}</Text>
            <Text style={styles.fee}>${helper.fee.toFixed(0)} CAD</Text>
          </View>

          {helper.bio ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.cardBody}>{helper.bio}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Completion rate</Text>
            <Text style={styles.cardBody}>{helper.completionRate.toFixed(0)}% of jobs completed on time</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable testID="helper-detail-back" style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable testID="helper-detail-book" style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>Book an appointment</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  bookButton: {
    flex: 2,
    backgroundColor: colors.teal,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  scrollContent: {
    flexGrow: 1,
  },
  photo: {
    width: '100%',
    height: 280,
    backgroundColor: colors.tealLight,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
  },
  area: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  statsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink2,
  },
  jobsText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
  },
  card: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    backgroundColor: colors.tealLightest,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink2,
    marginBottom: 6,
  },
  cardBody: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink2,
    lineHeight: 20,
  },
  fee: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
});
