import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { BrandProfileFields } from "@/infra/components/BrandProfileFields";
// import { Tag } from "@/infra/components/Tag";
import { useWorkspaceForm } from "../../hooks/useWorkspaceForm";

// const USED_FOR = ["Outreach drafts", "Creator scoring", "Competitor analysis"];

export const BrandProfileCard = () => {
  const { details, onAction, save, isSaving } = useWorkspaceForm();

  return (
    <Box className="rounded-2xl border border-border bg-surface pt-3 pb-6 px-7 shadow-card">
      <Box className="flex flex-col gap-2">
        <BrandProfileFields
          subtitle="Context SwayKin uses to draft outreach, score creators, and tailor recommendations."
          details={details}
          onAction={onAction}
        />

        {/* <Box className="flex flex-wrap items-center gap-2 pt-1">
          <Box as="span" className="mr-0.5 text-[11px] text-text-tertiary">
            Used for:
          </Box>
          {USED_FOR.map((label) => (
            <Tag key={label} label={label} tone="accent" />
          ))}
        </Box> */}
      </Box>

      <Box className="mt-5 flex justify-end gap-2 border-t border-border pt-5">
        <Button
          kind="primary"
          height="36px"
          onClick={save}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};
