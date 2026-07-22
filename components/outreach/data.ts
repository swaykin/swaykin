export type Thread = {
  id: string;
  name: string;
  handle: string;
  email: string;
  initials: string;
  avatarBg: string;
  subject: string;
  preview: string;
  status: "Sent" | "Opened" | "Replied";
  statusBg: string;
  statusColor: string;
  lastActivity: string;
  unread: boolean;
  igUrl: string;
  body: string;
  hasReply: boolean;
  replyTime?: string;
  replyBody?: string;
};

export const threads: Thread[] = [
  {
    id: "ananya",
    name: "Ananya Kapoor",
    handle: "ananya.skincare",
    email: "ananya@skincarediaries.in",
    initials: "AK",
    avatarBg: "var(--violet-600)",
    subject: "Re: Collaboration for Monsoon Glow Launch",
    preview: "Yes! I'd love to be part of this campaign…",
    status: "Replied",
    statusBg: "var(--green-50)",
    statusColor: "var(--green-700)",
    lastActivity: "2h ago",
    unread: false,
    igUrl: "https://instagram.com/ananya.skincare",
    body: `Hi Nova Beauty team,\n\nThank you so much for reaching out! I've been a fan of your products and would absolutely love to collaborate on the Monsoon Glow Launch.\n\nCould you share the campaign brief and timeline? I'm flexible with formats — happy to do Reels, Stories, or a carousel post.\n\nAnanya`,
    hasReply: true,
    replyTime: "1h ago",
    replyBody: `Hi Ananya!\n\nSo glad to hear you're in! Sending over the full brief — the campaign runs July 25–Aug 15, and we're thinking 1 Reel + 3 Stories.\n\nBudget range: ₹40,000–₹55,000 depending on final deliverables.\n\nBest,\nNova Beauty Co. team`,
  },
  {
    id: "meher",
    name: "Meher Chhabra",
    handle: "glow.with.meher",
    email: "meher@glowwithmeher.com",
    initials: "MC",
    avatarBg: "var(--blue-600)",
    subject: "Partnership opportunity — Nova Beauty Co.",
    preview: "Following up on our outreach from last week…",
    status: "Opened",
    statusBg: "var(--sk-accent-subtle)",
    statusColor: "var(--sk-accent-strong)",
    lastActivity: "1d ago",
    unread: true,
    igUrl: "https://instagram.com/glow.with.meher",
    body: `Hi Meher,\n\nWe've been following your content and think you'd be a perfect fit for our upcoming Monsoon Glow Launch campaign.\n\nWe're looking for creators who specialize in skincare education — exactly what you do so well.\n\nWould love to chat. Are you available this week?\n\nNova Beauty Co. team`,
    hasReply: false,
  },
  {
    id: "ishaan",
    name: "Ishaan Verma",
    handle: "ishaan.grooms",
    email: "ishaan@ishaangrooms.com",
    initials: "IV",
    avatarBg: "var(--pink-600)",
    subject: "Quick one — collab for our new launch?",
    preview: "Hey Ishaan, we saw your latest reel and loved…",
    status: "Opened",
    statusBg: "var(--sk-accent-subtle)",
    statusColor: "var(--sk-accent-strong)",
    lastActivity: "3d ago",
    unread: true,
    igUrl: "https://instagram.com/ishaan.grooms",
    body: `Hey Ishaan,\n\nWe saw your latest reel and loved the honest breakdown of your skincare routine.\n\nWe're launching a new serum next month and would love to send you a PR kit + potentially collaborate on a paid Reel.\n\nInterested?\n\nNova Beauty Co. team`,
    hasReply: false,
  },
  {
    id: "zara",
    name: "Zara Fernandes",
    handle: "zara.beautyedit",
    email: "zara@zarabeautyedit.in",
    initials: "ZF",
    avatarBg: "var(--orange-600)",
    subject: "Nova Beauty x Zara — makeup edit collab",
    preview: "Hi Zara, we think your aesthetic is a perfect match…",
    status: "Sent",
    statusBg: "var(--neutral-light-solid-100)",
    statusColor: "var(--sk-text-secondary)",
    lastActivity: "4d ago",
    unread: false,
    igUrl: "https://instagram.com/zara.beautyedit",
    body: `Hi Zara,\n\nWe think your aesthetic is a perfect match for our upcoming festive campaign. We're curating a "Glow Edit" featuring 5 creators with distinct styles — and yours would be a beautiful addition.\n\nThe campaign runs Oct 10–Nov 5 with a budget of ₹60,000–₹80,000 for 2 Reels and an exclusive unboxing Story series.\n\nNova Beauty Co. team`,
    hasReply: false,
  },
  {
    id: "rhea",
    name: "Rhea Sundaram",
    handle: "thebeautyfile",
    email: "rhea@thebeautyfile.co",
    initials: "RS",
    avatarBg: "var(--teal-600)",
    subject: "Nova Beauty partnership — Lifestyle content",
    preview: "Hi Rhea, we've admired your work for a while…",
    status: "Sent",
    statusBg: "var(--neutral-light-solid-100)",
    statusColor: "var(--sk-text-secondary)",
    lastActivity: "6d ago",
    unread: false,
    igUrl: "https://instagram.com/thebeautyfile",
    body: `Hi Rhea,\n\nWe've admired your work — the way you blend skincare with lifestyle content feels very authentic.\n\nWe're planning a partnership around our new range and think your audience would connect deeply with it. Open to a discovery call?\n\nNova Beauty Co. team`,
    hasReply: false,
  },
];

export const folders = [
  { key: "inbox", label: "Inbox", icon: "ph-inbox", count: "3" },
  { key: "starred", label: "Starred", icon: "ph-star", count: "" },
  { key: "sent", label: "Sent", icon: "ph-paper-plane-tilt", count: "" },
  { key: "drafts", label: "Drafts", icon: "ph-file", count: "2" },
];

export const labels = [
  { label: "Replied", color: "var(--green-600)" },
  { label: "Opened", color: "var(--sk-accent)" },
  { label: "Follow-up needed", color: "var(--orange-600)" },
];

export const statusFilters = ["All", "Sent", "Opened", "Replied"] as const;
export type StatusFilter = (typeof statusFilters)[number];
