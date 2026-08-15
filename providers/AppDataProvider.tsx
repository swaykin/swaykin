"use client";

import { useCallback, type ReactNode } from "react";
import { api } from "@/lib/api";
import { useQuery } from "@/lib/api/useQuery";
import { AppTombstone } from "@/infra/components/AppTombstone";
import type { User } from "@/types/user";
import type { Workspace } from "@/types/workspace";
import {
  UserContext,
  type UpdateUserPayload,
} from "./UserProvider";
import {
  WorkspaceContext,
  type UpdateWorkspacePayload,
} from "./WorkspaceProvider";

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, setData: setUser } = useQuery<User>("/user");
  const { data: workspace, setData: setWorkspace } =
    useQuery<Workspace>("/workspace");

  const onUpdateUser = useCallback(
    (patch: Partial<UpdateUserPayload>) => {
      if (!user) return Promise.resolve();
      return api
        .post<User>("/user", {
          name: user.name,
          photoUrl: user.photoUrl,
          phoneNumber: user.phoneNumber,
          ...patch,
        })
        .then(setUser);
    },
    [user, setUser],
  );

  const onUpdateWorkspace = useCallback(
    (patch: Partial<UpdateWorkspacePayload>) => {
      if (!workspace) return Promise.resolve();
      return api
        .post<Workspace>("/workspace", {
          name: workspace.name,
          logoUrl: workspace.logoUrl,
          ...workspace.details,
          ...patch,
        })
        .then(setWorkspace);
    },
    [workspace, setWorkspace],
  );

  if (!user || !workspace) return <AppTombstone />;

  return (
    <WorkspaceContext.Provider value={{ workspace, onUpdateWorkspace }}>
      <UserContext.Provider value={{ user, onUpdateUser }}>
        {children}
      </UserContext.Provider>
    </WorkspaceContext.Provider>
  );
};
