import { useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { Input } from "@/infra/baseweb/Input";
import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";

type SaveSearchButtonProps = {
  onSave: (name: string) => void;
};

const SaveSearchForm = ({
  onSave,
  onDone,
}: {
  onSave: (name: string) => void;
  onDone: () => void;
}) => {
  const [name, setName] = useState("");

  return (
    <Box className="w-[250px] rounded-xl border border-border bg-surface p-2.5 shadow-overlay">
      <Input
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          const trimmed = name.trim();
          if (!trimmed) return;
          onSave(trimmed);
          onDone();
        }}
        placeholder="Name this search and hit enter"
        height="32px"
        borderRadius="7px"
        fontSize="12px"
        autoFocus
      />
    </Box>
  );
};

export const SaveSearchButton = ({ onSave }: SaveSearchButtonProps) => (
  <StatefulPopover
    placement="bottomLeft"
    content={({ close }) => <SaveSearchForm onSave={onSave} onDone={close} />}
  >
    <Button
      kind="secondary"
      type="button"
      height="36px"
      fontSize="12px"
      startEnhancer={<Icon name="ph-bookmark-simple" weight="bold" size={12.5} />}
    >
      Save this search
    </Button>
  </StatefulPopover>
);
