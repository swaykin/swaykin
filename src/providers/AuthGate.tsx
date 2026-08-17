"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

type AuthGateProps = {
  require: "authenticated" | "unauthenticated";
  redirectTo: string;
  fallback?: ReactNode;
  children: ReactNode;
};

export const AuthGate = ({
  require,
  redirectTo,
  fallback = null,
  children,
}: AuthGateProps) => {
  const { user, loading } = useFirebaseUser();
  const router = useRouter();
  const satisfied = require === "authenticated" ? !!user : !user;

  useEffect(() => {
    if (!loading && !satisfied) {
      router.replace(redirectTo);
    }
  }, [loading, satisfied, redirectTo, router]);

  return !loading && satisfied ? <>{children}</> : fallback;
};
