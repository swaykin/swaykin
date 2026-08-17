import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Reads a one-shot `?error=` param (set by the auth callback on failure), shows it, then
 * strips it from the URL so a refresh doesn't keep re-surfacing the same error. */
export const useAuthErrorParam = (basePath: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const paramError = searchParams.get("error");
    if (!paramError) return;
    setError(paramError);
    router.replace(basePath);
  }, [searchParams, router, basePath]);

  return error;
};
