import { useCallback, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { CurrentUser } from "@/mocks/user";

export const useProfileForm = () => {
  const { currentUser, onUpdateUser } = useCurrentUser();
  const [user, setUser] = useState<CurrentUser>(currentUser);

  const onAction = useCallback((patch: Partial<CurrentUser>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(() => {
    onUpdateUser(user);
  }, [user, onUpdateUser]);

  return { user, onAction, save };
};
