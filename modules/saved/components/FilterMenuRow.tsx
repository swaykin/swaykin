import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";

type FilterMenuRowProps = {
  label: string;
  count?: number;
  active?: boolean;
  bold?: boolean;
  onClick: () => void;
  onDelete?: () => void;
};

export const FilterMenuRow = ({
  label,
  count,
  active,
  bold,
  onClick,
  onDelete,
}: FilterMenuRowProps) => (
  // A real <button> can't contain the delete IconButton's own <button> (invalid HTML,
  // breaks hydration), so this row is a div acting as the click target instead.
  <Box
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
    className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-[7px] px-2.5 py-1.5 hover:bg-sunken"
    style={{
      backgroundColor: active ? "var(--sk-surface-sunken)" : undefined,
    }}
  >
    <Box
      as="span"
      className={`text-[12.5px] text-text ${bold || active ? "font-semibold" : "font-medium"}`}
    >
      {label}
    </Box>
    {(count !== undefined || onDelete) && (
      <Box className="flex items-center gap-1.5">
        {count !== undefined && (
          <Box as="span" className="text-[11px] text-text-tertiary">
            {count}
          </Box>
        )}
        {onDelete && (
          <IconButton
            kind="tertiary"
            type="button"
            aria-label={`Delete ${label}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            height="18px"
            width="18px"
          >
            <Icon name="ph-trash" size={13} color="var(--sk-text-tertiary)" />
          </IconButton>
        )}
      </Box>
    )}
  </Box>
);
