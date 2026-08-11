import { useCallback, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { BrandProfile } from "@/modules/auth/types";

export const useWorkspaceForm = () => {
  const { workspace, onUpdateWorkspace } = useWorkspace();
  const [brandProfile, setBrandProfile] = useState<BrandProfile>(
    workspace.brandProfile,
  );

  const onAction = useCallback((patch: Partial<BrandProfile>) => {
    setBrandProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(() => {
    onUpdateWorkspace({ brandProfile });
  }, [brandProfile, onUpdateWorkspace]);

  return { brandProfile, onAction, save };
};
