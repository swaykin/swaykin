import { mergeOverrides } from "baseui";
import {
  FormControl as BaseFormControl,
  type FormControlProps,
} from "baseui/form-control";

type FormControlOwnProps = FormControlProps & {
  required?: boolean;
  className?: string;
};

export const FormControl = ({
  required,
  label,
  className,
  overrides,
  ...props
}: FormControlOwnProps) => (
  <BaseFormControl
    label={
      required ? (
        <>
          {label} <span style={{ color: "var(--red-600)" }}>*</span>
        </>
      ) : (
        label
      )
    }
    overrides={mergeOverrides(
      className ? { Label: { props: { className } } } : undefined,
      overrides,
    )}
    {...props}
  />
);
