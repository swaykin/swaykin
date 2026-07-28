"use client";

import Link from "next/link";
import { Box } from "@/infra/components/Box";
import { Icon } from "@/infra/components/Icon";
import type { NavItem } from "./navItems";

export function SidebarNavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`relative mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] no-underline ${
        active
          ? "bg-[var(--sk-sidebar-bg-active)] font-bold text-[var(--sk-sidebar-text-active)]"
          : "font-semibold text-text hover:bg-sunken"
      }`}
    >
      <Icon
        name={item.icon}
        weight={active ? "fill" : "bold"}
        size={16.5}
        color={active ? "var(--sk-sidebar-text-active)" : "var(--sk-text-secondary)"}
      />
      <Box as="span" className="flex-1 truncate">
        {item.label}
      </Box>
      {active && <Box as="span" className="absolute bottom-1.5 left-0 top-1.5 w-[2.5px] rounded-sm bg-accent" />}
    </Link>
  );
}
