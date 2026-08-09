import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";

const GENERIC_ERROR = "Something went wrong signing you in.";

// Codes the backend sends via the `#error=` fragment when the Google account's
// existing-account state doesn't match the `intent` we sent it (see googleSignIn.ts).
const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  account_not_found:
    "No SwayKin account found for that Google account — try signing up instead.",
  account_exists:
    "An account already exists for that Google account — try logging in instead.",
};

const resolveErrorMessage = (code: string | null) =>
  (code && KNOWN_ERROR_MESSAGES[code]) || GENERIC_ERROR;

export const useAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const hasRunRef = useRef(false);

  useEffect(() => {
    // The hash token is consumed exactly once (read + stripped from the URL) — React Strict
    // Mode's dev-only double-invoke would otherwise run this a second time against an
    // already-stripped hash and misfire the failure path before the real result lands.
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const failurePath = intent === "signup" ? "/signup" : "/login";
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const token = hashParams.get("token");
    const errorCode = hashParams.get("error");
    window.history.replaceState(null, "", window.location.pathname);

    const redirectToFailure = (code: string | null) =>
      router.replace(
        `${failurePath}?error=${encodeURIComponent(resolveErrorMessage(code))}`,
      );

    if (!token) {
      redirectToFailure(errorCode);
      return;
    }

    signInWithCustomToken(auth, token)
      .then(() => {
        router.replace(intent === "signup" ? "/signup?complete=1" : "/");
      })
      .catch(() => redirectToFailure(null));
  }, [router, intent]);
};
