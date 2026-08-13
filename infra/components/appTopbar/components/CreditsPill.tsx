import Link from "next/link";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { useWorkspaceContext } from "@/providers/WorkspaceProvider";

export const CreditsPill = () => {
  const { workspace } = useWorkspaceContext();

  return (
    <Link
      href="/settings?tab=credits"
      className="text-[11.5px] text-text-tertiary no-underline"
    >
      <Box className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-sunken px-2.5">
        <Icon
          name="ph-coin"
          weight="fill"
          size={14}
          color="var(--sk-accent-strong)"
        />
        <Box as="span" className="text-[12.5px] font-bold text-text">
          {workspace.creditBalance.toLocaleString("en-IN")}
        </Box>
        credits
      </Box>
    </Link>
  );
};
