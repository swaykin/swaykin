import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";

type SaveTeaserCardProps = {
  saved: boolean;
  onSave: () => void;
};

export const SaveTeaserCard = ({ saved, onSave }: SaveTeaserCardProps) => {
  if (saved) return null;

  return (
    <Box className="relative overflow-hidden rounded-2xl border border-border bg-surface px-7 py-2 shadow-card">
      <Box className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-4 p-7 opacity-50 blur-[4px]">
        <Box className="h-16 rounded-[10px] bg-sunken" />
        <Box className="h-16 rounded-[10px] bg-sunken" />
        <Box className="h-16 rounded-[10px] bg-sunken" />
      </Box>
      <Box
        className="relative flex flex-col items-center justify-center gap-2.5 py-4 text-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, var(--sk-surface) 55%)",
        }}
      >
        <Icon
          name="ph-lock-simple"
          weight="fill"
          size={22}
          color="var(--sk-text-tertiary)"
        />
        <Box className="max-w-[380px] text-sm font-bold text-text">
          Save this creator to unlock growth tracking, outreach tools, campaign
          history, and ROI
        </Box>
        <Button
          kind="primary"
          onClick={onSave}
          height="32px"
          width="80px"
          weight="semiBold"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};
