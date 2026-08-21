import { Icon } from "@/infra/baseweb/Icon";
import { Input } from "@/infra/baseweb/Input";
import { IconButton } from "@/infra/baseweb/IconButton";

// Root owns the constant 12px inset (matching the design's outer-container padding model) so
// it holds regardless of whether the clear icon is present — Base Web's own default padding is
// scale-based and asymmetric (left-only), and Input additionally reserves its own 14px on both
// sides regardless of enhancer presence, so both need resetting rather than layering on top.
// StartEnhancer/EndEnhancer also paint their own opaque backgroundColor on top of Root (Input's
// `backgroundColor` prop already covers Root/InputContainer), so the sunken fill needs setting
// on these two as well.
export const SEARCH_INPUT_OVERRIDES = {
  Root: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  // 8px gap to the input text lives on the enhancer's inner edge only — the outer edge is flush
  // against Root, which already provides the 12px inset.
  StartEnhancer: {
    style: {
      paddingLeft: "0",
      paddingRight: "8px",
    },
  },
  EndEnhancer: {
    style: {
      paddingLeft: "8px",
      paddingRight: "0",
    },
  },
  Input: {
    style: {
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
    placeholder="Search campaigns, creators, competitors…"
    height="36px"
    borderColor="var(--sk-border)"
    fontSize="12.5px"
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
              height="auto"
              width="auto"
            >
              <Icon name="ph-x" size={13} color="var(--sk-text-tertiary)" />
            </IconButton>
          )
        : undefined
    }
  />
);
