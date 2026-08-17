"use client";

import { useEffect, useState } from "react";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { Icon } from "@/infra/baseweb/Icon";

export type PageHeaderAction = {
  type: "primary" | "secondary" | "tertiary";
  label: string;
  onClick: () => void;
  icon?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
};

export const PageHeader = ({
  title,
  description,
  actions,
}: PageHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      className="sticky top-14 z-10 flex items-start justify-between gap-4 bg-page px-7 pb-3 mb-1 pt-3 transition-shadow duration-150"
      style={{ boxShadow: scrolled ? "var(--sk-shadow-bottom)" : "none" }}
    >
      <Box>
        <Box
          as="h1"
          className="m-0 mb-1 text-2xl font-bold tracking-tight text-text"
        >
          {title}
        </Box>
        {description && (
          <Box as="p" className="m-0 text-[13px] text-text-secondary">
            {description}
          </Box>
        )}
      </Box>
      {actions && actions.length > 0 && (
        <Box className="flex flex-shrink-0 items-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              kind={action.type}
              onClick={action.onClick}
              startEnhancer={
                action.icon ? (
                  <Icon name={action.icon} weight="bold" size={14} />
                ) : undefined
              }
            >
              {action.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};
