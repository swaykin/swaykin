import { useSnackbar as useBaseSnackbar } from "baseui/snackbar";
import { Icon } from "./Icon";

// Matches the design's single toast style exactly (ph-check-circle, var(--green-500), on the
// dark inverse-themed pill). Error has no precedent in the design — the .dc.html files reuse
// this same success toast even for validation messages — so this is a genuine addition.
const CheckIcon = ({ size }: { size: number }) => (
  <Icon
    name="ph-check-circle"
    weight="fill"
    size={size}
    color="var(--green-500)"
  />
);

const ErrorIcon = ({ size }: { size: number }) => (
  <Icon name="ph-x-circle" weight="fill" size={size} color="var(--red-600)" />
);

export const useSnackbar = () => {
  const { enqueue } = useBaseSnackbar();

  return {
    onSuccess: (message: string) =>
      enqueue({ message, startEnhancer: CheckIcon }),
    onError: (message: string) =>
      enqueue({ message, startEnhancer: ErrorIcon }),
  };
};
