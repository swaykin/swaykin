import type { ReactNode } from "react";
import { Box } from "@/infra/baseweb/Box";

type AuthCardProps = {
  heading: string;
  subtitle: string;
  children: ReactNode;
};

export const AuthCard = ({ heading, subtitle, children }: AuthCardProps) => (
  <Box className="rounded-2xl border border-border bg-surface p-7 pb-6 shadow-card">
    <Box
      as="h1"
      className="mb-1 text-center text-[20px] font-bold tracking-[-0.01em] text-text"
    >
      {heading}
    </Box>
    <Box
      as="p"
      className="mb-[22px] text-center text-[13px] text-text-secondary"
    >
      {subtitle}
    </Box>
    {children}
  </Box>
);
