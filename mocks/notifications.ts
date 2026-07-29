export type Notification = {
  id: string;
  text: string;
  time: string;
  icon: string;
  iconColor: string;
  tint: string;
};

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    text: 'Priya Malhotra accepted your collaboration invite for "Monsoon Glow Launch".',
    time: "12m ago",
    icon: "ph-check-circle",
    iconColor: "var(--green-700)",
    tint: "var(--green-50)",
  },
  {
    id: "n2",
    text: "Ananya Kapoor submitted her Reel for review.",
    time: "2h ago",
    icon: "ph-film-strip",
    iconColor: "var(--sk-accent)",
    tint: "var(--sk-accent-subtle)",
  },
  {
    id: "n3",
    text: 'Campaign "Summer Skin Reset" has been marked as completed.',
    time: "5h ago",
    icon: "ph-flag",
    iconColor: "var(--blue-600)",
    tint: "var(--blue-50)",
  },
];
