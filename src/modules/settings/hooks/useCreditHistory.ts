import { useQuery } from "@/lib/api/useQuery";
import type { CreditHistoryEntry } from "@/mocks/credits";

interface CreditHistoryResponse {
  history: CreditHistoryEntry[];
}

const formatHistoryDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** Loads credit ledger rows for the signed-in workspace. */
export const useCreditHistory = () => {
  const { data, loading, error, refetch } = useQuery<CreditHistoryResponse>(
    "/credits/history",
  );

  const history = (data?.history ?? []).map((entry) => ({
    ...entry,
    date: formatHistoryDate(entry.date),
  }));

  return { history, loading, error, refetch };
};
