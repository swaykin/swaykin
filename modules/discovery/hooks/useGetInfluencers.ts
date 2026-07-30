import { mockInfluencers } from "@/mocks/discovery";

/** The one seam that reads `mocks/discovery.ts` — everything else goes through this. */
export const useGetInfluencers = () => {
  return { influencers: mockInfluencers };
};
