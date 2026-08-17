import { creditHistory } from "@/mocks/credits";

/** The one seam that reads `mocks/credits.ts` — everything else goes through this. */
export const useCreditHistory = () => {
  return { history: creditHistory };
};
