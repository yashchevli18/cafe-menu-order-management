import { useCallback, useEffect, useState } from 'react';
import { getMenuItems } from '../services/menuService';

const initialState = { items: [], pagination: null, loading: true, error: null };

const useMenuItems = (params) => {
  const [state, setState] = useState(initialState);
  const [reloadToken, setReloadToken] = useState(0);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, loading: true, error: null }));

    getMenuItems(JSON.parse(paramsKey), { signal: controller.signal })
      .then(({ items, pagination }) => setState({ items, pagination, loading: false, error: null }))
      .catch((error) => {
        if (error.isCanceled) return;
        setState({ items: [], pagination: null, loading: false, error: error.message });
      });

    return () => controller.abort();
  }, [paramsKey, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  return { ...state, refetch };
};

export default useMenuItems;
