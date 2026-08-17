import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";

type BulkSelectBarProps = {
  selectedCount: number;
  onSave: () => void;
  onCompare: () => void;
  onAddToCampaign: () => void;
  onClear: () => void;
};

export const BulkSelectBar = ({
  selectedCount,
  onSave,
  onCompare,
  onAddToCampaign,
  onClear,
}: BulkSelectBarProps) => (
  <Box className="mb-3.5 flex items-center gap-3 rounded-xl border border-[var(--sk-accent-subtle-strong)] bg-accent-subtle px-4 py-2.5">
    <Box as="span" className="text-[12.5px] font-bold text-accent-strong">
      {selectedCount} selected
    </Box>
    <Box className="flex-1" />
    <Button
      kind="secondary"
      type="button"
      height="36px"
      fontSize="12.5px"
      borderColor="var(--sk-accent-subtle-strong)"
      backgroundColor="transparent"
      textColor="var(--sk-accent-strong)"
      onClick={onCompare}
    >
      Compare
    </Button>
    <Button
      kind="primary"
      type="button"
      height="36px"
      fontSize="12.5px"
      startEnhancer={
        <Icon name="ph-bookmark-simple" weight="bold" size={12.5} />
      }
      onClick={onSave}
    >
      Add to shortlist
    </Button>
    <Button
      kind="primary"
      type="button"
      height="36px"
      fontSize="12.5px"
      onClick={onAddToCampaign}
    >
      Add to campaign
    </Button>
    <Button
      kind="tertiary"
      type="button"
      height="36px"
      fontSize="12.5px"
      textColor="var(--sk-text-tertiary)"
      onClick={onClear}
    >
      Clear
    </Button>
  </Box>
);
