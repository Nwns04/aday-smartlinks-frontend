import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../services/api';

export default function useAnalytics(userId, timeRange, searchTerm, statusFilter, sortBy) {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['analytics', userId, timeRange],
    queryFn: async () => {
      const res = await API.get(`/campaigns/analytics/${userId}?range=${timeRange}`);
      return res.data || [];
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const processed = useMemo(() => {
    const withMetrics = data.map(c => ({
      ...c,
      ctr: c.clicks ? ((c.clicks / (c.emailCount || 1)) * 100).toFixed(1) : 0,
      conversionRate: c.clicks ? ((c.emailCount / c.clicks) * 100).toFixed(1) : 0,
    }));

    const filtered = withMetrics
      .filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => statusFilter === 'all' || c.status === statusFilter);

    const sorted = [...filtered].sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));

    return { sorted, raw: data };
  }, [data, searchTerm, statusFilter, sortBy]);

  return { ...processed, loading: isLoading, error: isError };
}




