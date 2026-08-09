import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useSignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("complete") === "1") {
      setShowProfileModal(true);
      router.replace("/signup");
    }
  }, [searchParams, router]);

  const closeProfileModal = useCallback(() => setShowProfileModal(false), []);

  return { showProfileModal, closeProfileModal };
};
