import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { Input } from "@/infra/baseweb/Input";
import { useAddCompetitorForm } from "../hooks/useAddCompetitorForm";

type AddCompetitorControlProps = {
  trackedCount: number;
  maxTracked: number;
};

export const AddCompetitorControl = ({
  trackedCount,
  maxTracked,
}: AddCompetitorControlProps) => {
  const {
    showAddInput,
    toggleAddInput,
    newHandle,
    setNewHandle,
    submitAddCompetitor,
  } = useAddCompetitorForm();

  return (
    <Box className="mb-1.5 flex flex-wrap items-center gap-2 px-7">
      <Box as="span" className="mr-0.5 text-[11.5px] text-text-tertiary">
        Tracking {trackedCount}/{maxTracked} competitors
      </Box>
      {showAddInput ? (
        <Box className="inline-flex items-center gap-1.5">
          <Input
            type="userName"
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            placeholder="wow_skinscience"
            size="compact"
            width="190px"
            height="32px"
            backgroundColor="var(--sk-surface)"
          />
          <Button
            kind="primary"
            height="32px"
            onClick={submitAddCompetitor}
          >
            Add
          </Button>
        </Box>
      ) : (
        <Button
          kind="primary"
          height="32px"
          startEnhancer={<Icon name="ph-plus" weight="bold" size={11} />}
          onClick={toggleAddInput}
        >
          Add competitor
        </Button>
      )}
    </Box>
  );
};
