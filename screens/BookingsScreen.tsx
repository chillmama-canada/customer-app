import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useUpcomingBookings } from '../hooks/useUpcomingBookings';
import type { UpcomingBooking } from '../services/bookingsApi';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function BookingRow({ booking }: { booking: UpcomingBooking }) {
  return (
    <View style={styles.row}>
      <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>
      <Text style={styles.detail}>with {booking.helperName}</Text>
      <Text style={styles.detail}>{formatDateTime(booking.scheduledAt)}</Text>
      {booking.address ? <Text style={styles.detail}>{booking.address}</Text> : null}
      <Text style={styles.fee}>${booking.amountCad.toFixed(0)} CAD</Text>
    </View>
  );
}

// Bookings made through the Chat assistant's booking flow show up here —
// this reads the same GET /api/mobile/bookings/upcoming the chat flow uses
// to check for existing bookings, refetched each time this tab gains focus.
export function BookingsScreen() {
  const { data: bookings, isLoading, isError, refetch } = useUpcomingBookings();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
        <Text style={styles.subtitle}>Couldn't load your bookings — pull to refresh or try again shortly.</Text>
      </SafeAreaView>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.container}>
          <Text style={styles.title}>No bookings yet</Text>
          <Text style={styles.subtitle}>
            Once you book a helper through Chat, you'll see your upcoming and past bookings here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <BookingRow booking={item} />}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.tealLightest,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  detail: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
  },
  fee: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
});
