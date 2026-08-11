import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { BrandProfileFields } from "@/infra/components/BrandProfileFields";
// import { Tag } from "@/infra/components/Tag";
import { useWorkspaceForm } from "../../hooks/useWorkspaceForm";

// const USED_FOR = ["Outreach drafts", "Creator scoring", "Competitor analysis"];

export const WorkspaceTab = () => {
  const { brandProfile, onAction, save } = useWorkspaceForm();

  return (
    <Box className="flex max-w-[640px] flex-col gap-4">
      <Box className="rounded-2xl border border-border bg-surface pt-3 pb-6 px-7 shadow-card">
        <Box className="flex flex-col gap-2">
          <BrandProfileFields
            subtitle="Context SwayKin uses to draft outreach, score creators, and tailor recommendations."
            brandProfile={brandProfile}
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
          <Button kind="primary" height="36px" onClick={save}>
            Save changes
          </Button>
        </Box>
      </Box>

      <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <Box className="mb-3.5 text-[14px] font-bold text-text">Privacy</Box>
        <Box className="flex items-center justify-between gap-3 border-b border-border py-2.5">
          <Box as="span" className="text-[13px] text-text">
            Download a copy of your data
          </Box>
          <Button kind="secondary" height="30px">
            Request export
          </Button>
        </Box>
        <Box className="flex items-center justify-between gap-3 py-2.5">
          <Box as="span" className="text-[13px] text-text">
            Privacy policy
          </Box>
          <Box
            as="a"
            href="#"
            className="text-[12.5px] font-semibold text-accent-strong"
          >
            View policy
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
