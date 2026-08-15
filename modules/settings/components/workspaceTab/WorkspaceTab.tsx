import { Box } from "@/infra/baseweb/Box";
import { BrandProfileCard } from "./BrandProfileCard";
import { PrivacyCard } from "./PrivacyCard";

export const WorkspaceTab = () => (
  <Box className="flex max-w-[640px] flex-col gap-4">
    <BrandProfileCard />
    <PrivacyCard />
  </Box>
);
