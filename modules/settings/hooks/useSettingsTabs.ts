import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SETTINGS_TABS, type SettingsTabKey } from "../constants";

const isSettingsTabKey = (value: string | null): value is SettingsTabKey =>
  SETTINGS_TABS.some((t) => t.key === value);

export const useSettingsTabs = () => {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<SettingsTabKey>(
    isSettingsTabKey(requestedTab) ? requestedTab : "profile",
  );
  return { tab, setTab };
};
