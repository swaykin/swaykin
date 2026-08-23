import { useCallback, useMemo, useState } from "react";
import type { WorkspaceDetails } from "@/types/workspace";

type BrandProfileFormState = WorkspaceDetails & { name: string };

const EMPTY_BRAND_PROFILE: BrandProfileFormState = {
  name: "",
  igUsername: "",
  industry: "",
  website: "",
  descriptions: "",
  voice: "",
  audience: "",
};

export const useBrandProfileForm = (onComplete: () => void) => {
  const [details, setDetails] =
    useState<BrandProfileFormState>(EMPTY_BRAND_PROFILE);

  const onAction = useCallback((patch: Partial<BrandProfileFormState>) => {
    setDetails((prev) => ({ ...prev, ...patch }));
  }, []);

  const canContinue = useMemo(
    () =>
      details.name.trim().length > 0 && details.igUsername.trim().length > 0,
    [details.name, details.igUsername],
  );

  const submit = useCallback(() => {
    if (!canContinue) return;
    onComplete();
  }, [canContinue, onComplete]);

  return { details, setDetails, onAction, canContinue, submit };
};
