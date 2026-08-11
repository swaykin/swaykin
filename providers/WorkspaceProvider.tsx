"use client";

import { createContext, useCallback, useState, type ReactNode } from "react";
import { mockWorkspace, type Workspace } from "@/mocks/workspace";

export type WorkspaceContextValue = {
  workspace: Workspace;
  onUpdateWorkspace: (patch: Partial<Workspace>) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
  null,
);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspace, setWorkspace] = useState<Workspace>(mockWorkspace);

  const onUpdateWorkspace = useCallback((patch: Partial<Workspace>) => {
    setWorkspace((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspace, onUpdateWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
