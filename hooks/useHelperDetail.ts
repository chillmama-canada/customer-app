import { useQuery } from '@tanstack/react-query';
import { getHelperDetail } from '../services/helpersApi';

export function useHelperDetail(helperId: string) {
  return useQuery({
    queryKey: ['helpers', 'detail', helperId],
    queryFn: () => getHelperDetail(helperId),
    enabled: Boolean(helperId),
  });
}
