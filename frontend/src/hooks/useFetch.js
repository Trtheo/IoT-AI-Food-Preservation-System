import { useState, useEffect, useCallback } from "react";

function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

export function useFetch(fetchFn, interval = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      try {
        const result = await withTimeout(fetchFn());
        setData(result);
        setError(null);
      } catch (e) {
        const msg = e?.response?.data?.error || e?.response?.data?.message || e.message;
        setError(msg);
        if (e?.response?.status === 404 || e?.message?.includes("404")) {
          setData(null);
        }
      } finally {
        setLoading(false);
        if (isManual) setRefreshing(false);
      }
    },
    [fetchFn]
  );

  const refetch = useCallback(() => load(true), [load]);

  useEffect(() => {
    setData(null);
    setLoading(true);
    load(false);
    if (interval) {
      const id = setInterval(() => load(false), interval);
      return () => clearInterval(id);
    }
  }, [load, interval]);

  return { data, loading, refreshing, error, refetch };
}
