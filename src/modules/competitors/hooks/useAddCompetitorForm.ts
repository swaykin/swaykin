import { useCallback, useState } from "react";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import { useMutation } from "@/lib/api/useMutation";

type AddCompetitorsResult = {
  results: { input: string; igHandle?: string; error?: string }[];
};

export const useAddCompetitorForm = (onAdded?: () => void) => {
  const { onSuccess } = useSnackbar();
  const [showAddInput, setShowAddInput] = useState(false);
  const [newHandle, setNewHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, loading } = useMutation<
    AddCompetitorsResult,
    { accounts: string[] }
  >("/addCompetitors", { direct: true });

  const toggleAddInput = useCallback(() => setShowAddInput((v) => !v), []);

  const submitAddCompetitor = useCallback(async () => {
    const handle = newHandle.trim();
    if (!handle) {
      setError("Enter an Instagram handle to track.");
      return;
    }

    setError(null);
    const result = await mutate({ accounts: [handle] });
    const outcome = result?.results?.[0];

    if (!outcome || outcome.error) {
      setError(outcome?.error ?? "Couldn't reach the server — try again.");
      return;
    }

    onSuccess(`Tracking @${outcome.igHandle} — crunching their last 90 days of data…`);
    setNewHandle("");
    setShowAddInput(false);
    onAdded?.();
  }, [mutate, newHandle, onAdded, onSuccess]);

  return {
    showAddInput,
    toggleAddInput,
    newHandle,
    setNewHandle,
    submitAddCompetitor,
    submitting: loading,
    error,
  };
};
