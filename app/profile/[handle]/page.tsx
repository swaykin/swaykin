"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/Toast";
import { CampaignRelationshipStrip } from "@/components/profile/CampaignRelationshipStrip";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { CollaborationsTable } from "@/components/profile/CollaborationsTable";
import { RecentFeedGrid, FEED_PAGE_SIZE } from "@/components/profile/RecentFeedGrid";
import { profileMock } from "@/components/profile/mock-data";

const FEED_INITIAL_SHOWN = 4;

// This screen renders the single mock creator from the prototype regardless
// of the [handle] route param. In production this would fetch the creator
// profile server-side by handle instead of using hardcoded mock data.
export default function InfluencerProfilePage() {
  const { showToast } = useToast();
  const [feedShown, setFeedShown] = useState(FEED_INITIAL_SHOWN);

  const { name, handle, niche, location, igUrl, campaigns, collaborations, feedPool } = profileMock;

  return (
    <div style={{ padding: "18px 28px 44px" }}>
      <div className="flex flex-col" style={{ gap: 16 }}>
        <PageHeader
          breadcrumb={`SwayKin AI · Influencer Discovery · ${name}`}
          title={name}
          subtitle={`@${handle} · ${niche}, ${location}`}
          actions={
            <>
              <a
                href={igUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-[6px]"
                style={{
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 9,
                  border: "1px solid var(--sk-border)",
                  background: "var(--sk-surface)",
                  color: "var(--sk-text-secondary)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Icon name="ph-instagram-logo" weight="fill" size={14} color="#E1306C" />
                View Instagram
              </a>
              <Button
                variant="primary"
                icon={<Icon name="ph-flag" weight="bold" size={14} />}
                onClick={() => showToast(`Added ${name} to campaign shortlist`)}
                style={{ height: 36, fontSize: 12.5 }}
              >
                Add to Campaign
              </Button>
            </>
          }
        />

        <CampaignRelationshipStrip name={name} campaigns={campaigns} />

        <div
          className="grid items-start"
          style={{ gridTemplateColumns: "280px 1fr", gap: 16 }}
        >
          <ProfileSidebar />
          <CollaborationsTable collaborations={collaborations} />
        </div>

        <RecentFeedGrid
          feedPool={feedPool}
          igUrl={igUrl}
          feedShown={feedShown}
          onLoadMore={() =>
            setFeedShown((s) => Math.min(s + FEED_PAGE_SIZE, feedPool.length))
          }
        />
      </div>
    </div>
  );
}
