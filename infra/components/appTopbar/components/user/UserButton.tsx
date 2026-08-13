import { Box } from "@/infra/baseweb/Box";
import { Avatar } from "@/infra/baseweb/Avatar";
import { StatefulPopover } from "@/infra/baseweb/StatefulPopover";
import { useUserContext } from "@/providers/UserProvider";
import { UserMenu } from "./UserMenu";

export const UserButton = () => {
  const { user } = useUserContext();

  return (
    <Box className="flex items-center border-0 bg-transparent px-0.5 py-1.5">
      <StatefulPopover
        placement="bottomRight"
        content={({ close }) => <UserMenu user={user} onNavigate={close} />}
      >
        <Box as="button" aria-label="Open user menu" className="cursor-pointer">
          <Avatar name={user.name} size="30px" fontSize="12px" />
        </Box>
      </StatefulPopover>
    </Box>
  );
};
