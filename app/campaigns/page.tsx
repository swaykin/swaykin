import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

// Campaigns was a stub target in the handoff (not a designed screen).
// Placeholder per the README guidance until that screen is designed.
export default function CampaignsPage() {
  return (
    <div style={{ padding: "18px 28px 44px" }}>
      <PageHeader breadcrumb="SwayKin AI · Campaigns" title="Campaigns" subtitle="Manage and track your influencer campaigns." />
      <Card style={{ marginTop: 20 }} padding={48}>
        <div className="flex flex-col items-center justify-center text-center" style={{ gap: 10, color: "var(--sk-text-tertiary)" }}>
          <Icon name="ph-flag" weight="bold" size={28} color="var(--sk-text-tertiary)" />
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--sk-text-secondary)" }}>Campaigns screen coming soon</div>
          <div style={{ fontSize: 12.5 }}>This screen has not been designed yet.</div>
        </div>
      </Card>
    </div>
  );
}
