"use client";

import { createContext, type ReactNode } from "react";
import { mockCurrentUser, type CurrentUser } from "@/mocks/user";

export const UserContext = createContext<CurrentUser | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext.Provider value={mockCurrentUser}>
      {children}
    </UserContext.Provider>
  );
};
