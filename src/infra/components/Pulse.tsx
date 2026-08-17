import { Box } from "@/infra/baseweb/Box";

export const Pulse = ({ className }: { className: string }) => (
  <Box className={`animate-pulse rounded-md bg-sunken ${className}`} />
);
