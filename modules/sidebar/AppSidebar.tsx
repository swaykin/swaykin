"use client";

import { usePathname } from "next/navigation";
import { Box } from "@/infra/components/Box";
import { Icon } from "@/infra/components/Icon";
import { Avatar } from "@/infra/components/Avatar";
import { useWorkspace } from "@/hooks/useWorkspace";
import { navItems, outreachItem } from "./navItems";
import { SidebarNavLink } from "./SidebarNavLink";

export function AppSidebar() {
  const pathname = usePathname();
  const workspace = useWorkspace();

  return (
    <Box
      as="nav"
      className="sticky left-0 top-0 flex h-screen w-[248px] min-w-[248px] flex-shrink-0 flex-col border-r bg-[var(--sk-sidebar-bg)] border-[var(--sk-sidebar-border)]"
    >
      <Box className="flex items-center gap-2 px-5 pb-2.5 pt-4">
        <Box className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] bg-accent">
          <Icon name="ph-sparkle" weight="fill" size={11} color="#fff" />
        </Box>
        <Box as="span" className="text-[13px] font-bold tracking-[-0.01em] text-text">
          SwayKin
        </Box>
      </Box>

      <Box className="mx-3 mb-2.5 flex items-center gap-2.5 rounded-[10px] border border-border bg-sunken px-2.5 py-2">
        <Avatar
          initials={workspace.initials}
          size="28px"
          overrides={{
            Root: {
              style: {
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                borderBottomLeftRadius: "8px",
                backgroundColor: "var(--sk-accent)",
                flexShrink: 0,
              },
            },
            Initials: { style: { color: "#fff", fontWeight: 700, fontSize: "11px" } },
          }}
        />
        <Box className="min-w-0 flex-1">
          <Box className="truncate text-[13px] font-semibold leading-tight text-text">{workspace.name}</Box>
          <Box className="text-[10.5px] leading-tight text-text-tertiary">{workspace.type}</Box>
        </Box>
      </Box>

      <Box className="flex-1 overflow-y-auto px-2.5 pb-2.5 pt-1">
        {navItems.map((item) => (
          <SidebarNavLink key={item.key} item={item} active={pathname === item.href} />
        ))}
      </Box>

      <Box className="border-t border-[var(--sk-sidebar-border)] p-2.5">
        <SidebarNavLink item={outreachItem} active={pathname === outreachItem.href} />
      </Box>
    </Box>
  );
}
