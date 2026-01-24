import useSWR from 'swr';
import api from '@/utils/axios';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data;
};

export const useCurrentUser = () => {
  const pathname = usePathname();
  
  const { data, mutate, isLoading, error } = useSWR(
    "/auth/currentuser",
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000, 
    }
  );

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  return {
    user: data,
    isLoading,
    isError: error,
    mutate, 
    isAuthenticated: !!data && !error,
    isAdmin: data?.data?.role === "admin"
  };
};