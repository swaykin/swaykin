export type ContentPost = {
  type: string;
  icon: string;
  likes: string;
  eng: string;
  date: string;
  comments: string;
};

export type Collaboration = {
  name: string;
  tier: string;
  eng: string;
  lastDate: string;
  worksWithYou: boolean;
};

export type CompetitorHashtag = {
  tag: string;
  uses: number;
  eng: string;
  pct: number;
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
      { type: "Reel", icon: "ph-play", likes: "14.2K", eng: "3.8%", date: "Jul 21", comments: "260" },
      { type: "Carousel", icon: "ph-square-half", likes: "9.1K", eng: "2.4%", date: "Jul 19", comments: "160" },
      { type: "Reel", icon: "ph-play", likes: "18.6K", eng: "4.9%", date: "Jul 17", comments: "330" },
      { type: "Static", icon: "ph-image", likes: "6.7K", eng: "1.9%", date: "Jul 14", comments: "120" },
      { type: "Reel", icon: "ph-play", likes: "11.3K", eng: "3.1%", date: "Jul 12", comments: "200" },
      { type: "Carousel", icon: "ph-square-half", likes: "8.4K", eng: "2.6%", date: "Jul 9", comments: "150" },
      { type: "Static", icon: "ph-image", likes: "5.3K", eng: "1.7%", date: "Jul 7", comments: "80" },
      { type: "Reel", icon: "ph-play", likes: "16.1K", eng: "4.3%", date: "Jul 5", comments: "290" },
      { type: "Carousel", icon: "ph-square-half", likes: "7.9K", eng: "2.3%", date: "Jul 3", comments: "140" },
      { type: "Reel", icon: "ph-play", likes: "12.8K", eng: "3.5%", date: "Jul 1", comments: "220" },
      { type: "Static", icon: "ph-image", likes: "4.6K", eng: "1.5%", date: "Jun 29", comments: "70" },
      { type: "Reel", icon: "ph-play", likes: "17.4K", eng: "4.6%", date: "Jun 27", comments: "310" },
      { type: "Carousel", icon: "ph-square-half", likes: "6.8K", eng: "2.0%", date: "Jun 25", comments: "110" },
      { type: "Reel", icon: "ph-play", likes: "13.9K", eng: "3.7%", date: "Jun 23", comments: "240" },
      { type: "Static", icon: "ph-image", likes: "5.9K", eng: "1.8%", date: "Jun 21", comments: "95" },
      { type: "Reel", icon: "ph-play", likes: "15.2K", eng: "4.0%", date: "Jun 19", comments: "270" },
      { type: "Carousel", icon: "ph-square-half", likes: "8.9K", eng: "2.5%", date: "Jun 17", comments: "155" },
      { type: "Reel", icon: "ph-play", likes: "10.7K", eng: "2.9%", date: "Jun 15", comments: "185" },
      { type: "Static", icon: "ph-image", likes: "4.2K", eng: "1.4%", date: "Jun 13", comments: "65" },
      { type: "Reel", icon: "ph-play", likes: "19.3K", eng: "5.0%", date: "Jun 11", comments: "340" },
    ],
    collabs: [
      { name: "Ritika Sen", tier: "Macro", eng: "5.2%", lastDate: "Jul 18", worksWithYou: true },
      { name: "Kavya Menon", tier: "Micro", eng: "6.7%", lastDate: "Jul 11", worksWithYou: false },
      { name: "Devika Rao", tier: "Nano", eng: "8.1%", lastDate: "Jul 5", worksWithYou: false },
      { name: "Ishaan Vora", tier: "Micro", eng: "5.9%", lastDate: "Jun 28", worksWithYou: false },
      { name: "Priya Nambiar", tier: "Macro", eng: "4.4%", lastDate: "Jun 20", worksWithYou: true },
    ],
    hashtags: [
      { tag: "toxinfree", uses: 34, eng: "4.6%", pct: 90 },
      { tag: "mamaearth", uses: 29, eng: "3.9%", pct: 76 },
      { tag: "sustainablebeauty", uses: 21, eng: "5.1%", pct: 55 },
      { tag: "skincareroutine", uses: 18, eng: "3.2%", pct: 47 },
      { tag: "goodnessinside", uses: 12, eng: "4.8%", pct: 32 },
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
      { type: "Reel", icon: "ph-play", likes: "11.8K", eng: "6.9%", date: "Jul 22", comments: "210" },
      { type: "Reel", icon: "ph-play", likes: "9.4K", eng: "5.4%", date: "Jul 20", comments: "170" },
      { type: "Carousel", icon: "ph-square-half", likes: "7.4K", eng: "4.8%", date: "Jul 18", comments: "130" },
      { type: "Reel", icon: "ph-play", likes: "13.1K", eng: "7.2%", date: "Jul 15", comments: "240" },
      { type: "Static", icon: "ph-image", likes: "5.9K", eng: "3.9%", date: "Jul 13", comments: "110" },
      { type: "Reel", icon: "ph-play", likes: "10.2K", eng: "6.1%", date: "Jul 10", comments: "180" },
    ],
    collabs: [
      { name: "Ananya Kapoor", tier: "Micro", eng: "6.8%", lastDate: "Jul 20", worksWithYou: true },
      { name: "Sana Iyer", tier: "Nano", eng: "9.3%", lastDate: "Jul 14", worksWithYou: false },
      { name: "Neha Pillai", tier: "Micro", eng: "5.7%", lastDate: "Jul 6", worksWithYou: false },
      { name: "Farah Khan Jr.", tier: "Macro", eng: "4.1%", lastDate: "Jun 29", worksWithYou: false },
    ],
    hashtags: [
      { tag: "plumgoodness", uses: 31, eng: "6.4%", pct: 88 },
      { tag: "veganbeauty", uses: 26, eng: "7.1%", pct: 74 },
      { tag: "crueltyfree", uses: 22, eng: "6.0%", pct: 63 },
      { tag: "greentea", uses: 15, eng: "5.5%", pct: 43 },
      { tag: "cleanbeauty", uses: 11, eng: "4.9%", pct: 31 },
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
      { type: "Reel", icon: "ph-play", likes: "8.9K", eng: "2.9%", date: "Jul 21", comments: "160" },
      { type: "Reel", icon: "ph-play", likes: "10.4K", eng: "3.6%", date: "Jul 18", comments: "190" },
      { type: "Carousel", icon: "ph-square-half", likes: "5.2K", eng: "2.1%", date: "Jul 16", comments: "90" },
      { type: "Reel", icon: "ph-play", likes: "9.7K", eng: "3.2%", date: "Jul 13", comments: "170" },
      { type: "Static", icon: "ph-image", likes: "4.1K", eng: "1.6%", date: "Jul 11", comments: "70" },
      { type: "Reel", icon: "ph-play", likes: "11.6K", eng: "4.0%", date: "Jul 8", comments: "210" },
    ],
    collabs: [
      { name: "Dr. Rhea Malhotra", tier: "Micro", eng: "5.5%", lastDate: "Jul 15", worksWithYou: false },
      { name: "Arjun Bhatia", tier: "Nano", eng: "7.2%", lastDate: "Jul 9", worksWithYou: false },
      { name: "Meera Suresh", tier: "Macro", eng: "3.8%", lastDate: "Jun 30", worksWithYou: false },
      { name: "Kavya Menon", tier: "Micro", eng: "6.7%", lastDate: "Jun 22", worksWithYou: false },
    ],
    hashtags: [
      { tag: "minimalist", uses: 28, eng: "3.6%", pct: 82 },
      { tag: "activebeauty", uses: 20, eng: "4.2%", pct: 60 },
      { tag: "dermbacked", uses: 17, eng: "3.9%", pct: 51 },
      { tag: "niacinamide", uses: 14, eng: "3.1%", pct: 42 },
      { tag: "skinbarrier", uses: 9, eng: "2.8%", pct: 27 },
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
      { type: "Reel", icon: "ph-play", likes: "9.2K", eng: "2.2%", date: "Jul 20", comments: "170" },
      { type: "Carousel", icon: "ph-square-half", likes: "6.8K", eng: "1.8%", date: "Jul 17", comments: "120" },
      { type: "Reel", icon: "ph-play", likes: "10.9K", eng: "2.9%", date: "Jul 15", comments: "200" },
      { type: "Static", icon: "ph-image", likes: "5.1K", eng: "1.4%", date: "Jul 12", comments: "90" },
      { type: "Reel", icon: "ph-play", likes: "12.3K", eng: "3.3%", date: "Jul 9", comments: "220" },
      { type: "Reel", icon: "ph-play", likes: "8.4K", eng: "2.1%", date: "Jul 6", comments: "150" },
    ],
    collabs: [
      { name: "Tanvi Chheda", tier: "Nano", eng: "8.4%", lastDate: "Jul 19", worksWithYou: false },
      { name: "Rohan Kadam", tier: "Micro", eng: "5.1%", lastDate: "Jul 16", worksWithYou: false },
      { name: "Simran Oberoi", tier: "Nano", eng: "7.9%", lastDate: "Jul 12", worksWithYou: false },
      { name: "Priya Nambiar", tier: "Macro", eng: "4.4%", lastDate: "Jul 4", worksWithYou: true },
      { name: "Devika Rao", tier: "Nano", eng: "8.1%", lastDate: "Jun 26", worksWithYou: false },
    ],
    hashtags: [
      { tag: "wowskinscience", uses: 40, eng: "2.6%", pct: 95 },
      { tag: "haircare", uses: 24, eng: "3.4%", pct: 68 },
      { tag: "applecidervinegar", uses: 16, eng: "2.9%", pct: 45 },
      { tag: "discountcode", uses: 22, eng: "1.9%", pct: 62 },
      { tag: "hairfall", uses: 13, eng: "3.1%", pct: 38 },
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
