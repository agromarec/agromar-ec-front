import { AgroMarApi } from '@/api/AgroMarApi';
import { to } from '@/helpers';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';



export const useFetch = <T>(url: string, options: { acumulative?: boolean } = {}) => {
  const isMounted = useRef(true);
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: null | string }>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async (fetchTo?: string) => {
    if (!isMounted.current) return;
    const [res, error] = await to<AxiosResponse<T>>(AgroMarApi.get(fetchTo || url));

    if (error) {
      setState({ data: null, loading: false, error: error.message });
      return;
    }

    if (options?.acumulative) {
      setState((state) => {
        const oldData = state.data || [];
        const newData = [...(oldData as any), ...(res.data as any)];
        return ({ data: newData, loading: false, error: null } as any);
      });
      return;
    }

    setState({ data: res.data, loading: false, error: null });


  }, [url, options.acumulative]);

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

  // const mutate = useCallback(async (data: any) => {
  //   if (!isMounted.current) return;
  //   setState({ data: null, loading: true, error: null });

  //   const [res, error] = await to<AxiosResponse<T>>(AgroMarApi.post(url, data));

  //   if (error) {
  //     setState({ data: null, loading: false, error: error.message });
  //     return;
  //   }

  //   setState({ data: res.data, loading: false, error: null });
  // }, [url]);

  const refetch = useCallback(async (url?: string) => {
    if (options.acumulative) {
      setState(state => ({ ...state, loading: true, error: null }));
    } else {
      setState({ data: null, loading: true, error: null });
    }

    await fetchData(url);
  }, [fetchData, options.acumulative]);

  return {
    ...state,
    refetch,
  };
};