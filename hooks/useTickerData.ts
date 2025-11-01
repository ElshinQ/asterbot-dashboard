'use client';

import { useQuery } from '@tanstack/react-query';

// Always fetch ticker data from Ichigo database (fixed, doesn't change with switcher)
export function useTickerData() {
  return useQuery<{
    currentPrice: number;
    highestPrice: number;
    lowestPrice: number;
  }>({
    queryKey: ['ticker-data-ichigo'],
    queryFn: async () => {
      const response = await fetch(`/api/stats?database=ichigo`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ticker data');
      }

      const data = await response.json();
      return {
        currentPrice: data.currentPrice,
        highestPrice: data.highestPrice,
        lowestPrice: data.lowestPrice,
      };
    },
    refetchInterval: 3 * 60 * 1000, // 3 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

