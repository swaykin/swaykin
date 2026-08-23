import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { Modal } from "@/infra/baseweb/Modal";
import {
  CompareTable,
  type CompareTableColumn,
} from "@/infra/components/CompareTable";
import { buildCompareRows } from "../../utils";
import type { Creator } from "../../types";

type CompareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  creators: Creator[];
};

const CompareColumnHeader = ({ creator }: { creator: Creator }) => (
  <Box className="flex flex-col items-center gap-1">
    <Avatar name={creator.name} size="26px" fontSize="9.5px" />
    <Box className="whitespace-nowrap text-[11.5px] font-bold text-text">
      {creator.name}
    </Box>
  </Box>
);

const MODAL_OVERRIDES = {
  Dialog: {
    style: {
      width: "min(92vw, 880px)",
      maxHeight: "82vh",
      overflowY: "auto",
      borderRadius: "16px",
      padding: "24px",
    },
  },
  Close: {
    component: () => null,
  },
};

export const CompareModal = ({
  isOpen,
  onClose,
  creators,
}: CompareModalProps) => {
  const columns: CompareTableColumn[] = creators.map((creator) => ({
    key: creator.id,
    header: <CompareColumnHeader creator={creator} />,
  }));
  const rows = buildCompareRows(creators);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="auto"
      overrides={MODAL_OVERRIDES}
    >
      <Box className="mb-4 flex items-center justify-between">
        <Box as="span" className="text-base font-bold text-text">
          Compare creators
        </Box>
        <IconButton
          kind="secondary"
          type="button"
          aria-label="Close"
          onClick={onClose}
          height="30px"
          width="30px"
        >
          <Icon name="ph-x" size={14} color="var(--sk-text-secondary)" />
        </IconButton>
      </Box>
      <CompareTable columns={columns} rows={rows} minWidth="520px" />
    </Modal>
  );
};
