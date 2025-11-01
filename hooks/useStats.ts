'use client';

import { useQuery } from '@tanstack/react-query';
import type { DashboardStats } from '@/lib/types';
import { useDatabase } from '@/contexts/DatabaseContext';

export function useStats() {
  const { database } = useDatabase();
  
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', database],
    queryFn: async () => {
      const response = await fetch(`/api/stats?database=${database}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      return response.json();
    },
    refetchInterval: 3 * 60 * 1000, // 3 minutes (180,000ms)
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

