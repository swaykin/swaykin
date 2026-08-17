import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";

type TagTone = "neutral" | "accent" | "teal";
type TagSize = "sm" | "md";

type TagProps = {
  label: string;
  icon?: string;
  tone?: TagTone;
  size?: TagSize;
  closable?: boolean;
  onClose?: () => void;
};

const TONE_COLORS: Record<TagTone, { color: string; background: string }> = {
  neutral: {
    color: "var(--sk-text-secondary)",
    background: "var(--sk-surface-sunken)",
  },
  accent: {
    color: "var(--sk-accent-strong)",
    background: "var(--sk-accent-subtle)",
  },
  teal: { color: "var(--teal-700)", background: "var(--teal-50)" },
};

const SIZE_CLASSES: Record<TagSize, string> = {
  sm: "gap-1 rounded-[6px] px-[7px] py-0.5 text-[10.5px]",
  md: "h-6 gap-1 rounded-md py-0 pl-2 pr-1 text-[11px]",
};

export const Tag = ({
  label,
  icon,
  tone = "neutral",
  size = "sm",
  closable = false,
  onClose,
}: TagProps) => {
  const toneColors = TONE_COLORS[tone];

  return (
    <Box
      as="span"
      className={`inline-flex items-center font-bold ${SIZE_CLASSES[size]}`}
      style={toneColors}
    >
      {icon && (
        <Icon
          name={icon}
          weight="fill"
          size={size === "md" ? 11 : 10}
          color={toneColors.color}
        />
      )}
      {label}
      {closable && (
        <IconButton
          kind="tertiary"
          type="button"
          aria-label={`Remove ${label}`}
          onClick={onClose}
          height="16px"
          width="16px"
        >
          <Icon name="ph-x" weight="bold" size={8} color={toneColors.color} />
        </IconButton>
      )}
    </Box>
  );
};
