import type { BrandProfile } from "@/modules/auth/types";

export type Workspace = {
  name: string;
  type: string;
  credits: number;
  maxTrackedCompetitors: number;
  maxTrackedCreators: number;
  brandProfile: BrandProfile;
};

export const mockWorkspace: Workspace = {
  name: "Nova Beauty Co.",
  type: "D2C Brand",
  credits: 1240,
  maxTrackedCompetitors: 10,
  maxTrackedCreators: 50,
  brandProfile: {
    brandName: "Nova Beauty Co.",
    instagramHandle: "novabeautyco",
    industry: "Beauty, D2C",
    website: "novabeauty.co",
    description:
      "Clean, dermat-backed skincare for Indian skin — serums and SPF built for humidity, sold D2C and via Nykaa/Flipkart.",
    brandVoice: "Warm, expert, no-nonsense",
    targetAudience: "25–34 women, Tier-1 Indian cities",
  },
};
