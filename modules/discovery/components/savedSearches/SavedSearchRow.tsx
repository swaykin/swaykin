import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import type { SavedSearch } from "../../types";

type SavedSearchRowProps = {
  savedSearch: SavedSearch;
  active: boolean;
  onApply: () => void;
  onDelete: () => void;
};

const ROW_BUTTON_OVERRIDES = {
  BaseButton: {
    style: {
      justifyContent: "space-between",
      padding: "8px 10px",
      textAlign: "left" as const,
    },
  },
};

export const SavedSearchRow = ({
  savedSearch,
  active,
  onApply,
  onDelete,
}: SavedSearchRowProps) => (
  <Button
    kind="tertiary"
    type="button"
    onClick={onApply}
    height="auto"
    width="100%"
    backgroundColor={active ? "var(--sk-accent-subtle)" : undefined}
    overrides={ROW_BUTTON_OVERRIDES}
    endEnhancer={
      <IconButton
        kind="tertiary"
        type="button"
        aria-label={`Delete ${savedSearch.name}`}
        onClick={onDelete}
        height="26px"
        width="26px"
      >
        <Icon name="ph-x" size={12} color="var(--sk-text-tertiary)" />
      </IconButton>
    }
  >
    <Box className="flex flex-col items-start gap-0.5">
      <Box as="span" className="text-[12.5px] font-semibold text-text">
        {savedSearch.name}
      </Box>
      <Box as="span" className="text-[11px] text-text-tertiary">
        {savedSearch.desc}
      </Box>
    </Box>
  </Button>
);
