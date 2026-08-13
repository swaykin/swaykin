"use client";

import { createContext, useContext } from "react";
import type { User } from "@/types/user";

export type UpdateUserPayload = Pick<User, "name" | "photoUrl" | "phoneNumber">;

export type UserContextValue = {
  user: User;
  onUpdateUser: (patch: Partial<UpdateUserPayload>) => Promise<void>;
};

export const UserContext = createContext<UserContextValue | null>(null);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return ctx;
};