import { AgroMarApi } from '@/api/AgroMarApi';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useFetch = <T>(url: string) => {
  const isMounted = useRef(true);
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: null }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      const { data } = await AgroMarApi.get(url);

      if (isMounted.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (error) {
      if (isMounted.current) {
        setState({ data: null, loading: false, error: (error as any)?.message });
      }
    }
  }, [url]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setState({ data: null, loading: true, error: null });
    fetchData();
  }, [fetchData]);

  return state;
};