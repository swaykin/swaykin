import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { NotificationsMenu } from "./NotificationsMenu";

export const NotificationButton = () => (
  <StatefulPopover placement="bottomRight" content={<NotificationsMenu />}>
    <Box className="relative">
      <IconButton
        kind="secondary"
        aria-label="Notifications"
        height="32px"
        width="32px"
      >
        <Icon name="ph-bell" size={16} color="var(--sk-text-secondary)" />
      </IconButton>
      <Box
        className="pointer-events-none absolute right-[8px] top-[5px] h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--red-600)" }}
      />
    </Box>
  </StatefulPopover>
);
