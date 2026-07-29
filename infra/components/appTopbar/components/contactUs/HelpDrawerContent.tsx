"use client";

import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { SupportContactCard } from "./SupportContactCard";
import { HelpDrawerForm } from "./HelpDrawerForm";

type HelpDrawerContentProps = {
  onClose: () => void;
  onSubmit: (subject: string, description: string) => void;
};

export const HelpDrawerContent = ({
  onClose,
  onSubmit,
}: HelpDrawerContentProps) => (
  <Box className="flex h-full flex-col px-5 pt-3">
    <Box className="mb-3 flex items-center justify-between">
      <Box className="text-lg font-bold text-text">Ask Us</Box>
      <IconButton
        kind="tertiary"
        type="button"
        aria-label="Close"
        onClick={onClose}
        overrides={{
          BaseButton: {
            style: { height: "28px", width: "28px" },
          },
        }}
      >
        <Icon name="ph-x" size={16} color="var(--sk-text-secondary)" />
      </IconButton>
    </Box>
    <Box className="-mx-5 mb-5 border-t border-border" />
    <Box className="mb-5">
      <SupportContactCard />
    </Box>
    <HelpDrawerForm onSubmit={onSubmit} />
  </Box>
);
