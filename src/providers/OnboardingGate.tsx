/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandProfileModal } from "@/modules/auth/components/BrandProfileModal";

/** Shows the post-signup Brand Profile modal once, when a fresh signup lands here via
 * `?onboarding=1` — has to live in the authenticated shell rather than on `/signup` itself,
 * since by the time this fires the user is already signed in and `/signup` redirects
 * authenticated visitors away before the modal could ever render. */
export const OnboardingGate = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("onboarding") === "1") {
      setIsOpen(true);
      router.replace("/");
    }
  }, [searchParams, router]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {children}
      <BrandProfileModal isOpen={isOpen} onClose={close} onComplete={close} />
    </>
  );
};
