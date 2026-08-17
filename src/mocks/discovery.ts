import type { Post } from "@/infra/components/RecentPostsCard";
import type { Hashtag } from "@/infra/components/TopHashtagsCard";
import type { SavedStatus } from "@/modules/saved/constants";

export type InfluencerPost = Post;
export type InfluencerHashtag = Hashtag;

export type BrandCollaboration = {
  brand: string;
  date: string;
  via: string;
  reach: number;
  emv: number;
  likes: number;
  comments: number;
  logoColor: string;
};

export type Influencer = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  location?: string;
  verified: boolean;
  followersNum: number;
  followingNum: number;
  erNum: number;
  avgLikesNum: number;
  avgCommentsNum: number;
  postsWeekNum: number;
  totalPostsNum: number;
  pctReels: number;
  pctStatic: number;
  pctCarousel: number;
  tags: string[];
  bio: string;
  /** Content themes inferred from captions/hashtags, and top hashtags ranked by usage —
   * shown unconditionally in the Detail View, unlike the optional contact/collab fields below. */
  themes: string[];
  hashtags: InfluencerHashtag[];
  posts: InfluencerPost[];
  /** Literal values on a couple of mocks only — presence of the field is the signal, no
   * separate hasEmail/hasPhone/hasAddress/hasCollabs booleans to keep in sync. Address
   * reuses `location`. */
  email?: string;
  phone?: string;
  collabs?: BrandCollaboration[];
  /** Saved Influencers page fields — literal values only on mocks pre-seeded as saved;
   * presence of `savedDaysAgo` is the "is saved" signal, no separate isSaved boolean. */
  lists?: string[];
  status?: SavedStatus;
  savedDaysAgo?: number;
  newPostsCount?: number;
  followerChangePct?: number;
  erChangePts?: number;
};

export const mockInfluencers: Influencer[] = [
  {
    id: "ananya",
    name: "Ananya Kapoor",
    handle: "ananya.skincare",
    niche: "Skincare",
    location: "Mumbai",
    verified: true,
    followersNum: 284000,
    followingNum: 412,
    erNum: 6.8,
    avgLikesNum: 14200,
    avgCommentsNum: 380,
    postsWeekNum: 4.2,
    totalPostsNum: 612,
    pctReels: 55,
    pctStatic: 15,
    pctCarousel: 30,
    tags: ["skincare", "glowup", "barrierrepair"],
    bio: "Dermat-approved skincare reviews and barrier-repair routines. Patch-tested before every post.",
    themes: ["Skincare routines", "Product reviews", "Ingredient breakdowns"],
    hashtags: [
      { tag: "skincare", uses: 142 },
      { tag: "glowup", uses: 98 },
      { tag: "barrierrepair", uses: 76 },
      { tag: "skinbarrier", uses: 54 },
      { tag: "dermatapproved", uses: 41 },
    ],
    posts: [
      { type: "Reel", icon: "ph-play", date: "2d ago", likes: 15800, comments: 410, views: 82000, isCollab: true, caption: "My go-to barrier-repair routine when my skin's throwing a tantrum — three steps, patch-tested, no drama.", hashtags: ["skincare", "glowup", "barrierrepair"] },
      { type: "Post", icon: "ph-image", date: "5d ago", likes: 12100, comments: 290, views: 41000, caption: "Breaking down what 'fragrance-free' actually means on an ingredient list (spoiler: not always what you think).", hashtags: ["skincare", "dermatapproved", "skinbarrier"] },
      { type: "Carousel", icon: "ph-images", date: "1w ago", likes: 13400, comments: 350, views: 55000, caption: "48-hour patch test on the new ceramide moisturizer before it made it into my routine — always worth the wait.", hashtags: ["skincare", "glowup", "barrierrepair"] },
      { type: "Reel", icon: "ph-play", date: "2w ago", likes: 11200, comments: 270, views: 38000, caption: "Morning skin check-in: redness down, barrier holding. Consistency > new product every week.", hashtags: ["skincare", "glowup", "dermatapproved"] },
    ],
    email: "ananya@skincarecollective.in",
    collabs: [
      { brand: "Minimalist", date: "Jun 2026", via: "Reel", reach: 145000, emv: 82000, likes: 12400, comments: 320, logoColor: "var(--teal-600)" },
      { brand: "The Derma Co", date: "Apr 2026", via: "Story", reach: 98000, emv: 54000, likes: 7600, comments: 190, logoColor: "var(--blue-600)" },
      { brand: "Plum Goodness", date: "Feb 2026", via: "Post", reach: 112000, emv: 61000, likes: 9100, comments: 240, logoColor: "var(--green-600)" },
    ],
    lists: ["Q3 Skincare Candidates"],
    status: "Contacted",
    savedDaysAgo: 21,
    newPostsCount: 2,
    followerChangePct: 4.2,
    erChangePts: 0.3,
  },
  {
    id: "meher",
    name: "Meher Chhabra",
    handle: "glow.with.meher",
    niche: "Beauty & Makeup",
    location: "Delhi NCR",
    verified: true,
    followersNum: 156000,
    followingNum: 634,
    erNum: 7.4,
    avgLikesNum: 9700,
    avgCommentsNum: 290,
    postsWeekNum: 5.1,
    totalPostsNum: 890,
    pctReels: 60,
    pctStatic: 10,
    pctCarousel: 30,
    tags: ["makeup", "getreadywithme", "beauty"],
    bio: "GRWM queen. Honest reviews, festive looks, and product dupes for every budget.",
    themes: ["GRWM tutorials", "Festive looks", "Product dupes"],
    hashtags: [
      { tag: "makeup", uses: 210 },
      { tag: "getreadywithme", uses: 165 },
      { tag: "beauty", uses: 132 },
      { tag: "dupealert", uses: 88 },
      { tag: "festivelook", uses: 61 },
    ],
    posts: [
      { type: "Reel", icon: "ph-play", date: "1d ago", likes: 10800, comments: 310, views: 47000, caption: "GRWM for the festive brunch — cream blush, a wash of gold, and zero patience for a 10-step base today.", hashtags: ["makeup", "getreadywithme", "festivelook"] },
      { type: "Post", icon: "ph-image", date: "4d ago", likes: 8900, comments: 240, views: 29000, caption: "Found the ₹300 dupe for that viral ₹2,000 blush and I'm never going back.", hashtags: ["makeup", "dupealert", "beauty"] },
      { type: "Carousel", icon: "ph-images", date: "6d ago", likes: 9600, comments: 260, views: 33000, caption: "Same face, two ways — full glam vs. 5-minute version. Tell me which one you'd actually wear.", hashtags: ["makeup", "beauty", "getreadywithme"] },
      { type: "Reel", icon: "ph-play", date: "10d ago", likes: 8200, comments: 210, views: 25000, caption: "Wore this for a week straight before saying anything — the honest review you asked for.", hashtags: ["makeup", "beauty", "dupealert"] },
    ],
    phone: "+91 98765 43210",
    lists: ["Q3 Skincare Candidates", "Fashion Edit Shortlist"],
    status: "In Discussion",
    savedDaysAgo: 34,
    followerChangePct: 1.1,
    erChangePts: -0.2,
  },
  {
    id: "rhea",
    name: "Rhea Sundaram",
    handle: "thebeautyfile",
    niche: "Lifestyle",
    location: "Bangalore",
    verified: false,
    followersNum: 412000,
    followingNum: 289,
    erNum: 4.9,
    avgLikesNum: 18300,
    avgCommentsNum: 410,
    postsWeekNum: 3.4,
    totalPostsNum: 445,
    pctReels: 35,
    pctStatic: 30,
    pctCarousel: 35,
    tags: ["lifestyle", "dayinthelife", "homedecor"],
    bio: "Slow living, home edits, and the occasional beauty find worth talking about.",
    themes: ["Slow living", "Home edits", "Day-in-the-life"],
    hashtags: [
      { tag: "lifestyle", uses: 187 },
      { tag: "dayinthelife", uses: 143 },
      { tag: "homedecor", uses: 97 },
      { tag: "slowliving", uses: 72 },
      { tag: "homeedit", uses: 55 },
    ],
    posts: [
      { type: "Post", icon: "ph-image", date: "3d ago", likes: 19200, comments: 420, views: 61000, caption: "Slow Sunday: rearranged the reading corner and finally hung the mirror I bought in March.", hashtags: ["lifestyle", "homedecor", "slowliving"] },
      { type: "Carousel", icon: "ph-images", date: "6d ago", likes: 17600, comments: 390, views: 54000, caption: "A quieter kind of day-in-the-life — coffee, laundry, and not one thing that needed to be productive.", hashtags: ["lifestyle", "dayinthelife", "homeedit"] },
      { type: "Reel", icon: "ph-play", date: "9d ago", likes: 18100, comments: 400, views: 58000, caption: "Learning to sit in a room without reaching for my phone. Still bad at it, still trying.", hashtags: ["lifestyle", "slowliving", "homedecor"] },
      { type: "Post", icon: "ph-image", date: "2w ago", likes: 16400, comments: 360, views: 47000, caption: "This serum has been in my routine for two months and I'm only now willing to talk about it.", hashtags: ["lifestyle", "dayinthelife", "homedecor"] },
    ],
  },
  {
    id: "ishaan",
    name: "Ishaan Verma",
    handle: "ishaan.grooms",
    niche: "Men's grooming",
    location: "Pune",
    verified: true,
    followersNum: 98000,
    followingNum: 156,
    erNum: 8.1,
    avgLikesNum: 7300,
    avgCommentsNum: 210,
    postsWeekNum: 3.9,
    totalPostsNum: 320,
    pctReels: 50,
    pctStatic: 20,
    pctCarousel: 30,
    tags: ["grooming", "skincareformen", "fragrance"],
    bio: "Grooming routines and fragrance reviews for the low-maintenance man.",
    themes: ["Grooming routines", "Fragrance reviews", "Product comparisons"],
    hashtags: [
      { tag: "grooming", uses: 118 },
      { tag: "skincareformen", uses: 94 },
      { tag: "fragrance", uses: 81 },
      { tag: "mensgrooming", uses: 63 },
      { tag: "fragrancereview", uses: 47 },
    ],
    posts: [
      { type: "Reel", icon: "ph-play", date: "3d ago", likes: 7900, comments: 220, views: 34000, isCollab: true, caption: "New shave routine with Bombay Shaving Company — the aftershave balm is doing a lot of work here.", hashtags: ["grooming", "mensgrooming", "skincareformen"] },
      { type: "Post", icon: "ph-image", date: "1w ago", likes: 6800, comments: 190, views: 26000, caption: "Layering fragrance so it actually lasts past lunch — three products, one clear order.", hashtags: ["fragrance", "fragrancereview", "grooming"] },
      { type: "Carousel", icon: "ph-images", date: "2w ago", likes: 7200, comments: 200, views: 29000, isCollab: true, caption: "Comparing the Beardo beard oil against my usual — full breakdown in this one.", hashtags: ["grooming", "mensgrooming", "fragrance"] },
      { type: "Reel", icon: "ph-play", date: "3w ago", likes: 6500, comments: 180, views: 24000, caption: "Sunday reset: trim, shave, moisturize. Fifteen minutes, no extra steps.", hashtags: ["grooming", "skincareformen", "mensgrooming"] },
    ],
    email: "ishaan.grooms@gmail.com",
    phone: "+91 91234 56780",
    collabs: [
      { brand: "Bombay Shaving Company", date: "May 2026", via: "Reel", reach: 54000, emv: 31000, likes: 4800, comments: 140, logoColor: "var(--orange-600)" },
      { brand: "Beardo", date: "Mar 2026", via: "Post", reach: 41000, emv: 22000, likes: 3200, comments: 95, logoColor: "var(--sk-accent-strong)" },
    ],
    lists: ["Fitness & Grooming Watch"],
    status: "Confirmed",
    savedDaysAgo: 12,
    newPostsCount: 3,
    followerChangePct: 8.9,
    erChangePts: 0.6,
  },
  {
    id: "zara",
    name: "Zara Fernandes",
    handle: "zara.beautyedit",
    niche: "Beauty & Makeup",
    verified: false,
    followersNum: 203000,
    followingNum: 521,
    erNum: 5.6,
    avgLikesNum: 11100,
    avgCommentsNum: 260,
    postsWeekNum: 4.6,
    totalPostsNum: 703,
    pctReels: 40,
    pctStatic: 25,
    pctCarousel: 35,
    tags: ["makeup", "beautyedit", "dupes"],
    bio: "Curated beauty edits — what's worth the hype and what to skip this season.",
    themes: ["Beauty edits", "Hype or skip", "Dupe finds"],
    hashtags: [
      { tag: "makeup", uses: 156 },
      { tag: "beautyedit", uses: 121 },
      { tag: "dupes", uses: 99 },
      { tag: "dupealert", uses: 74 },
      { tag: "skipthehype", uses: 58 },
    ],
    posts: [
      { type: "Post", icon: "ph-image", date: "2d ago", likes: 11800, comments: 270, views: 39000, caption: "This month's beauty edit — what's actually worth the hype and what's going straight back on the shelf.", hashtags: ["makeup", "beautyedit", "dupes"] },
      { type: "Carousel", icon: "ph-images", date: "5d ago", likes: 10900, comments: 250, views: 35000, caption: "Hype vs. skip: testing the product everyone's talking about so you don't have to guess.", hashtags: ["beautyedit", "skipthehype", "makeup"] },
      { type: "Reel", icon: "ph-play", date: "9d ago", likes: 11400, comments: 260, views: 37000, caption: "Found a dupe that performs better than the original and I have thoughts.", hashtags: ["dupes", "dupealert", "makeup"] },
      { type: "Post", icon: "ph-image", date: "2w ago", likes: 10200, comments: 230, views: 32000, caption: "Curated the five products I've repurchased more than once this year.", hashtags: ["beautyedit", "makeup", "dupes"] },
    ],
  },
  {
    id: "kabir",
    name: "Kabir Malhotra",
    handle: "kabir.skinnotes",
    niche: "Skincare",
    location: "Hyderabad",
    verified: true,
    followersNum: 67000,
    followingNum: 203,
    erNum: 9.2,
    avgLikesNum: 6100,
    avgCommentsNum: 340,
    postsWeekNum: 2.8,
    totalPostsNum: 210,
    pctReels: 45,
    pctStatic: 20,
    pctCarousel: 35,
    tags: ["skincare", "actives", "niacinamide"],
    bio: "Active ingredient breakdowns for skin that actually needs the science, not the hype.",
    themes: ["Ingredient science", "Active breakdowns", "Skin science"],
    hashtags: [
      { tag: "skincare", uses: 134 },
      { tag: "actives", uses: 109 },
      { tag: "niacinamide", uses: 87 },
      { tag: "skincareindia", uses: 62 },
      { tag: "ingredientbreakdown", uses: 45 },
    ],
    posts: [
      { type: "Reel", icon: "ph-play", date: "1d ago", likes: 6300, comments: 350, views: 22000, caption: "Niacinamide 101 — what percentage actually does something, and where most serums get it wrong.", hashtags: ["skincare", "niacinamide", "actives"] },
      { type: "Post", icon: "ph-image", date: "4d ago", likes: 5800, comments: 310, views: 19000, caption: "Reading an ingredient list so you don't have to: this 'brightening' serum is 80% filler.", hashtags: ["skincare", "ingredientbreakdown", "actives"] },
      { type: "Carousel", icon: "ph-images", date: "8d ago", likes: 6100, comments: 330, views: 21000, caption: "Actives layering order, explained without the jargon.", hashtags: ["actives", "skincareindia", "skincare"] },
      { type: "Reel", icon: "ph-play", date: "12d ago", likes: 5600, comments: 290, views: 18000, caption: "The unglamorous truth: most 'holy grail' products just have one working ingredient.", hashtags: ["skincare", "actives", "ingredientbreakdown"] },
    ],
    lists: ["Q3 Skincare Candidates", "Fitness & Grooming Watch"],
    status: "Not Contacted",
    savedDaysAgo: 9,
    newPostsCount: 4,
    followerChangePct: 11.0,
    erChangePts: 0.8,
  },
  {
    id: "priya",
    name: "Priya Nambiar",
    handle: "priya.fitlife",
    niche: "Fitness",
    verified: false,
    followersNum: 143000,
    followingNum: 378,
    erNum: 6.1,
    avgLikesNum: 8900,
    avgCommentsNum: 220,
    postsWeekNum: 5.6,
    totalPostsNum: 980,
    pctReels: 65,
    pctStatic: 10,
    pctCarousel: 25,
    tags: ["fitness", "homeworkout", "nutrition"],
    bio: "Home workouts and simple nutrition for people who hate the gym.",
    themes: ["Home workouts", "Nutrition tips", "No-gym fitness"],
    hashtags: [
      { tag: "fitness", uses: 172 },
      { tag: "homeworkout", uses: 138 },
      { tag: "nutrition", uses: 104 },
      { tag: "fitnessmotivation", uses: 79 },
      { tag: "nogym", uses: 58 },
    ],
    posts: [
      { type: "Reel", icon: "ph-play", date: "2d ago", likes: 9200, comments: 230, views: 41000, caption: "20-minute home workout, no equipment, no excuses — following along counts as doing it.", hashtags: ["fitness", "homeworkout", "fitnessmotivation"] },
      { type: "Post", icon: "ph-image", date: "5d ago", likes: 8500, comments: 200, views: 33000, caption: "The nutrition rule I actually follow: protein first, everything else fits around it.", hashtags: ["nutrition", "fitness", "nogym"] },
      { type: "Carousel", icon: "ph-images", date: "9d ago", likes: 8900, comments: 215, views: 36000, caption: "Proof you don't need a gym membership to get stronger — this circuit took over my living room.", hashtags: ["homeworkout", "nogym", "fitness"] },
      { type: "Reel", icon: "ph-play", date: "2w ago", likes: 8100, comments: 190, views: 30000, caption: "Some days the workout is just showing up. Today was one of those days, and I still showed up.", hashtags: ["fitness", "fitnessmotivation", "homeworkout"] },
    ],
  },
  {
    id: "devika",
    name: "Devika Rao",
    handle: "devika.wears",
    niche: "Fashion",
    location: "Kolkata",
    verified: false,
    followersNum: 51000,
    followingNum: 892,
    erNum: 7.9,
    avgLikesNum: 4200,
    avgCommentsNum: 150,
    postsWeekNum: 4.0,
    totalPostsNum: 380,
    pctReels: 30,
    pctStatic: 35,
    pctCarousel: 35,
    tags: ["fashion", "thrift", "outfitideas"],
    bio: "Thrifted outfits and styling on a real budget — no sponsored hauls here (yet).",
    themes: ["Thrifted fashion", "Budget styling", "Outfit ideas"],
    hashtags: [
      { tag: "fashion", uses: 149 },
      { tag: "thrift", uses: 112 },
      { tag: "outfitideas", uses: 86 },
      { tag: "budgetstyle", uses: 64 },
      { tag: "thriftfinds", uses: 49 },
    ],
    posts: [
      { type: "Post", icon: "ph-image", date: "3d ago", likes: 4400, comments: 160, views: 15000, caption: "This entire outfit cost less than one 'investment piece' everyone keeps recommending.", hashtags: ["fashion", "thrift", "outfitideas"] },
      { type: "Carousel", icon: "ph-images", date: "6d ago", likes: 4100, comments: 145, views: 13000, caption: "Styling the same thrifted jacket three ways — budget doesn't mean boring.", hashtags: ["budgetstyle", "thrift", "fashion"] },
      { type: "Reel", icon: "ph-play", date: "10d ago", likes: 4300, comments: 155, views: 14000, caption: "Outfit idea for the days you want to look put-together in under five minutes.", hashtags: ["outfitideas", "fashion", "thriftfinds"] },
      { type: "Post", icon: "ph-image", date: "3w ago", likes: 3900, comments: 135, views: 12000, caption: "Found this at a thrift haul in Kolkata for ₹150 and it's now in permanent rotation.", hashtags: ["thrift", "thriftfinds", "fashion"] },
    ],
    lists: ["Fashion Edit Shortlist", "Fitness & Grooming Watch", "Q3 Skincare Candidates"],
    status: "Not Contacted",
    savedDaysAgo: 3,
    newPostsCount: 1,
    followerChangePct: 6.7,
    erChangePts: 0.5,
  },
];
