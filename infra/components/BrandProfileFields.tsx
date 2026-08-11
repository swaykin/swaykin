import { Box } from "@/infra/baseweb/Box";
import { FormControl } from "@/infra/baseweb/FormControl";
import { Icon } from "@/infra/baseweb/Icon";
import { Textarea } from "@/infra/baseweb/Textarea";
import type { BrandProfile } from "@/modules/auth/types";
import { FormInput } from "./FormInput";

const LABEL_STYLE = { fontSize: "12.5px", fontWeight: 600, color: "var(--sk-text)" };

type BrandProfileFieldsProps = {
  subtitle: string;
  brandProfile: BrandProfile;
  onAction: (patch: Partial<BrandProfile>) => void;
};

/** The Brand Profile form body — shared by the post-signup onboarding modal and the Workspace
 * settings tab, since both edit the same underlying data with the same field set. */
export const BrandProfileFields = ({
  subtitle,
  brandProfile,
  onAction,
}: BrandProfileFieldsProps) => (
  <>
    <Box className="flex gap-2 pt-3">
      <Box className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-accent-subtle">
        <Icon
          name="ph-brain"
          weight="fill"
          size={17}
          color="var(--sk-accent-strong)"
        />
      </Box>
      <Box>
        <Box className="text-[14px] font-bold text-text">Brand Profile</Box>
        <Box className="text-[12.5px] text-text-secondary">{subtitle}</Box>
      </Box>
    </Box>

    <FormInput
      id="brandName"
      label="Brand name"
      required
      value={brandProfile.brandName}
      onAction={onAction}
      placeholder="e.g. Nova Beauty Co."
      backgroundColor="var(--sk-surface-sunken)"
    />
    <FormInput
      id="instagramHandle"
      label="Instagram handle"
      required
      type="userName"
      value={brandProfile.instagramHandle}
      onAction={onAction}
      placeholder="yourbrand"
      backgroundColor="var(--sk-surface-sunken)"
    />

    <Box className="flex items-center gap-2 pt-3">
      <Box className="h-px flex-1 bg-border" />
      <Box as="span" className="text-[11px] text-text-tertiary">
        Help us tailor your experience
      </Box>
      <Box className="h-px flex-1 bg-border" />
    </Box>

    <Box className="flex gap-3.5">
      <FormInput
        className="flex-1"
        id="industry"
        label="Industry"
        value={brandProfile.industry}
        onAction={onAction}
        placeholder="Beauty, D2C, SaaS…"
      />
      <FormInput
        className="flex-1"
        id="website"
        label="Website"
        value={brandProfile.website}
        onAction={onAction}
        placeholder="yourbrand.com"
        startEnhancer={() => (
          <Icon name="ph-globe" size={13} color="var(--sk-text-tertiary)" />
        )}
      />
    </Box>

    <Box>
      <FormControl
        label="What the brand does"
        overrides={{
          Label: { style: LABEL_STYLE },
          ControlContainer: { style: { marginBottom: 0 } },
        }}
      >
        <Textarea
          value={brandProfile.description}
          onChange={(e) => onAction({ description: e.target.value })}
          placeholder="A one-paragraph summary of your product, audience, and edge."
          overrides={{ Input: { style: { minHeight: "72px" } } }}
          size="compact"
        />
      </FormControl>
    </Box>

    <Box className="flex gap-3.5">
      <FormInput
        className="flex-1"
        id="brandVoice"
        label="Brand voice"
        value={brandProfile.brandVoice}
        onAction={onAction}
        placeholder="Warm, playful, authoritative…"
      />
      <FormInput
        className="flex-1"
        id="targetAudience"
        label="Target audience"
        value={brandProfile.targetAudience}
        onAction={onAction}
        placeholder="e.g. 25–34 women in Tier-1 Indian cities"
      />
    </Box>
  </>
);
