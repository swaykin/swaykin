"use client";

import { useContext } from "react";
import { WorkspaceContext } from "@/providers/WorkspaceProvider";

export function useWorkspace() {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return workspace;
}
