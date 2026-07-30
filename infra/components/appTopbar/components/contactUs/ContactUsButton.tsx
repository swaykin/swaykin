import { useState } from "react";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import { Button } from "@/infra/baseweb/Button";
import { Drawer } from "@/infra/baseweb/Drawer";
import { Icon } from "@/infra/baseweb/Icon";
import { SupportDrawerContent } from "./components/SupportDrawerContent";

export const ContactUsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onSuccess } = useSnackbar();

  const handleSubmit = () => {
    setIsOpen(false);
    onSuccess("Your message has been sent — we'll get back to you soon.");
  };

  return (
    <>
      <Button
        kind="secondary"
        startEnhancer={<Icon name="ph-headset" size={14} />}
        onClick={() => setIsOpen(true)}
        height="32px"
        weight="semiBold"
        fontSize="12.5px"
        textColor="var(--sk-text-secondary)"
        overrides={{
          BaseButton: {
            style: {
              paddingLeft: "12px",
              paddingRight: "12px",
              whiteSpace: "nowrap",
            },
          },
        }}
      >
        Ask us
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchor="right"
        size="540px"
        overrides={{
          Close: { component: () => null },
        }}
      >
        <SupportDrawerContent
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </>
  );
};
