import { useCallback, useState } from "react";

export const useSignupForm = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const openProfileModal = useCallback(() => setShowProfileModal(true), []);
  const closeProfileModal = useCallback(() => setShowProfileModal(false), []);

  return { showProfileModal, openProfileModal, closeProfileModal };
};
