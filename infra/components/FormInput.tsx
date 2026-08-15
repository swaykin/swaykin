import { Box } from "@/infra/baseweb/Box";
import { FormControl } from "@/infra/baseweb/FormControl";
import { Input, type InputProps } from "@/infra/baseweb/Input";

// FormControl's Label is a real Base Web component — a Tailwind className competes with
// baseui's own injected font-size/weight/color on equal specificity and isn't guaranteed to
// win, so typography here has to go through `overrides.Label.style` instead.
const LABEL_STYLE = {
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--sk-text)",
};
const REQUIRED_LABEL_STYLE = {
  fontSize: "11.5px",
  fontWeight: 600,
  color: "var(--sk-text-tertiary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.03em",
};

type FormInputProps = {
  id: string;
  label: string;
  required?: boolean;
  onAction: (patch: Record<string, string>) => void;
  className?: string;
} & InputProps;

export const FormInput = ({
  id,
  label,
  required = false,
  onAction,
  className,
  size = "compact",
  fontSize = "13px",
  backgroundColor = "var(--sk-surface)",
  ...restProps
}: FormInputProps) => (
  <Box className={className}>
    <FormControl
      label={label}
      required={required}
      overrides={{
        Label: { style: required ? REQUIRED_LABEL_STYLE : LABEL_STYLE },
        ControlContainer: { style: { marginBottom: 0 } },
      }}
    >
      <Input
        size={size}
        fontSize={fontSize}
        backgroundColor={backgroundColor}
        onChange={(e) => onAction({ [id]: e.target.value })}
        {...restProps}
      />
    </FormControl>
  </Box>
);
