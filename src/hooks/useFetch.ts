import { AgroMarApi } from '@/api/AgroMarApi';
import { to } from '@/helpers';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useFetch = <T>(url: string) => {
  const isMounted = useRef(true);
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: null | string }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;
    const [res, error] = await to<AxiosResponse<T>>(AgroMarApi.get(url));

    if (error) {
      setState({ data: null, loading: false, error: error.message });
      return;
    }

    setState({ data: res.data, loading: false, error: null });
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