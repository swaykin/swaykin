import { useCallback, useState } from "react";
import { useUserContext } from "@/providers/UserProvider";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import type { User } from "@/types/user";

export const useProfileForm = () => {
  const { user: initialUser, onUpdateUser } = useUserContext();
  const { onSuccess, onError } = useSnackbar();
  const [user, setUser] = useState<User>(initialUser);
  const [isSaving, setIsSaving] = useState(false);

  const onAction = useCallback((patch: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      await onUpdateUser(user);
      onSuccess("Profile updated successfully");
    } catch {
      onError("Something went wrong saving your profile");
    } finally {
      setIsSaving(false);
    }
  }, [user, onUpdateUser, onSuccess, onError]);

  return { user, onAction, save, isSaving };
};
