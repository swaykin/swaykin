import { useCallback } from "react";
import { useMutation } from "@/lib/api/useMutation";
import type { CreatorLookupResponse } from "../types";

export const useGetCreatorByUsername = () => {
  const { data, loading, error, mutate } = useMutation<
    CreatorLookupResponse,
    { igUsername: string }
  >("/creator", { direct: true });

  const getCreator = useCallback(
    (igUsername: string) => mutate({ igUsername }),
    [mutate],
  );

  return { data, loading, error, getCreator };
};
