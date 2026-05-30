import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';

export const useApiQuery = (key, url, fallback) =>
  useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get(url);
      return data;
    },
    placeholderData: fallback,
    staleTime: 60_000
  });
