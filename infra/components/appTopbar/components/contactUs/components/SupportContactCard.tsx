import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";

const SUPPORT = {
  name: "Sahil Jain",
  role: "Co-founder and CEO",
  email: "support@swaykin.com",
};

export const SupportContactCard = () => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT.email);
  };

  return (
    <Box className="flex items-center justify-between gap-3 rounded-xl bg-sunken p-3">
      <Box className="flex items-center gap-2.5">
        <Avatar
          name={SUPPORT.name}
          size="36px"
          fillColor="var(--sk-accent-strong)"
          fontSize="14px"
        />
        <Box>
          <Box className="text-[14px] font-semibold text-text">
            {SUPPORT.name}
          </Box>
          <Box className="text-[13px] text-text-tertiary">{SUPPORT.role}</Box>
        </Box>
      </Box>
      <Box className="flex items-center gap-1.5">
        <Box className="text-[14px] text-text-secondary">{SUPPORT.email}</Box>
        <IconButton
          kind="tertiary"
          type="button"
          aria-label="Copy email"
          onClick={handleCopyEmail}
          height="24px"
          width="24px"
        >
          <Icon name="ph-copy" size={16} color="var(--sk-text-tertiary)" />
        </IconButton>
      </Box>
    </Box>
  );
};
