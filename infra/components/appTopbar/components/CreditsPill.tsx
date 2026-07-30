import Link from "next/link";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { useWorkspace } from "@/hooks/useWorkspace";

export const CreditsPill = () => {
  const workspace = useWorkspace();

  return (
    <Link
      href="/settings"
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
          {workspace.credits.toLocaleString("en-IN")}
        </Box>
        credits
      </Box>
    </Link>
  );
};
