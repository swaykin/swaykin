"use client";

import { useState } from "react";
import { useSnackbar } from "baseui/snackbar";
import { Button, SIZE } from "@/infra/baseweb/Button";
import { Drawer } from "@/infra/baseweb/Drawer";
import { Icon } from "@/infra/baseweb/Icon";
import { HelpDrawerContent } from "./HelpDrawerContent";

const CheckIcon = ({ size }: { size: number }) => (
  <Icon name="ph-check-circle" weight="fill" size={size} />
);

export const ContactUsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { enqueue } = useSnackbar();

  const handleSubmit = () => {
    setIsOpen(false);
    enqueue({
      message: "Your message has been sent — we'll get back to you soon.",
      startEnhancer: CheckIcon,
    });
  };

  return (
    <>
      <Button
        kind="secondary"
        startEnhancer={<Icon name="ph-headset" size={14} />}
        onClick={() => setIsOpen(true)}
        size={SIZE.compact}
        overrides={{
          BaseButton: {
            style: {
              paddingLeft: "12px",
              paddingRight: "12px",
              color: "var(--sk-text-secondary)",
              fontSize: "12.5px",
              fontWeight: 600,
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
        <HelpDrawerContent
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
        />
      </Drawer>
    </>
  );
};
