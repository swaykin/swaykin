import { InfluencerCard } from "./InfluencerCard";
import type { Influencer } from "./types";

export function InfluencerGrid({
  influencers,
  onToggleSelect,
}: {
  influencers: Influencer[];
  onToggleSelect: (id: number) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {influencers.map((inf) => (
        <InfluencerCard key={inf.id} influencer={inf} onToggleSelect={onToggleSelect} />
      ))}
    </div>
  );
}
