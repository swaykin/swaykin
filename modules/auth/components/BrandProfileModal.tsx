import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { FormControl } from "@/infra/baseweb/FormControl";
import { Icon } from "@/infra/baseweb/Icon";
import { Input } from "@/infra/baseweb/Input";
import { Modal, ModalBody } from "@/infra/baseweb/Modal";
import { Textarea } from "@/infra/baseweb/Textarea";
import { useBrandProfileForm } from "../hooks/useBrandProfileForm";

const LABEL_CLASS_NAME = "text-[12.5px] font-semibold text-text";

type BrandProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export const BrandProfileModal = ({
  isOpen,
  onClose,
  onComplete,
}: BrandProfileModalProps) => {
  const {
    brandName,
    setBrandName,
    instagramHandle,
    handleInstagramHandleChange,
    industry,
    setIndustry,
    website,
    setWebsite,
    description,
    setDescription,
    brandVoice,
    setBrandVoice,
    targetAudience,
    setTargetAudience,
    canContinue,
    submit,
  } = useBrandProfileForm(onComplete);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      overrides={{ Dialog: { style: { width: "640px", maxWidth: "90vw" } } }}
    >
      <ModalBody>
        <Box className="mb-5 flex items-start gap-3">
          <Icon
            name="ph-brain"
            weight="fill"
            size={17}
            color="var(--sk-accent-strong)"
            backgroundColor="var(--sk-accent-subtle)"
          />
          <Box>
            <Box as="div" className="text-[14px] font-bold text-text">
              Brand Profile
            </Box>
            <Box as="div" className="mt-0.5 text-[12px] text-text-secondary">
              Tell us about your brand so SwayKin can draft outreach, score
              creators, and tailor recommendations.
            </Box>
          </Box>
        </Box>

        <Box className="mb-2 flex flex-col gap-3.5">
          <FormControl label="Brand name" required className={LABEL_CLASS_NAME}>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Nova Beauty Co."
              backgroundColor="var(--sk-surface-sunken)"
            />
          </FormControl>
          <FormControl
            label="Instagram handle"
            required
            className={LABEL_CLASS_NAME}
          >
            <Input
              value={instagramHandle}
              onChange={(e) => handleInstagramHandleChange(e.target.value)}
              placeholder="yourbrand"
              backgroundColor="var(--sk-surface-sunken)"
              startEnhancer={() => (
                <Box as="span" className="text-[12.5px] text-text-tertiary">
                  @
                </Box>
              )}
            />
          </FormControl>
        </Box>

        <Box className="my-[18px] flex items-center gap-2">
          <Box className="h-px flex-1 bg-border" />
          <Box as="span" className="text-[11px] text-text-tertiary">
            Help us tailor your experience
          </Box>
          <Box className="h-px flex-1 bg-border" />
        </Box>

        <Box className="mb-3.5 grid grid-cols-2 gap-3.5">
          <FormControl label="Industry" className={LABEL_CLASS_NAME}>
            <Input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Beauty, D2C, SaaS…"
            />
          </FormControl>
          <FormControl label="Website" className={LABEL_CLASS_NAME}>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="yourbrand.com"
              startEnhancer={() => (
                <Icon name="ph-globe" size={13} color="var(--sk-text-tertiary)" />
              )}
            />
          </FormControl>
        </Box>

        <Box className="mb-3.5">
          <FormControl label="What the brand does" className={LABEL_CLASS_NAME}>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A one-paragraph summary of your product, audience, and edge."
            />
          </FormControl>
        </Box>

        <Box className="mb-5 grid grid-cols-2 gap-3.5">
          <FormControl label="Brand voice" className={LABEL_CLASS_NAME}>
            <Input
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              placeholder="Warm, playful, authoritative…"
            />
          </FormControl>
          <FormControl label="Target audience" className={LABEL_CLASS_NAME}>
            <Input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. 25–34 women in Tier-1 Indian cities"
            />
          </FormControl>
        </Box>

        <Button
          kind="primary"
          width="100%"
          height="42px"
          disabled={!canContinue}
          onClick={submit}
        >
          Continue
        </Button>
      </ModalBody>
    </Modal>
  );
};
