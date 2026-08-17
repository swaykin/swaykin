import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Box } from "@/infra/baseweb/Box";
import { AuthVisualPanel } from "@/modules/auth/components/AuthVisualPanel";
import { BaseWebProvider } from "@/providers/BaseWebProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "SwayKin",
  description:
    "Where brands find creators, outsmart competitors, and turn campaigns into results — powered by AI, built for speed.",
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <BaseWebProvider>
          <Box className="grid min-h-screen grid-cols-1 bg-page md:grid-cols-2">
            <AuthVisualPanel />
            {children}
          </Box>
        </BaseWebProvider>
      </body>
    </html>
  );
};

export default AuthLayout;
