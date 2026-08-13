import { useCallback, useState } from "react";
import { useWorkspaceContext } from "@/providers/WorkspaceProvider";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import type { WorkspaceDetails } from "@/types/workspace";

type BrandProfileFormState = WorkspaceDetails & { name: string };

export const useWorkspaceForm = () => {
  const { workspace, onUpdateWorkspace } = useWorkspaceContext();
  const { onSuccess, onError } = useSnackbar();
  const [details, setDetails] = useState<BrandProfileFormState>({
    name: workspace.name,
    ...workspace.details,
  });
  const [isSaving, setIsSaving] = useState(false);

  const onAction = useCallback((patch: Partial<BrandProfileFormState>) => {
    setDetails((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      await onUpdateWorkspace(details);
      onSuccess("Brand profile updated successfully");
    } catch {
      onError("Something went wrong saving your brand profile");
    } finally {
      setIsSaving(false);
    }
  }, [details, onUpdateWorkspace, onSuccess, onError]);

  return { details, onAction, save, isSaving };
};
