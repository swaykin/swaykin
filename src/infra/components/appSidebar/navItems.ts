export type NavItem = {
  key: string;
  label: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
};

export const navItems: NavItem[] = [
  // { key: "dashboard", label: "Dashboard", icon: "ph-squares-four", href: "/" },
  {
    key: "discovery",
    label: "Discovery",
    icon: "ph-magnifying-glass",
    href: "/discovery",
  },
  {
    key: "competitors",
    label: "Competitors",
    icon: "ph-scales",
    href: "/competitors",
  },
  {
    key: "saved",
    label: "Saved Creators",
    icon: "ph-bookmark-simple",
    href: "/saved",
    comingSoon: true,
  },
  {
    key: "campaigns",
    label: "Campaigns",
    icon: "ph-flag",
    href: "/campaigns",
    comingSoon: true,
  },
];

export const outreachItem: NavItem = {
  key: "outreach",
  label: "Outreach",
  icon: "ph-envelope-simple",
  href: "/outreach",
  comingSoon: true,
};
