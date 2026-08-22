import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";

type ContentThemesCardProps = {
  themes: string[];
};

export const ContentThemesCard = ({ themes }: ContentThemesCardProps) => (
  <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
    <Box className="mb-3.5 flex items-center gap-2">
      <Icon
        name="ph-shapes"
        weight="fill"
        size={16}
        color="var(--sk-accent-strong)"
      />
      <Box as="span" className="text-[14.5px] font-bold text-text">
        Content themes
      </Box>
    </Box>
    <Box className="flex flex-wrap gap-2">
      {themes.map((theme) => (
        <Box
          key={theme}
          as="span"
          className="rounded-lg bg-accent-subtle px-3 py-1.5 text-[12.5px] font-semibold text-accent-strong"
        >
          {theme}
        </Box>
      ))}
    </Box>
  </Box>
);
