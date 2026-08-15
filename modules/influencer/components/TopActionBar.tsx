import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";

type TopActionBarProps = {
  onBack: () => void;
  saved: boolean;
  onToggleShortlist: () => void;
  onExport: () => void;
  onOutreach: () => void;
};

export const TopActionBar = ({
  onBack,
  saved,
  onToggleShortlist,
  onExport,
  onOutreach,
}: TopActionBarProps) => (
  <Box className="flex items-center gap-2.5">
    <Button
      kind="tertiary"
      onClick={onBack}
      weight="semiBold"
      textColor="var(--sk-text-secondary)"
      startEnhancer={<Icon name="ph-arrow-left" weight="bold" size={14} />}
      overrides={{
        BaseButton: {
          style: {
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: "transparent",
            "@media (hover: hover)": {
              ":hover": {
                boxShadow: "none",
              },
            },
          },
        },
      }}
    >
      Back
    </Button>
    <Box className="h-5 w-px flex-shrink-0 bg-border" />
    <Button
      kind="primary"
      onClick={onToggleShortlist}
      height="34px"
      weight="semiBold"
      startEnhancer={
        <Icon
          name="ph-bookmark-simple"
          weight={saved ? "fill" : "bold"}
          size={14}
        />
      }
    >
      {saved ? "Shortlisted" : "Add to Shortlist"}
    </Button>
    <Button
      kind="secondary"
      onClick={onExport}
      height="36px"
      weight="semiBold"
      textColor="var(--sk-text-secondary)"
      startEnhancer={<Icon name="ph-export" size={14} />}
    >
      Export Report
    </Button>
    <Button
      kind="secondary"
      onClick={onOutreach}
      height="36px"
      weight="semiBold"
      textColor="var(--sk-text-secondary)"
      startEnhancer={
        <Icon name="ph-paper-plane-tilt" weight="bold" size={14} />
      }
    >
      Start Outreach
    </Button>
  </Box>
);
