"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/Toast";
import { BrandChips } from "@/components/competitors/BrandChips";
import { EngagementCard } from "@/components/competitors/EngagementCard";
import { ContentGrid } from "@/components/competitors/ContentGrid";
import { HashtagsCard } from "@/components/competitors/HashtagsCard";
import { HeatmapCard } from "@/components/competitors/HeatmapCard";
import { TimelineCard } from "@/components/competitors/TimelineCard";
import { ADD_BRAND_TOAST, ADD_COMPETITOR_TOAST, INITIAL_BRAND_ACTIVE, type BrandKey } from "@/components/competitors/data";

export default function CompetitiveAnalysis() {
  const { showToast } = useToast();
  const [activeMap, setActiveMap] = useState<Record<BrandKey, boolean>>(INITIAL_BRAND_ACTIVE);

  const toggleBrand = (key: BrandKey) => {
    setActiveMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: "18px 28px 44px" }}>
      <div className="flex flex-col gap-4">
        <PageHeader
          breadcrumb="SwayKin AI · Competitive Analysis"
          title="Competitive Analysis"
          subtitle="Benchmark your influencer strategy against competitor brands."
          actions={
            <Button
              variant="primary"
              icon={<Icon name="ph-plus" weight="bold" size={14} />}
              onClick={() => showToast(ADD_COMPETITOR_TOAST)}
            >
              Add Competitor
            </Button>
          }
        />

        <BrandChips activeMap={activeMap} onToggle={toggleBrand} onAddBrand={() => showToast(ADD_BRAND_TOAST)} />

        <EngagementCard activeMap={activeMap} />

        <ContentGrid />

        <div className="grid grid-cols-2 gap-4" style={{ alignItems: "start" }}>
          <HashtagsCard />
          <HeatmapCard />
        </div>

        <TimelineCard />
      </div>
    </div>
  );
}
