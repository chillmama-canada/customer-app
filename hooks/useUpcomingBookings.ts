import { useQuery } from '@tanstack/react-query';
import { getUpcomingBookings } from '../services/bookingsApi';

export function useUpcomingBookings() {
  return useQuery({
    queryKey: ['bookings', 'upcoming'],
    queryFn: getUpcomingBookings,
  });
}
