import { Box } from "@/infra/baseweb/Box";
import { Avatar } from "@/infra/baseweb/Avatar";
import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserMenu } from "./UserMenu";

export const UserButton = () => {
  const { currentUser } = useCurrentUser();

  return (
    <Box className="flex items-center border-0 bg-transparent px-0.5 py-1.5">
      <StatefulPopover
        placement="bottomRight"
        content={({ close }) => (
          <UserMenu user={currentUser} onNavigate={close} />
        )}
      >
        <Box as="button" aria-label="Open user menu" className="cursor-pointer">
          <Avatar name={currentUser.name} size="30px" fontSize="12px" />
        </Box>
      </StatefulPopover>
    </Box>
  );
};
