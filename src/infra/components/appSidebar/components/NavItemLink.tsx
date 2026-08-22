import Link from "next/link";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { Tag } from "@/infra/components/Tag";
import type { NavItem } from "../navItems";

export const NavItemLink = ({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) => {
  if (item.comingSoon) {
    return (
      <Box className="mb-0.5 flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-text-tertiary">
        <Icon name={item.icon} weight="bold" size={16.5} color="var(--sk-text-tertiary)" />
        <Box as="span" className="flex-1 truncate">
          {item.label}
        </Box>
        <Tag label="Coming soon" size="sm" />
      </Box>
    );
  }

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
        color={
          active ? "var(--sk-sidebar-text-active)" : "var(--sk-text-secondary)"
        }
      />
      <Box as="span" className="flex-1 truncate">
        {item.label}
      </Box>
      {active && (
        <Box
          as="span"
          className="absolute bottom-1.5 left-0 top-1.5 w-[2.5px] rounded-sm bg-accent"
        />
      )}
    </Link>
  );
};
