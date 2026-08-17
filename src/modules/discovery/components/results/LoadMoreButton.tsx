import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";

type LoadMoreButtonProps = {
  onClick: () => void;
};

export const LoadMoreButton = ({ onClick }: LoadMoreButtonProps) => (
  <Box className="mt-5 flex justify-center">
    <Button
      kind="secondary"
      type="button"
      height="36px"
      fontSize="12.5px"
      onClick={onClick}
    >
      Load more
    </Button>
  </Box>
);
