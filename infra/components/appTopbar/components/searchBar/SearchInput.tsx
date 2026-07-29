"use client";

import { Icon } from "@/infra/baseweb/Icon";
import { Input } from "@/infra/baseweb/Input";
import { IconButton } from "@/infra/baseweb/IconButton";

// Root owns the constant 12px inset (matching the design's outer-container padding model) so
// it holds regardless of whether the clear icon is present — Base Web's own default padding is
// scale-based and asymmetric (left-only), and Input additionally reserves its own 14px on both
// sides regardless of enhancer presence, so both need resetting rather than layering on top.
// InputContainer/StartEnhancer/EndEnhancer each paint their own opaque backgroundColor on top of
// Root, so the sunken background needs to be set on all of them, not just Root.
const SEARCH_INPUT_OVERRIDES = {
  Root: {
    style: {
      height: "36px",
      paddingLeft: "12px",
      paddingRight: "12px",
      backgroundColor: "var(--sk-surface-sunken)",
      borderTopWidth: "1px",
      borderBottomWidth: "1px",
      borderLeftWidth: "1px",
      borderRightWidth: "1px",
      borderTopColor: "var(--sk-border)",
      borderBottomColor: "var(--sk-border)",
      borderLeftColor: "var(--sk-border)",
      borderRightColor: "var(--sk-border)",
    },
  },
  InputContainer: {
    style: {
      backgroundColor: "var(--sk-surface-sunken)",
    },
  },
  // 8px gap to the input text lives on the enhancer's inner edge only — the outer edge is flush
  // against Root, which already provides the 12px inset.
  StartEnhancer: {
    style: {
      backgroundColor: "var(--sk-surface-sunken)",
      paddingLeft: "0",
      paddingRight: "8px",
    },
  },
  EndEnhancer: {
    style: {
      backgroundColor: "var(--sk-surface-sunken)",
      paddingLeft: "8px",
      paddingRight: "0",
    },
  },
  Input: {
    style: {
      fontSize: "12.5px",
      paddingLeft: "0",
      paddingRight: "0",
    },
  },
};

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
};

export const SearchInput = ({
  value,
  onChange,
  onFocus,
  onClear,
}: SearchInputProps) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onFocus={onFocus}
    placeholder="Search campaigns, influencers, competitors…"
    overrides={SEARCH_INPUT_OVERRIDES}
    startEnhancer={() => (
      <Icon
        name="ph-magnifying-glass"
        size={14}
        color="var(--sk-text-tertiary)"
      />
    )}
    endEnhancer={
      value
        ? () => (
            <IconButton
              kind="tertiary"
              type="button"
              aria-label="Clear search"
              onClick={onClear}
              overrides={{
                BaseButton: {
                  style: { height: "auto", width: "auto" },
                },
              }}
            >
              <Icon name="ph-x" size={13} color="var(--sk-text-tertiary)" />
            </IconButton>
          )
        : undefined
    }
  />
);
