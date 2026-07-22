export type Influencer = {
  id: number;
  name: string;
  handle: string;
  igUrl: string;
  initials: string;
  avatarBg: string;
  niche: string;
  verified: boolean;
  followers: string;
  er: string;
  avgViews: string;
  postsWeek: string;
  selected: boolean;
  href: string;
};

export type SavedSearch = {
  id: number;
  name: string;
  desc: string;
  filters: FilterState;
};

export type FilterState = {
  followers: boolean;
  country: boolean;
  engagement: boolean;
  category: boolean;
};

export type FilterKey = keyof FilterState;

export type View = "grid" | "table";
