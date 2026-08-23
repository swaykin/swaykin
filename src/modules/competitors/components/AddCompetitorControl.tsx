import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { Input } from "@/infra/baseweb/Input";
import { useAddCompetitorForm } from "../hooks/useAddCompetitorForm";

type AddCompetitorControlProps = {
  trackedCount: number;
  maxTracked: number;
  onAdded?: () => void;
};

export const AddCompetitorControl = ({
  trackedCount,
  maxTracked,
  onAdded,
}: AddCompetitorControlProps) => {
  const {
    showAddInput,
    toggleAddInput,
    newHandle,
    setNewHandle,
    submitAddCompetitor,
    submitting,
    error,
  } = useAddCompetitorForm(onAdded);

  return (
    <Box className="mb-1.5 flex flex-col gap-2 px-7">
      <Box className="flex flex-wrap items-center gap-2">
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
              disabled={submitting}
            />
            <Button
              kind="primary"
              height="32px"
              disabled={submitting}
              onClick={submitAddCompetitor}
              startEnhancer={
                submitting ? (
                  <Icon name="ph-circle-notch" size={11} className="animate-spin" />
                ) : undefined
              }
            >
              {submitting ? "Adding..." : "Add"}
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
      {error && (
        <Box className="flex items-center gap-2 rounded-xl border border-[var(--red-400)] bg-[var(--red-50)] px-4 py-3 text-xs font-semibold text-[var(--red-600)]">
          <Icon name="ph-warning-circle" weight="fill" size={15} />
          {error}
        </Box>
      )}
    </Box>
  );
};
