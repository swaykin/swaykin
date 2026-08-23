import { useCallback, useState } from "react";
import { api } from "@/lib/api";

type UseMutationOptions<T> = {
  /** Calls Cloud Functions directly, bypassing the v1 proxy's 60s timeout. */
  direct?: boolean;
  onCompleted?: (data: T) => void;
  onError?: (error: Error) => void;
};

export const useMutation = <T, TVariables = unknown>(
  path: string,
  { direct, onCompleted, onError }: UseMutationOptions<T> = {},
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables?: TVariables) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.post<T>(path, variables, direct);
        setData(result);
        onCompleted?.(result);
        return result;
      } catch (err) {
        const normalizedError =
          err instanceof Error ? err : new Error(`Failed to call ${path}`);
        setError(normalizedError);
        onError?.(normalizedError);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [path, direct, onCompleted, onError],
  );

  return { data, loading, error, mutate };
};
