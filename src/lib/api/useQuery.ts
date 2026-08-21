import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

type UseQueryOptions<T> = {
  /** Calls Cloud Functions directly, bypassing the v1 proxy. */
  direct?: boolean;
  onCompleted?: (data: T) => void;
  onError?: (error: Error) => void;
};

export const useQuery = <T>(
  path: string,
  { direct, onCompleted, onError }: UseQueryOptions<T> = {},
) => {
  const { user: firebaseUser } = useFirebaseUser();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    if (!firebaseUser) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get<T>(path, direct)
      .then((result) => {
        setData(result);
        onCompleted?.(result);
      })
      .catch((err) => {
        const normalizedError =
          err instanceof Error ? err : new Error(`Failed to load ${path}`);
        setError(normalizedError);
        onError?.(normalizedError);
      })
      .finally(() => setLoading(false));
  }, [firebaseUser, path, direct, onCompleted, onError]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
};
