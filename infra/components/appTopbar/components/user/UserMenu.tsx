import Link from "next/link";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { Avatar } from "@/infra/baseweb/Avatar";
import { useSignOut } from "@/hooks/useSignOut";

const MENU_ITEMS = [
  { label: "Settings", href: "/settings", icon: "ph-gear" },
  { label: "Credits and Usage", href: "/settings", icon: "ph-coin" },
  { label: "Upgrade", href: "/settings", icon: "ph-arrow-circle-up" },
];

const MenuItem = ({ item }: { item: (typeof MENU_ITEMS)[number] }) => (
  <Link
    href={item.href}
    className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-text-secondary no-underline hover:bg-sunken"
  >
    <Icon name={item.icon} size={16} />
    {item.label}
  </Link>
);

export const UserMenu = ({ user }) => {
  const signOut = useSignOut();

  return (
    <Box className="w-[200px] rounded-xl border border-border bg-surface p-1.5 shadow-overlay">
      <Link
        href={user.name}
        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-text-secondary no-underline hover:bg-sunken"
      >
        <Avatar name={user.name} size="30px" fontSize="12px" />
        {user.name}
      </Link>
      <Box className="my-1 h-px bg-border" />
      {MENU_ITEMS.map((item) => (
        <MenuItem key={item.label} item={item} />
      ))}
      <Box className="my-1 h-px bg-border" />
      <Box
        as="button"
        onClick={signOut}
        className="flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left text-[13px] hover:bg-sunken"
        style={{ color: "var(--red-600)" }}
      >
        <Icon name="ph-sign-out" size={16} color="var(--red-600)" />
        Sign out
      </Box>
    </Box>
  );
};
