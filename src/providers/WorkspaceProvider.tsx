"use client";

import { createContext, useContext } from "react";
import type { Workspace, WorkspaceDetails } from "@/types/workspace";

export type UpdateWorkspacePayload = WorkspaceDetails &
  Pick<Workspace, "name" | "logoUrl">;

export type WorkspaceContextValue = {
  workspace: Workspace;
  onUpdateWorkspace: (patch: Partial<UpdateWorkspacePayload>) => Promise<void>;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
  null,
);

export const useWorkspaceContext = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return ctx;
};
