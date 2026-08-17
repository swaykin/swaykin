export type CreditHistoryEntry = {
  date: string;
  activity: string;
  delta: number;
  balance: number;
};

export const creditHistory: CreditHistoryEntry[] = [
  {
    date: "Jul 20, 2026",
    activity: "Monthly credit refresh — Growth plan",
    delta: 2000,
    balance: 1240,
  },
  {
    date: "Jul 18, 2026",
    activity: "Influencer discovery search (bulk)",
    delta: -140,
    balance: 1760,
  },
  {
    date: "Jul 12, 2026",
    activity: "Competitor analysis report — Mamaearth",
    delta: -60,
    balance: 1900,
  },
  {
    date: "Jul 5, 2026",
    activity: "AI outreach message drafts (x24)",
    delta: -96,
    balance: 1960,
  },
  {
    date: "Jun 20, 2026",
    activity: "Monthly credit refresh — Growth plan",
    delta: 2000,
    balance: 2056,
  },
  {
    date: "Jun 14, 2026",
    activity: "Top-up purchase",
    delta: 500,
    balance: 560,
  },
];
