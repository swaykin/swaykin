import { useCallback, useMemo, useState } from "react";

export const useBrandProfileForm = (onComplete: () => void) => {
  const [brandName, setBrandName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const handleInstagramHandleChange = useCallback((value: string) => {
    setInstagramHandle(value.replace(/^@/, ""));
  }, []);

  const canContinue = useMemo(
    () => brandName.trim().length > 0 && instagramHandle.trim().length > 0,
    [brandName, instagramHandle],
  );

  const submit = useCallback(() => {
    if (!canContinue) return;
    onComplete();
  }, [canContinue, onComplete]);

  return {
    brandName,
    setBrandName,
    instagramHandle,
    handleInstagramHandleChange,
    industry,
    setIndustry,
    website,
    setWebsite,
    description,
    setDescription,
    brandVoice,
    setBrandVoice,
    targetAudience,
    setTargetAudience,
    canContinue,
    submit,
  };
};
