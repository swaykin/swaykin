import { Box } from "@/infra/baseweb/Box";

type AuthLogoProps = {
  size?: number;
  textSize?: string;
  light?: boolean;
};

export const AuthLogo = ({
  size = 26,
  textSize = "18px",
  light = false,
}: AuthLogoProps) => (
  <Box className="flex items-center justify-center gap-2.5">
    <Box
      as="img"
      src="/logo.svg"
      alt=""
      style={{ width: size, height: size }}
      className="flex-shrink-0"
    />
    <Box
      as="span"
      className="font-bold tracking-[-0.01em]"
      style={{ fontSize: textSize, color: light ? "#fff" : "var(--sk-text)" }}
    >
      SwayKin
    </Box>
  </Box>
);
