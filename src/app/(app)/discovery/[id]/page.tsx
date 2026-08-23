"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { useGetInfluencers } from "@/modules/discovery/hooks/useGetInfluencers";
import { useGetCreatorByUsername } from "@/modules/discovery/hooks/useGetCreatorByUsername";
import { mapCreatorToInfluencer } from "@/modules/discovery/mapCreatorToInfluencer";
import { DetailView } from "@/modules/influencer/DetailView";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { influencers } = useGetInfluencers();
  const mockInfluencer = influencers.find((candidate) => candidate.id === id);
  const { getCreator, data, loading } = useGetCreatorByUsername();

  useEffect(() => {
    if (!mockInfluencer) getCreator(id);
    // Runs once per `id` — re-triggering on `getCreator`/`mockInfluencer` identity would refetch forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const influencer =
    mockInfluencer ?? (data ? mapCreatorToInfluencer(data) : null);

  if (loading) {
    return (
      <Box className="flex items-center justify-center gap-2 px-7 py-16 text-sm text-text-secondary">
        <Icon name="ph-circle-notch" size={16} className="animate-spin" />
        Loading profile…
      </Box>
    );
  }

  if (!influencer) return null;

  return (
    <Box className="px-7 py-6">
      <DetailView
        influencer={influencer}
        onBack={() => router.push("/discovery")}
      />
    </Box>
  );
};

export default Page;
