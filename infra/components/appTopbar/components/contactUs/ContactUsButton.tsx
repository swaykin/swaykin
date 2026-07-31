import { useCallback, useState } from "react";
import { useSnackbar } from "@/infra/baseweb/useSnackbar";
import { Button } from "@/infra/baseweb/Button";
import { Drawer } from "@/infra/baseweb/Drawer";
import { Icon } from "@/infra/baseweb/Icon";
import { SupportDrawerContent } from "./components/SupportDrawerContent";

const DRAWER_OVERRIDES = {
  Close: { component: () => null },
};

export const ContactUsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onSuccess } = useSnackbar();

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const handleSubmit = useCallback(() => {
    setIsOpen(false);
    onSuccess("Your message has been sent — we'll get back to you soon.");
  }, [onSuccess]);

  return (
    <>
      <Button
        kind="secondary"
        startEnhancer={<Icon name="ph-headset" size={14} />}
        onClick={openDrawer}
        height="32px"
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
        onClose={closeDrawer}
        anchor="right"
        size="540px"
        overrides={DRAWER_OVERRIDES}
      >
        <SupportDrawerContent onClose={closeDrawer} onSubmit={handleSubmit} />
      </Drawer>
    </>
  );
};
