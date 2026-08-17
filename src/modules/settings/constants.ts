export type SettingsTabKey = "profile" | "workspace" | "team" | "credits" | "billing";

export const SETTINGS_TABS: { key: SettingsTabKey; label: string; icon: string }[] = [
  { key: "profile", label: "My Profile", icon: "ph-user" },
  { key: "workspace", label: "Workspace", icon: "ph-buildings" },
  { key: "team", label: "Team Members", icon: "ph-users" },
  { key: "credits", label: "Credits & Usage", icon: "ph-coin" },
  { key: "billing", label: "Billing", icon: "ph-credit-card" },
];
