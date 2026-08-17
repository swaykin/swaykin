import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { ContentTypeBreakdown } from "@/infra/components/ContentTypeBreakdown";
import { RecentPostsCard } from "@/infra/components/RecentPostsCard";
import { TopHashtagsCard } from "@/infra/components/TopHashtagsCard";
import { useSavedInfluencers } from "@/hooks/useSavedInfluencers";
import { getEntityTintByName } from "@/lib/entityColor";
import { CollaborationsCard } from "./components/CollaborationsCard";
import { ContentThemesCard } from "./components/ContentThemesCard";
import { HeaderCard } from "./components/HeaderCard";
import { SaveTeaserCard } from "./components/SaveTeaserCard";
import { TopActionBar } from "./components/TopActionBar";
import type { Influencer } from "./types";

type DetailViewProps = {
  influencer: Influencer;
  onBack: () => void;
};

export const DetailView = ({ influencer, onBack }: DetailViewProps) => {
  const { savedIds, toggleSaved } = useSavedInfluencers();
  const saved = !!savedIds[influencer.id];
  const tint = getEntityTintByName(influencer.name);

  return (
    <Box className="flex flex-col gap-5">
      <TopActionBar
        onBack={onBack}
        saved={saved}
        onToggleShortlist={() => toggleSaved(influencer.id)}
        onExport={_noop}
        onOutreach={_noop}
      />
      <HeaderCard influencer={influencer} />
      <Box className="flex flex-wrap items-start gap-5">
        <Box className="min-w-[380px] flex-[2_1_420px]">
          <CollaborationsCard collabs={influencer.collabs} />
        </Box>
        <Box className="min-w-[260px] flex-[1_1_260px]">
          <TopHashtagsCard hashtags={influencer.hashtags} />
        </Box>
      </Box>
      <ContentThemesCard themes={influencer.themes} />
      <RecentPostsCard
        posts={influencer.posts}
        totalPosts={influencer.totalPostsNum}
        bgColor={tint}
      />
      <ContentTypeBreakdown
        pctReels={influencer.pctReels}
        pctStatic={influencer.pctStatic}
        pctCarousel={influencer.pctCarousel}
      />
      <SaveTeaserCard saved={saved} onSave={() => toggleSaved(influencer.id)} />
    </Box>
  );
};
