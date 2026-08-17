import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { useNotifications, Notification } from "./useNotifications";

const MenuItem = ({ notification }: { notification: Notification }) => (
  <Box className="flex gap-2.5 rounded-lg p-2">
    <Icon
      name={notification.icon}
      weight="fill"
      size={13}
      color={notification.iconColor}
      backgroundColor={notification.tint}
    />
    <Box className="min-w-0 flex-1">
      <Box className="text-[12.5px] leading-snug text-text">
        {notification.text}
      </Box>
      <Box className="mt-0.5 text-[11px] text-text-tertiary">
        {notification.time}
      </Box>
    </Box>
  </Box>
);

export const NotificationsMenu = () => {
  const notifications = useNotifications();
  return (
    <Box className="w-[320px] rounded-xl border border-border bg-surface p-2 shadow-overlay">
      <Box className="px-2 pb-2 pt-1.5 text-[12.5px] font-bold text-text">
        Notifications
      </Box>
      {notifications.map((notification) => (
        <MenuItem key={notification.id} notification={notification} />
      ))}
    </Box>
  );
};
