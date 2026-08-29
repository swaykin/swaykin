import { useCallback, useState } from "react";
import { ApiError, api } from "@/lib/api";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import { useWorkspaceContext } from "@/providers/WorkspaceProvider";

interface AddCompetitorsResponse {
  results: Array<{
    input: string;
    igHandle?: string;
    status?: string;
    error?: string;
    alreadyTracked?: boolean;
  }>;
  creditsDeducted?: number;
}

export const useAddCompetitorForm = () => {
  const { onSuccess, onError } = useSnackbar();
  const { refetchWorkspace } = useWorkspaceContext();
  const [showAddInput, setShowAddInput] = useState(false);
  const [newHandle, setNewHandle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleAddInput = useCallback(() => setShowAddInput((v) => !v), []);

  const submitAddCompetitor = useCallback(async () => {
    const handle = newHandle.trim();
    if (!handle) {
      onError("Enter an Instagram handle to track.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<AddCompetitorsResponse>("/v1/competitors/add", {
        accounts: [handle],
      });
      const failed = res.results.find((r) => r.error);
      if (failed) {
        onError(failed.error ?? "Could not add competitor.");
        return;
      }
      const alreadyTracked = res.results.find((r) => r.alreadyTracked);
      if (alreadyTracked) {
        onSuccess(`Already tracking @${handle}.`);
        setNewHandle("");
        setShowAddInput(false);
        refetchWorkspace();
        return;
      }
      onSuccess(`Tracking @${handle} — crunching their last 90 days of data…`);
      setNewHandle("");
      setShowAddInput(false);
      refetchWorkspace();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 402) {
          onError("Not enough credits to add this competitor.");
          return;
        }
        if (err.status === 409) {
          onError(err.message);
          return;
        }
      }
      onError(err instanceof Error ? err.message : "Could not add competitor.");
    } finally {
      setSubmitting(false);
    }
  }, [newHandle, onError, onSuccess, refetchWorkspace]);

  return {
    showAddInput,
    toggleAddInput,
    newHandle,
    setNewHandle,
    submitAddCompetitor,
    submitting,
  };
};
