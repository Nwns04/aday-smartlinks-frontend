import { useQuery } from '@tanstack/react-query'
import API from '../services/api'

export default function usePublicCampaign(slug) {
  return useQuery({
    queryKey: ['publicCampaign', slug],
    queryFn: async () => {
      const { data } = await API.get(`/campaigns/public/${slug}`)
      return data
    },
    enabled: !!slug,
    retry: 2,
  })
}
