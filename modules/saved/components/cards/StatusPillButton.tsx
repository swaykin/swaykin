import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { StatusPillMenu } from "./StatusPillMenu";
import { STATUS_META, type SavedStatus } from "../../constants";

type StatusPillButtonProps = {
  status: SavedStatus;
  onSelect: (status: SavedStatus) => void;
};

export const StatusPillButton = ({ status, onSelect }: StatusPillButtonProps) => {
  const meta = STATUS_META[status];

  return (
    <StatefulPopover
      placement="bottomLeft"
      content={({ close }) => (
        <StatusPillMenu
          status={status}
          onSelect={(next) => {
            onSelect(next);
            close();
          }}
        />
      )}
    >
      <Button
        kind="tertiary"
        type="button"
        height="28px"
        fontSize="11px"
        weight="bold"
        backgroundColor={meta.bg}
        textColor={meta.color}
        endEnhancer={<Icon name="ph-caret-down" size={9} color={meta.color} />}
      >
        {status}
      </Button>
    </StatefulPopover>
  );
};
