"use client";

import { useParams, useRouter } from "next/navigation";
import { Box } from "@/infra/baseweb/Box";
import { useGetInfluencers } from "@/modules/discovery/hooks/useGetInfluencers";
import { DetailView } from "@/modules/influencer/DetailView";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { influencers } = useGetInfluencers();
  const influencer = influencers.find((candidate) => candidate.id === id);

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
