import { Box } from "@/infra/baseweb/Box";
import { CAROUSEL, REEL, STATIC } from "@/lib/entityColor";

const LEGEND = [
  { label: "Reels", color: REEL },
  { label: "Static", color: STATIC },
  { label: "Carousel", color: CAROUSEL },
];

export const ContentMixLegend = () => (
  <Box className="flex gap-4 text-[12px] text-text-secondary">
    {LEGEND.map((item) => (
      <Box key={item.label} className="flex items-center gap-1.5">
        <Box
          className="h-2 w-2 rounded-xs"
          style={{ background: item.color }}
        />
        {item.label}
      </Box>
    ))}
  </Box>
);
