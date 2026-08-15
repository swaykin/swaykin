import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { AuthGate } from "@/providers/AuthGate";
import { BaseWebProvider } from "@/providers/BaseWebProvider";
import { OnboardingGate } from "@/providers/OnboardingGate";
import { AppDataProvider } from "@/providers/AppDataProvider";
import { Box } from "@/infra/baseweb/Box";
import { AppSidebar } from "@/infra/components/appSidebar";
import { AppTopBar } from "@/infra/components/appTopbar";
import { AppTombstone } from "@/infra/components/AppTombstone";
import "../globals.css";

export const metadata: Metadata = {
  title: "SwayKin",
  description:
    "Where brands find creators, outsmart competitors, and turn campaigns into results — powered by AI, built for speed.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <AuthGate
          require="authenticated"
          redirectTo="/login"
          fallback={<AppTombstone />}
        >
          <BaseWebProvider>
            <AppDataProvider>
              <Suspense fallback={null}>
                <OnboardingGate>
                  <Box className="flex min-h-screen bg-page">
                    <AppSidebar />
                    <Box className="flex min-w-0 flex-1 flex-col">
                      <AppTopBar />
                      <Box as="main" className="min-w-0 flex-1">
                        {children}
                      </Box>
                    </Box>
                  </Box>
                </OnboardingGate>
              </Suspense>
            </AppDataProvider>
          </BaseWebProvider>
        </AuthGate>
      </body>
    </html>
  );
};

export default RootLayout;
