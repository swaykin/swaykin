import { useState } from "react";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";

export const useAddCompetitorForm = () => {
  const { onSuccess, onError } = useSnackbar();
  const [showAddInput, setShowAddInput] = useState(false);
  const [newHandle, setNewHandle] = useState("");

  const toggleAddInput = () => setShowAddInput((v) => !v);

  const submitAddCompetitor = () => {
    if (!newHandle.trim()) {
      onError("Enter an Instagram handle to track.");
      return;
    }
    onSuccess(
      `Tracking @${newHandle.replace("@", "")} — crunching their last 90 days of data…`,
    );
    setNewHandle("");
    setShowAddInput(false);
  };

  return {
    showAddInput,
    toggleAddInput,
    newHandle,
    setNewHandle,
    submitAddCompetitor,
  };
};
