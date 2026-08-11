import { useCallback, useState } from "react";
import { mockWorkspace } from "@/mocks/workspace";
import type { BrandProfile } from "@/modules/auth/types";

export const useWorkspaceForm = () => {
  const [brandProfile, setBrandProfile] = useState<BrandProfile>(
    mockWorkspace.brandProfile,
  );

  const onAction = useCallback((patch: Partial<BrandProfile>) => {
    const normalized =
      patch.instagramHandle !== undefined
        ? { ...patch, instagramHandle: patch.instagramHandle.replace(/^@/, "") }
        : patch;
    setBrandProfile((prev) => ({ ...prev, ...normalized }));
  }, []);

  const save = useCallback(() => {
    // No backend yet — local-only edit for now.
  }, []);

  return { brandProfile, onAction, save };
};
