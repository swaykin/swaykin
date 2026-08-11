import { Box } from "@/infra/baseweb/Box";
import { Avatar } from "@/infra/baseweb/Avatar";
import { useWorkspace } from "@/hooks/useWorkspace";

const AVATAR_OVERRIDES = {
  Root: {
    style: {
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
      borderBottomLeftRadius: "8px",
    },
  },
};

export const Workspace = () => {
  const { workspace } = useWorkspace();
  return (
    <Box className="mx-3 mb-2.5 flex items-center gap-2.5 rounded-[10px] border border-border bg-sunken px-2.5 py-2">
      <Avatar
        name={workspace.name}
        size="28px"
        fillColor="var(--sk-accent)"
        fontSize="11px"
        overrides={AVATAR_OVERRIDES}
      />
      <Box className="min-w-0 flex-1">
        <Box className="truncate text-[13px] font-semibold leading-tight text-text">
          {workspace.name}
        </Box>
        <Box className="text-[10.5px] leading-tight text-text-tertiary">
          {workspace.type}
        </Box>
      </Box>
    </Box>
  );
};
