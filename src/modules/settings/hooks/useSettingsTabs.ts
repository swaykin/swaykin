/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SETTINGS_TABS, type SettingsTabKey } from "../constants";

const getSettingsTabKey = (value: string | null): SettingsTabKey =>
  SETTINGS_TABS.some((t) => t.key === value)
    ? (value as SettingsTabKey)
    : "profile";

export const useSettingsTabs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<SettingsTabKey>(
    getSettingsTabKey(requestedTab),
  );

  useEffect(() => {
    setTab(getSettingsTabKey(requestedTab));
  }, [requestedTab]);

  const onTabChange = useCallback(
    (nextTab: SettingsTabKey) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", nextTab);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return { tab, onTabChange };
};
