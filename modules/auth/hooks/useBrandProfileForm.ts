import { useCallback, useMemo, useState } from "react";
import type { BrandProfile } from "../types";

const EMPTY_BRAND_PROFILE: BrandProfile = {
  brandName: "",
  instagramHandle: "",
  industry: "",
  website: "",
  description: "",
  brandVoice: "",
  targetAudience: "",
};

export const useBrandProfileForm = (onComplete: () => void) => {
  const [brandProfile, setBrandProfile] =
    useState<BrandProfile>(EMPTY_BRAND_PROFILE);

  const onAction = useCallback((patch: Partial<BrandProfile>) => {
    const normalized =
      patch.instagramHandle !== undefined
        ? { ...patch, instagramHandle: patch.instagramHandle.replace(/^@/, "") }
        : patch;
    setBrandProfile((prev) => ({ ...prev, ...normalized }));
  }, []);

  const canContinue = useMemo(
    () =>
      brandProfile.brandName.trim().length > 0 &&
      brandProfile.instagramHandle.trim().length > 0,
    [brandProfile.brandName, brandProfile.instagramHandle],
  );

  const submit = useCallback(() => {
    if (!canContinue) return;
    onComplete();
  }, [canContinue, onComplete]);

  return { brandProfile, setBrandProfile, onAction, canContinue, submit };
};
