import { Box } from "@/infra/baseweb/Box";

type ContentMixSegmentProps = {
  fraction: number;
  color: string;
};

export const ContentMixSegment = ({
  fraction,
  color,
}: ContentMixSegmentProps) => (
  <Box
    className="flex items-center justify-center"
    style={{ width: `${fraction}%`, background: color }}
  >
    {fraction > 0 && (
      <Box as="span" className="text-[9.5px] font-bold text-white">
        {fraction}%
      </Box>
    )}
  </Box>
);
