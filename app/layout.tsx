import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BaseWebProvider } from "@/providers/BaseWebProvider";
import { WorkspaceProvider } from "@/providers/WorkspaceProvider";
import { UserProvider } from "@/providers/UserProvider";
import { Box } from "@/infra/baseweb/Box";
import { AppSidebar } from "@/infra/components/appSidebar";
import { AppTopBar } from "@/infra/components/appTopbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwayKin",
  description: "AI-native influencer marketing platform for D2C brands.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <WorkspaceProvider>
          <UserProvider>
            <BaseWebProvider>
              <Box className="flex min-h-screen bg-page">
                <AppSidebar />
                <Box className="flex min-w-0 flex-1 flex-col">
                  <AppTopBar />
                  <Box as="main" className="min-w-0 flex-1">
                    {children}
                  </Box>
                </Box>
              </Box>
            </BaseWebProvider>
          </UserProvider>
        </WorkspaceProvider>
      </body>
    </html>
  );
};

export default RootLayout;
