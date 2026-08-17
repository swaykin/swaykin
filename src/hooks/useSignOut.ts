import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const useSignOut = () => {
  const router = useRouter();

  return useCallback(() => {
    signOut(auth).then(() => router.replace("/login"));
  }, [router]);
};
