import type { Post as ContentPost } from "@/infra/components/RecentPostsCard";
import type { Hashtag as CompetitorHashtag } from "@/infra/components/TopHashtagsCard";

export type { ContentPost, CompetitorHashtag };

export type Collaboration = {
  name: string;
  tier: string;
  eng: string;
  lastDate: string;
  worksWithYou: boolean;
};

export type BrandMetrics = {
  key: string;
  name: string;
  handle: string;
  followers: string;
  engagement: string;
  engagementNum: number;
  growth30: string;
  growth90: string;
  postFreq: string;
  postFreqNum: number;
  avgReach: string;
  avgReachNum: number;
  activeCollabs: number;
  pctReels: number;
  pctCarousel: number;
  pctStatic: number;
};

export type Competitor = BrandMetrics & {
  bio: string;
  isVerified: boolean;
  brandTags: string[];
  benchmarkGood: boolean;
  benchmarkDelta: string;
  posts: ContentPost[];
  collabs: Collaboration[];
  hashtags: CompetitorHashtag[];
  hashtagNote: string;
};

export type CompetitorAlert = {
  competitorKey: string;
  brand: string;
  text: string;
  time: string;
  icon: string;
};

export const mockCompetitors: Competitor[] = [
  {
    key: "mamaearth",
    name: "Mamaearth",
    handle: "mamaearth",
    followers: "1.8M",
    growth30: "+2.1%",
    growth90: "+6.4%",
    engagement: "4.1%",
    engagementNum: 4.1,
    postFreq: "6.8/wk",
    postFreqNum: 6.8,
    avgReach: "210K",
    avgReachNum: 210000,
    activeCollabs: 12,
    bio: "Toxin-free personal care brand. Sustainability-first storytelling with dermat-led content and frequent creator gifting drives.",
    isVerified: true,
    brandTags: ["Skincare", "Sustainable", "D2C"],
    benchmarkGood: false,
    benchmarkDelta: "−1.5pt",
    pctReels: 58,
    pctCarousel: 30,
    pctStatic: 12,
    posts: [
      { type: "Reel", icon: "ph-play", date: "Jul 21", likes: 14200, comments: 260, views: 88040 },
      { type: "Carousel", icon: "ph-square-half", date: "Jul 19", likes: 9100, comments: 160, views: 30940 },
      { type: "Reel", icon: "ph-play", date: "Jul 17", likes: 18600, comments: 330, views: 115320 },
      { type: "Static", icon: "ph-image", date: "Jul 14", likes: 6700, comments: 120, views: 17420 },
      { type: "Reel", icon: "ph-play", date: "Jul 12", likes: 11300, comments: 200, views: 70060 },
      { type: "Carousel", icon: "ph-square-half", date: "Jul 9", likes: 8400, comments: 150, views: 28560 },
      { type: "Static", icon: "ph-image", date: "Jul 7", likes: 5300, comments: 80, views: 13780 },
      { type: "Reel", icon: "ph-play", date: "Jul 5", likes: 16100, comments: 290, views: 99820 },
      { type: "Carousel", icon: "ph-square-half", date: "Jul 3", likes: 7900, comments: 140, views: 26860 },
      { type: "Reel", icon: "ph-play", date: "Jul 1", likes: 12800, comments: 220, views: 79360 },
      { type: "Static", icon: "ph-image", date: "Jun 29", likes: 4600, comments: 70, views: 11960 },
      { type: "Reel", icon: "ph-play", date: "Jun 27", likes: 17400, comments: 310, views: 107880 },
      { type: "Carousel", icon: "ph-square-half", date: "Jun 25", likes: 6800, comments: 110, views: 23120 },
      { type: "Reel", icon: "ph-play", date: "Jun 23", likes: 13900, comments: 240, views: 86180 },
      { type: "Static", icon: "ph-image", date: "Jun 21", likes: 5900, comments: 95, views: 15340 },
      { type: "Reel", icon: "ph-play", date: "Jun 19", likes: 15200, comments: 270, views: 94240 },
      { type: "Carousel", icon: "ph-square-half", date: "Jun 17", likes: 8900, comments: 155, views: 30260 },
      { type: "Reel", icon: "ph-play", date: "Jun 15", likes: 10700, comments: 185, views: 66340 },
      { type: "Static", icon: "ph-image", date: "Jun 13", likes: 4200, comments: 65, views: 10920 },
      { type: "Reel", icon: "ph-play", date: "Jun 11", likes: 19300, comments: 340, views: 119660 },
    ],
    collabs: [
      { name: "Ritika Sen", tier: "Macro", eng: "5.2%", lastDate: "Jul 18", worksWithYou: true },
      { name: "Kavya Menon", tier: "Micro", eng: "6.7%", lastDate: "Jul 11", worksWithYou: false },
      { name: "Devika Rao", tier: "Nano", eng: "8.1%", lastDate: "Jul 5", worksWithYou: false },
      { name: "Ishaan Vora", tier: "Micro", eng: "5.9%", lastDate: "Jun 28", worksWithYou: false },
      { name: "Priya Nambiar", tier: "Macro", eng: "4.4%", lastDate: "Jun 20", worksWithYou: true },
    ],
    hashtags: [
      { tag: "toxinfree", uses: 34, eng: "4.6%" },
      { tag: "mamaearth", uses: 29, eng: "3.9%" },
      { tag: "sustainablebeauty", uses: 21, eng: "5.1%" },
      { tag: "skincareroutine", uses: 18, eng: "3.2%" },
      { tag: "goodnessinside", uses: 12, eng: "4.8%" },
    ],
    hashtagNote: "#sustainablebeauty and #goodnessinside correlate with the highest engagement, well above the account average.",
  },
  {
    key: "plum",
    name: "Plum Goodness",
    handle: "plumgoodness",
    followers: "620K",
    growth30: "+3.8%",
    growth90: "+11.2%",
    engagement: "6.2%",
    engagementNum: 6.2,
    postFreq: "5.1/wk",
    postFreqNum: 5.1,
    avgReach: "96K",
    avgReachNum: 96000,
    activeCollabs: 9,
    bio: "Vegan, cruelty-free beauty brand. Leans heavily on ingredient education and nano-creator seeding over celebrity endorsements.",
    isVerified: true,
    brandTags: ["Vegan", "Cruelty-free", "D2C"],
    benchmarkGood: true,
    benchmarkDelta: "+0.6pt",
    pctReels: 64,
    pctCarousel: 26,
    pctStatic: 10,
    posts: [
      { type: "Reel", icon: "ph-play", date: "Jul 22", likes: 11800, comments: 210, views: 73160 },
      { type: "Reel", icon: "ph-play", date: "Jul 20", likes: 9400, comments: 170, views: 58280 },
      { type: "Carousel", icon: "ph-square-half", date: "Jul 18", likes: 7400, comments: 130, views: 25160 },
      { type: "Reel", icon: "ph-play", date: "Jul 15", likes: 13100, comments: 240, views: 81220 },
      { type: "Static", icon: "ph-image", date: "Jul 13", likes: 5900, comments: 110, views: 15340 },
      { type: "Reel", icon: "ph-play", date: "Jul 10", likes: 10200, comments: 180, views: 63240 },
    ],
    collabs: [
      { name: "Ananya Kapoor", tier: "Micro", eng: "6.8%", lastDate: "Jul 20", worksWithYou: true },
      { name: "Sana Iyer", tier: "Nano", eng: "9.3%", lastDate: "Jul 14", worksWithYou: false },
      { name: "Neha Pillai", tier: "Micro", eng: "5.7%", lastDate: "Jul 6", worksWithYou: false },
      { name: "Farah Khan Jr.", tier: "Macro", eng: "4.1%", lastDate: "Jun 29", worksWithYou: false },
    ],
    hashtags: [
      { tag: "plumgoodness", uses: 31, eng: "6.4%" },
      { tag: "veganbeauty", uses: 26, eng: "7.1%" },
      { tag: "crueltyfree", uses: 22, eng: "6.0%" },
      { tag: "greentea", uses: 15, eng: "5.5%" },
      { tag: "cleanbeauty", uses: 11, eng: "4.9%" },
    ],
    hashtagNote: "#veganbeauty posts outperform the account average by nearly 1 full point of engagement.",
  },
  {
    key: "minimalist",
    name: "Minimalist",
    handle: "beminimalist",
    followers: "980K",
    growth30: "+1.2%",
    growth90: "+3.9%",
    engagement: "3.4%",
    engagementNum: 3.4,
    postFreq: "4.4/wk",
    postFreqNum: 4.4,
    avgReach: "118K",
    avgReachNum: 118000,
    activeCollabs: 7,
    bio: "Formulation-transparent actives brand. Founder-led educational Reels and dermatologist collaborations dominate the feed.",
    isVerified: true,
    brandTags: ["Actives", "Derm-backed", "D2C"],
    benchmarkGood: false,
    benchmarkDelta: "−2.2pt",
    pctReels: 71,
    pctCarousel: 19,
    pctStatic: 10,
    posts: [
      { type: "Reel", icon: "ph-play", date: "Jul 21", likes: 8900, comments: 160, views: 55180 },
      { type: "Reel", icon: "ph-play", date: "Jul 18", likes: 10400, comments: 190, views: 64480 },
      { type: "Carousel", icon: "ph-square-half", date: "Jul 16", likes: 5200, comments: 90, views: 17680 },
      { type: "Reel", icon: "ph-play", date: "Jul 13", likes: 9700, comments: 170, views: 60140 },
      { type: "Static", icon: "ph-image", date: "Jul 11", likes: 4100, comments: 70, views: 10660 },
      { type: "Reel", icon: "ph-play", date: "Jul 8", likes: 11600, comments: 210, views: 71920 },
    ],
    collabs: [
      { name: "Dr. Rhea Malhotra", tier: "Micro", eng: "5.5%", lastDate: "Jul 15", worksWithYou: false },
      { name: "Arjun Bhatia", tier: "Nano", eng: "7.2%", lastDate: "Jul 9", worksWithYou: false },
      { name: "Meera Suresh", tier: "Macro", eng: "3.8%", lastDate: "Jun 30", worksWithYou: false },
      { name: "Kavya Menon", tier: "Micro", eng: "6.7%", lastDate: "Jun 22", worksWithYou: false },
    ],
    hashtags: [
      { tag: "minimalist", uses: 28, eng: "3.6%" },
      { tag: "activebeauty", uses: 20, eng: "4.2%" },
      { tag: "dermbacked", uses: 17, eng: "3.9%" },
      { tag: "niacinamide", uses: 14, eng: "3.1%" },
      { tag: "skinbarrier", uses: 9, eng: "2.8%" },
    ],
    hashtagNote: "#activebeauty and #dermbacked posts run above account average; broad tags like #minimalist trail behind.",
  },
  {
    key: "wow",
    name: "WOW Skin Science",
    handle: "wowskinsciencein",
    followers: "1.2M",
    growth30: "+0.9%",
    growth90: "+2.8%",
    engagement: "2.8%",
    engagementNum: 2.8,
    postFreq: "7.5/wk",
    postFreqNum: 7.5,
    avgReach: "142K",
    avgReachNum: 142000,
    activeCollabs: 15,
    bio: "Mass-market actives and haircare brand. High-frequency creator seeding across nano and micro tiers, discount-code driven.",
    isVerified: true,
    brandTags: ["Haircare", "Mass D2C", "Affiliate"],
    benchmarkGood: false,
    benchmarkDelta: "−2.8pt",
    pctReels: 66,
    pctCarousel: 22,
    pctStatic: 12,
    posts: [
      { type: "Reel", icon: "ph-play", date: "Jul 20", likes: 9200, comments: 170, views: 57040 },
      { type: "Carousel", icon: "ph-square-half", date: "Jul 17", likes: 6800, comments: 120, views: 23120 },
      { type: "Reel", icon: "ph-play", date: "Jul 15", likes: 10900, comments: 200, views: 67580 },
      { type: "Static", icon: "ph-image", date: "Jul 12", likes: 5100, comments: 90, views: 13260 },
      { type: "Reel", icon: "ph-play", date: "Jul 9", likes: 12300, comments: 220, views: 76260 },
      { type: "Reel", icon: "ph-play", date: "Jul 6", likes: 8400, comments: 150, views: 52080 },
    ],
    collabs: [
      { name: "Tanvi Chheda", tier: "Nano", eng: "8.4%", lastDate: "Jul 19", worksWithYou: false },
      { name: "Rohan Kadam", tier: "Micro", eng: "5.1%", lastDate: "Jul 16", worksWithYou: false },
      { name: "Simran Oberoi", tier: "Nano", eng: "7.9%", lastDate: "Jul 12", worksWithYou: false },
      { name: "Priya Nambiar", tier: "Macro", eng: "4.4%", lastDate: "Jul 4", worksWithYou: true },
      { name: "Devika Rao", tier: "Nano", eng: "8.1%", lastDate: "Jun 26", worksWithYou: false },
    ],
    hashtags: [
      { tag: "wowskinscience", uses: 40, eng: "2.6%" },
      { tag: "haircare", uses: 24, eng: "3.4%" },
      { tag: "applecidervinegar", uses: 16, eng: "2.9%" },
      { tag: "discountcode", uses: 22, eng: "1.9%" },
      { tag: "hairfall", uses: 13, eng: "3.1%" },
    ],
    hashtagNote: "Educational tags like #haircare beat promo-heavy #discountcode posts by over 1.5 points of engagement.",
  },
];

export const mockYourBrand: BrandMetrics = {
  key: "you",
  name: "Nova Beauty (you)",
  handle: "novabeauty",
  followers: "312K",
  engagement: "5.6%",
  engagementNum: 5.6,
  growth30: "+2.9%",
  growth90: "+8.1%",
  postFreq: "5.6/wk",
  postFreqNum: 5.6,
  avgReach: "88K",
  avgReachNum: 88000,
  activeCollabs: 18,
  pctReels: 62,
  pctCarousel: 28,
  pctStatic: 10,
};

export const mockCompetitorAlerts: CompetitorAlert[] = [
  { competitorKey: "mamaearth", brand: "Mamaearth", text: "signed 2 new macro-creators this week — 5 total collabs detected in July.", time: "3 hours ago", icon: "ph-users-three" },
  { competitorKey: "plum", brand: "Plum Goodness", text: "Reel crossed 900K views, 4x their usual reach.", time: "Yesterday", icon: "ph-flame" },
  { competitorKey: "wow", brand: "WOW Skin Science", text: "launched #HairfallChallenge with 22 nano-creators.", time: "2 days ago", icon: "ph-megaphone" },
];
