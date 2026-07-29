export type SearchResultType = "campaign" | "influencer" | "analysis";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
};

export type SearchGroupMeta = {
  label: string;
  icon: string;
  iconColor: string;
  tint: string;
};

export const SEARCH_GROUP_META: Record<SearchResultType, SearchGroupMeta> = {
  campaign: {
    label: "Campaigns",
    icon: "ph-flag",
    iconColor: "var(--blue-600)",
    tint: "var(--blue-50)",
  },
  influencer: {
    label: "Saved influencers",
    icon: "ph-users-three",
    iconColor: "var(--sk-accent)",
    tint: "var(--sk-accent-subtle)",
  },
  analysis: {
    label: "Competitor analysis",
    icon: "ph-chart-bar",
    iconColor: "var(--orange-600)",
    tint: "var(--orange-100)",
  },
};

export const mockSearchIndex: SearchResult[] = [
  {
    id: "c1",
    type: "campaign",
    title: "Monsoon Glow Launch",
    subtitle: "Running · 18 creators",
    href: "/campaigns",
  },
  {
    id: "c2",
    type: "campaign",
    title: "New Mom Skincare Push",
    subtitle: "Running · 12 creators",
    href: "/campaigns",
  },
  {
    id: "c3",
    type: "campaign",
    title: "Diwali Radiance Edit",
    subtitle: "Draft",
    href: "/campaigns",
  },
  {
    id: "i1",
    type: "influencer",
    title: "Ananya Kapoor",
    subtitle: "@ananya.skincare · Skincare",
    href: "/saved",
  },
  {
    id: "i2",
    type: "influencer",
    title: "Priya Nair",
    subtitle: "@priya.glowup · Skincare",
    href: "/saved",
  },
  {
    id: "i3",
    type: "influencer",
    title: "Simran Kaur",
    subtitle: "@simran.beauty · Makeup",
    href: "/saved",
  },
  {
    id: "a1",
    type: "analysis",
    title: "Nykaa vs. our brand",
    subtitle: "Saved analysis",
    href: "/competitors",
  },
  {
    id: "a2",
    type: "analysis",
    title: "Mamaearth skincare line",
    subtitle: "Saved analysis",
    href: "/competitors",
  },
];
