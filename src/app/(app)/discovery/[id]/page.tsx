"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { useGetCreatorByUsername } from "@/modules/discovery/hooks/useGetCreatorByUsername";
import { mapCreatorLookupToCreator } from "@/modules/discovery/mapCreatorLookupToCreator";
import { DetailView } from "@/modules/influencer/DetailView";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCreator, data, loading } = useGetCreatorByUsername();

  useEffect(() => {
    getCreator(id);
    // Runs once per `id` — re-triggering on `getCreator` identity would refetch forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const creator = data ? mapCreatorLookupToCreator(data) : null;

  if (loading) {
    return (
      <Box className="flex items-center justify-center gap-2 px-7 py-16 text-sm text-text-secondary">
        <Icon name="ph-circle-notch" size={16} className="animate-spin" />
        Loading profile…
      </Box>
    );
  }

  if (!creator) return null;

  return (
    <Box className="px-7 py-6">
      <DetailView
        influencer={creator}
        onBack={() => router.push("/discovery")}
      />
    </Box>
  );
};

export default Page;
