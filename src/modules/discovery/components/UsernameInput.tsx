import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { Input } from "@/infra/baseweb/Input";
import { useGetCreatorByUsername } from "@/modules/discovery/hooks/useGetCreatorByUsername";

// Root's own padding is fixed at 0 unconditionally (rather than left as Base Web's
// enhancer-derived default) so it holds regardless of whether the clear icon is present — Input
// additionally reserves its own 14px on both sides regardless of enhancer presence, so that
// needs resetting too. The 8px gap to the input text lives on the enhancer's inner edge only,
// flush against Root on the outer edge. Scoped to this component only — not a shared concern.
const LOOKUP_INPUT_OVERRIDES = {
  Root: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
  Input: {
    style: {
      paddingLeft: "0px",
    },
  },
};

export const UsernameInput = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { getCreator, loading, error } = useGetCreatorByUsername();

  const handleLookup = async () => {
    const result = await getCreator(query);
    if (result) router.push(`/discovery/${encodeURIComponent(result.profile.igUsername)}`);
  };

  return (
    <Box className="flex flex-col gap-2">
      <Box className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-card">
        <Box
          as="span"
          className="whitespace-nowrap text-xs font-bold text-text-secondary"
        >
          Know the exact handle?
        </Box>
        <Box className="max-w-[420px] flex-1">
          <Input
            type="userName"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="exact instagram username"
            height="36px"
            borderRadius="9px"
            borderColor="var(--sk-border-strong)"
            fontSize="13px"
            overrides={LOOKUP_INPUT_OVERRIDES}
            endEnhancer={
              query
                ? () => (
                    <IconButton
                      kind="tertiary"
                      type="button"
                      aria-label="Clear"
                      onClick={() => setQuery("")}
                      height="auto"
                      width="auto"
                    >
                      <Icon
                        name="ph-x-circle"
                        weight="bold"
                        size={15}
                        color="var(--sk-text-tertiary)"
                      />
                    </IconButton>
                  )
                : undefined
            }
          />
        </Box>
        <Button
          kind="primary"
          type="button"
          height="36px"
          disabled={!query || loading}
          onClick={handleLookup}
          startEnhancer={
            loading ? (
              <Icon name="ph-circle-notch" size={13} className="animate-spin" />
            ) : (
              <Icon name="ph-magnifying-glass" weight="bold" size={13} />
            )
          }
        >
          {loading ? "Looking up..." : "Look up profile"}
        </Button>
      </Box>
      {error && (
        <Box className="flex items-center gap-2 rounded-xl border border-[var(--red-400)] bg-[var(--red-50)] px-4 py-3 text-xs font-semibold text-[var(--red-600)]">
          <Icon name="ph-warning-circle" weight="fill" size={15} />
          We couldn&apos;t find @{query}. Check the spelling and try again.
        </Box>
      )}
    </Box>
  );
};
