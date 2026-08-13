import { useCallback, useMemo, useState } from "react";
import type { WorkspaceDetails } from "@/types/workspace";

type BrandProfileFormState = WorkspaceDetails & { name: string };

const EMPTY_BRAND_PROFILE: BrandProfileFormState = {
  name: "",
  igusername: "",
  industry: "",
  website: "",
  descriptions: "",
  voice: "",
  audience: "",
};

export const useBrandProfileForm = (onComplete: () => void) => {
  const [details, setDetails] = useState<BrandProfileFormState>(
    EMPTY_BRAND_PROFILE,
  );

  const onAction = useCallback((patch: Partial<BrandProfileFormState>) => {
    setDetails((prev) => ({ ...prev, ...patch }));
  }, []);

  const canContinue = useMemo(
    () => details.name.trim().length > 0 && details.igusername.trim().length > 0,
    [details.name, details.igusername],
  );

  const submit = useCallback(() => {
    if (!canContinue) return;
    onComplete();
  }, [canContinue, onComplete]);

  return { details, setDetails, onAction, canContinue, submit };
};
