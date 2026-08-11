import { useCallback, useState } from "react";

const NOTIFICATION_DEFS = [
  { key: "email", label: "Email me about campaign updates" },
  { key: "product", label: "Product news and tips" },
  { key: "digest", label: "Weekly performance digest" },
] as const;

type NotificationKey = (typeof NOTIFICATION_DEFS)[number]["key"];

export const useNotificationToggles = () => {
  const [notifs, setNotifs] = useState<Record<NotificationKey, boolean>>({
    email: true,
    product: true,
    digest: false,
  });

  const toggle = useCallback(
    (key: NotificationKey) =>
      setNotifs((prev) => ({ ...prev, [key]: !prev[key] })),
    [],
  );

  return { defs: NOTIFICATION_DEFS, notifs, toggle };
};
