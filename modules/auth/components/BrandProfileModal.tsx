import { Button } from "@/infra/baseweb/Button";
import { Modal, ModalBody, ModalFooter } from "@/infra/baseweb/Modal";
import { BrandProfileFields } from "@/infra/components/BrandProfileFields";
import { useBrandProfileForm } from "../hooks/useBrandProfileForm";

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
  const { details, onAction, canContinue, submit } =
    useBrandProfileForm(onComplete);

  return (
    <Modal
      isOpen={isOpen}
      closeable={false}
      size="auto"
      overrides={{
        Dialog: {
          style: {
            width: "640px",
            maxWidth: "90vw",
          },
        },
      }}
    >
      <ModalBody className="px-1 flex flex-col gap-2">
        <BrandProfileFields
          subtitle="Tell us about your brand so SwayKin can draft outreach, score creators, and tailor recommendations."
          details={details}
          onAction={onAction}
        />
      </ModalBody>
      <ModalFooter className="flex gap-2.5 mb-4 justify-end">
        <Button
          kind="secondary"
          height="42px"
          width="110px"
          onClick={onClose}
          textColor="var(--sk-text-secondary)"
        >
          Save for later
        </Button>
        <Button
          kind="primary"
          height="42px"
          width="110px"
          disabled={!canContinue}
          onClick={submit}
        >
          Continue
        </Button>
      </ModalFooter>
    </Modal>
  );
};
