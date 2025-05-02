// src/hooks/useDashboardAnalytics.js
import { useQuery } from '@tanstack/react-query'
import API from '../services/api'
import { toast } from 'react-hot-toast'

// fetcher
const fetchAnalytics = async (userId) => {
  const { data } = await API.get(`/campaigns/analytics/${userId}`)
  return data
}

/**
 * Returns { data, isLoading, isError, refetch }
 */
export default function useDashboardAnalytics(userId) {
  return useQuery(
    ['dashboardAnalytics', userId],
    () => fetchAnalytics(userId),
    {
      enabled: Boolean(userId),
      staleTime: 1000 * 60 * 5,    // 5m
      cacheTime: 1000 * 60 * 60,   // 1h
      retry: 2,
      onError: () => {
        toast.error('Failed to load analytics')
      }
    }
  )
}
