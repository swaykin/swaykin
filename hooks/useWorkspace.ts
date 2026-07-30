import { useContext } from "react";
import { WorkspaceContext } from "@/providers/WorkspaceProvider";

export const useWorkspace = () => {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return workspace;
};
