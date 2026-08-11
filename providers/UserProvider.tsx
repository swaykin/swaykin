"use client";

import { createContext, useCallback, useState, type ReactNode } from "react";
import { mockCurrentUser, type CurrentUser } from "@/mocks/user";

export type UserContextValue = {
  currentUser: CurrentUser;
  onUpdateUser: (patch: Partial<CurrentUser>) => void;
};

export const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(mockCurrentUser);

  const onUpdateUser = useCallback((patch: Partial<CurrentUser>) => {
    setCurrentUser((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, onUpdateUser }}>
      {children}
    </UserContext.Provider>
  );
};
