import { formatCompactNumber } from "@/lib/format";
import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { IconButton } from "@/infra/baseweb/IconButton";
import { InstagramLink } from "@/infra/components/InstagramLink";
import type { Influencer } from "../types";

type HeaderCardProps = {
  influencer: Influencer;
  avatarColor: string;
};

type ContactRowProps = {
  icon: string;
  iconColor: string;
  value: string;
};

const ContactRow = ({ icon, iconColor, value }: ContactRowProps) => (
  <Box className="flex items-center gap-1.5 text-[12.5px] text-text-secondary">
    <Icon name={icon} weight="fill" size={13} color={iconColor} />
    {value}
    <IconButton
      kind="tertiary"
      type="button"
      aria-label={`Copy ${value}`}
      onClick={() => navigator.clipboard.writeText(value)}
      height="auto"
      width="auto"
    >
      <Icon name="ph-copy" size={12} color="var(--sk-text-tertiary)" />
    </IconButton>
  </Box>
);

export const HeaderCard = ({ influencer, avatarColor }: HeaderCardProps) => {
  const hasContact =
    influencer.email || influencer.phone || influencer.location;

  return (
    <Box className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Avatar
        name={influencer.name}
        size="56px"
        fontSize="18px"
        fillColor={avatarColor}
      />
      <Box className="min-w-0 flex-1">
        <Box className="flex flex-wrap items-center gap-1.5">
          <Box as="span" className="text-base font-bold text-text">
            {influencer.name}
          </Box>
          {influencer.verified && (
            <Icon
              name="ph-seal-check"
              weight="fill"
              size={14}
              color="var(--sk-accent-strong)"
            />
          )}
          <Box as="span" className="text-[12.5px] text-text-tertiary">
            @{influencer.handle}
          </Box>
          <InstagramLink
            handle={influencer.handle}
            label="View Instagram"
            className="ml-auto"
          />
        </Box>
        <Box
          as="p"
          className="my-1.5 max-w-[640px] text-[12.5px] text-text-secondary"
        >
          {influencer.bio}
        </Box>
        <Box className="mb-2 flex flex-wrap items-center gap-3.5">
          <Box as="span" className="text-[12.5px] text-text">
            <Box as="span" className="font-bold">
              {formatCompactNumber(influencer.followersNum)}
            </Box>{" "}
            <Box as="span" className="text-text-tertiary">
              followers
            </Box>
          </Box>
          <Box as="span" className="text-[12.5px] text-text">
            <Box
              as="span"
              className="font-bold"
              style={{ color: "var(--green-700)" }}
            >
              {influencer.erNum.toFixed(1)}%
            </Box>{" "}
            <Box as="span" className="text-text-tertiary">
              engagement
            </Box>
          </Box>
          <Box as="span" className="text-[12.5px] text-text-tertiary">
            {formatCompactNumber(influencer.followingNum)} following ·{" "}
            {formatCompactNumber(influencer.totalPostsNum)} posts ·{" "}
            {influencer.postsWeekNum} posts/wk
          </Box>
        </Box>
        <Box className="flex flex-wrap items-center gap-3.5">
          {influencer.email && (
            <ContactRow
              icon="ph-envelope-simple"
              iconColor="var(--teal-600)"
              value={influencer.email}
            />
          )}
          {influencer.phone && (
            <ContactRow
              icon="ph-phone"
              iconColor="var(--blue-600)"
              value={influencer.phone}
            />
          )}
          {influencer.location && (
            <ContactRow
              icon="ph-map-pin"
              iconColor="var(--orange-600)"
              value={`${influencer.location}, India`}
            />
          )}
          {!hasContact && (
            <Box as="span" className="text-xs text-text-tertiary">
              No public contact details on this profile.
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
