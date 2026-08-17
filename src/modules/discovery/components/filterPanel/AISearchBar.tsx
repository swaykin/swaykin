import { useState } from "react";
import _noop from "lodash/noop";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { Input } from "@/infra/baseweb/Input";

// Root's own right padding is fixed at 0 unconditionally (rather than left as Base Web's
// enhancer-derived default) — Input additionally reserves its own 14px regardless of enhancer
// presence, so that needs resetting too. The 8px gap to the input text lives on EndEnhancer's
// inner edge only, flush against Root on the outer edge. Scoped to this component only.
const AI_INPUT_OVERRIDES = {
  Root: {
    style: { paddingRight: "0px" },
  },
  EndEnhancer: {
    style: {
      paddingRight: "0px",
    },
  },
};

export const AISearchBar = () => {
  const [query, setQuery] = useState("");

  return (
    <Box className="mb-4 rounded-2xl border border-[var(--sk-accent-subtle-strong)] bg-accent-subtle px-4 py-3.5">
      <Box className="mb-0.5 flex items-center gap-1.5 text-[12.5px] font-bold text-accent-strong">
        <Icon name="ph-sparkle" size={13} />
        Not sure who yet? Describe them
      </Box>
      <Box className="mb-2.5 text-[11.5px] text-text-secondary">
        Tell us in plain words — we&apos;ll set the filters below for you.
      </Box>
      <Input
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder="e.g. 'verified skincare creators in Mumbai, 4%+ engagement, micro tier'"
        height="42px"
        borderRadius="11px"
        borderColor="var(--sk-border)"
        backgroundColor="var(--sk-surface)"
        fontSize="13px"
        overrides={AI_INPUT_OVERRIDES}
        endEnhancer={() => (
          <Box className="flex items-center gap-5">
            {query && (
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
            )}
            <Button kind="primary" type="button" height="36px" onClick={_noop}>
              Apply
            </Button>
          </Box>
        )}
      />
    </Box>
  );
};
