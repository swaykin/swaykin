import { usePathname } from "next/navigation";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { navItems, outreachItem } from "./navItems";
import { NavItemLink } from "./components/NavItemLink";
import { Workspace } from "./components/Workspace";

const AppSidebar = () => {
  const pathname = usePathname();
  return (
    <Box
      as="nav"
      className="sticky left-0 top-0 flex h-screen w-[248px] min-w-[248px] flex-shrink-0 flex-col border-r bg-[var(--sk-sidebar-bg)] border-[var(--sk-sidebar-border)]"
    >
      <Box className="flex items-center gap-2 px-5 pb-2.5 pt-4">
        <Box className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] bg-accent">
          <Icon name="ph-sparkle" weight="fill" size={11} color="#fff" />
        </Box>
        <Box
          as="span"
          className="text-[13px] font-bold tracking-[-0.01em] text-text"
        >
          SwayKin
        </Box>
      </Box>
      <Workspace />
      <Box className="flex-1 overflow-y-auto px-2.5 pb-2.5 pt-1">
        {navItems.map((item) => (
          <NavItemLink
            key={item.key}
            item={item}
            active={pathname === item.href}
          />
        ))}
      </Box>

      <Box className="border-t border-[var(--sk-sidebar-border)] p-2.5">
        <NavItemLink
          item={outreachItem}
          active={pathname === outreachItem.href}
        />
      </Box>
    </Box>
  );
};

export default AppSidebar;
