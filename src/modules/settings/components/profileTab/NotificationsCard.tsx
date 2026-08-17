import { Box } from "@/infra/baseweb/Box";
import { Switch } from "@/infra/baseweb/Switch";
import { useNotificationToggles } from "../../hooks/useNotificationToggles";

export const NotificationsCard = () => {
  const { defs, notifs, toggle } = useNotificationToggles();

  return (
    <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Box className="mb-3.5 text-[14px] font-bold text-text">
        Notifications
      </Box>
      {defs.map((def, index) => (
        <Box
          key={def.key}
          className={`flex items-center justify-between gap-3 py-2.5 ${
            index < defs.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <Box as="span" className="text-[13px] text-text">
            {def.label}
          </Box>
          <Switch checked={notifs[def.key]} onChange={() => toggle(def.key)} />
        </Box>
      ))}
    </Box>
  );
};
