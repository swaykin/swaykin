import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";

type BulkActionsBarProps = {
  selectedCount: number;
  onAddToCampaign: () => void;
  onUpdateStatus: () => void;
  onExport: () => void;
  onRemove: () => void;
  onClear: () => void;
};

const NOWRAP_OVERRIDES = {
  BaseButton: { style: { whiteSpace: "nowrap" as const } },
};

export const BulkActionsBar = ({
  selectedCount,
  onAddToCampaign,
  onUpdateStatus,
  onExport,
  onRemove,
  onClear,
}: BulkActionsBarProps) => (
  <Box className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--sk-accent-subtle-strong)] bg-accent-subtle px-4 py-2.5">
    <Box
      as="span"
      className="whitespace-nowrap text-[12.5px] font-bold text-accent-strong"
    >
      {selectedCount} selected
    </Box>
    <Box className="flex-1" />
    <Box className="flex flex-wrap items-center gap-2">
      <Button
        kind="primary"
        type="button"
        height="34px"
        fontSize="12px"
        overrides={NOWRAP_OVERRIDES}
        onClick={onAddToCampaign}
      >
        Add to Campaign
      </Button>
      <Button
        kind="secondary"
        type="button"
        height="34px"
        fontSize="12px"
        borderColor="var(--sk-accent-subtle-strong)"
        backgroundColor="transparent"
        textColor="var(--sk-accent-strong)"
        overrides={NOWRAP_OVERRIDES}
        onClick={onUpdateStatus}
      >
        Update Status
      </Button>
      <Button
        kind="secondary"
        type="button"
        height="34px"
        fontSize="12px"
        borderColor="var(--sk-accent-subtle-strong)"
        backgroundColor="transparent"
        textColor="var(--sk-accent-strong)"
        overrides={NOWRAP_OVERRIDES}
        onClick={onExport}
      >
        Export
      </Button>
      <Button
        kind="tertiary"
        type="button"
        height="34px"
        fontSize="12px"
        textColor="var(--sk-text-tertiary)"
        overrides={NOWRAP_OVERRIDES}
        onClick={onRemove}
      >
        Remove from Saved
      </Button>
      <Button
        kind="tertiary"
        type="button"
        height="34px"
        fontSize="12px"
        textColor="var(--sk-text-tertiary)"
        overrides={NOWRAP_OVERRIDES}
        onClick={onClear}
      >
        Clear
      </Button>
    </Box>
  </Box>
);
