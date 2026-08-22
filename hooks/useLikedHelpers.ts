import { useQuery } from '@tanstack/react-query';
import { getLikedHelpers } from '../services/helpersApi';

export function useLikedHelpers() {
  return useQuery({
    queryKey: ['helpers', 'liked'],
    queryFn: getLikedHelpers,
  });
}
