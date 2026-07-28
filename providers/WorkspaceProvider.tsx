"use client";

import { createContext, type ReactNode } from "react";
import { mockWorkspace, type Workspace } from "@/mocks/workspace";

export const WorkspaceContext = createContext<Workspace | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  return <WorkspaceContext.Provider value={mockWorkspace}>{children}</WorkspaceContext.Provider>;
}
