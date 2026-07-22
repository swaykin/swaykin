// Mock data for the single prototype creator (Ananya Kapoor). In production
// this would be fetched server-side by handle instead of hardcoded.

export type CampaignStatus = "Active" | "Upcoming" | "Completed";

export interface ProfileCampaign {
  name: string;
  status: CampaignStatus;
  href: string;
}

export interface Collaboration {
  brand: string;
  format: string;
  reach: string;
  engagement: string;
}

export interface FeedItem {
  bg: string;
  icon: string;
  isReel: boolean;
  views?: string;
}

const FEED_BGS = [
  "var(--violet-100)",
  "var(--blue-100)",
  "var(--green-50)",
  "var(--orange-100)",
  "var(--pink-100)",
  "var(--teal-100)",
];

function buildFeedPool(): FeedItem[] {
  const items: FeedItem[] = [];
  for (let i = 0; i < 54; i++) {
    const isReel = i % 3 !== 1;
    items.push({
      bg: FEED_BGS[i % FEED_BGS.length],
      icon: isReel ? "ph-play" : "ph-image",
      isReel,
      views: isReel ? `${(60 + (i * 7) % 90)}K` : undefined,
    });
  }
  return items;
}

export const profileMock = {
  name: "Ananya Kapoor",
  handle: "ananya.skincare",
  niche: "Skincare creator",
  location: "Mumbai",
  igUrl: "https://instagram.com/ananya.skincare",
  initials: "AK",
  avatarBg: "var(--violet-600)",
  email: "ananya@skincarediaries.in",
  stats: {
    followers: "284K",
    engagement: "6.8%",
    avgViews: "92K",
    postsPerWeek: "4.2",
  },
  brandAffinity: ["Minimalist", "Mamaearth", "The Ordinary", "Plum"],
  hashtags: ["skincare", "cleanbeauty", "glowup", "skinbarrier"],
  mentions: ["mamaearth", "theordinary", "novabeautyco"],
  campaigns: [
    { name: "Monsoon Glow Launch", status: "Active", href: "/campaigns" },
    { name: "New Mom Skincare Push", status: "Active", href: "/campaigns" },
    { name: "Diwali Radiance Edit", status: "Upcoming", href: "/campaigns" },
    { name: "Summer Skin Reset", status: "Completed", href: "/campaigns" },
  ] as ProfileCampaign[],
  collaborations: [
    { brand: "Mamaearth", format: "Reel + Story", reach: "412K", engagement: "7.2%" },
    { brand: "The Ordinary", format: "Static + Carousel", reach: "298K", engagement: "5.9%" },
    { brand: "Plum Goodness", format: "Reel", reach: "356K", engagement: "8.1%" },
    { brand: "Minimalist", format: "Story series", reach: "188K", engagement: "6.4%" },
  ] as Collaboration[],
  feedPool: buildFeedPool(),
};
