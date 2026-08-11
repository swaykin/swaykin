import { Box } from "@/infra/baseweb/Box";
import { NotificationsCard } from "./NotificationsCard";
import { ProfileInfoCard } from "./ProfileInfoCard";

export const ProfileTab = () => (
  <Box className="flex max-w-[900px] flex-col gap-4">
    <ProfileInfoCard />
    <NotificationsCard />
  </Box>
);
