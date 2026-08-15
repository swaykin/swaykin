import { Input } from "@/infra/baseweb/Input";
import { Icon } from "@/infra/baseweb/Icon";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const SEARCH_INPUT_OVERRIDES = {
  Root: { style: { maxWidth: "280px" } },
};

export const SearchField = ({ value, onChange }: SearchFieldProps) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.currentTarget.value)}
    placeholder="Search creators"
    height="36px"
    borderRadius="9px"
    fontSize="12.5px"
    backgroundColor="var(--sk-surface)"
    borderWidth="1px"
    startEnhancer={
      <Icon
        name="ph-magnifying-glass"
        size={13}
        color="var(--sk-text-tertiary)"
      />
    }
    overrides={SEARCH_INPUT_OVERRIDES}
  />
);
