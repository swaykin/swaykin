import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useGetCompetitors } from "./useGetCompetitors";

/** The single call site for `useGetCompetitors` — everyone else gets this data passed down. */
export const useCompetitorState = () => {
  const { competitors, yourBrand, alerts } = useGetCompetitors();
  const [tab, setTab] = useLocalStorageState<"compare" | "deepdive">(
    "competitors:tab",
    "compare",
  );

  return { tab, setTab, competitors, yourBrand, alerts };
};

export type UseCompetitorState = ReturnType<typeof useCompetitorState>;
