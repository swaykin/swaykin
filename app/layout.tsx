import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BaseWebProvider } from "@/providers/BaseWebProvider";
import { WorkspaceProvider } from "@/providers/WorkspaceProvider";
import { Box } from "@/infra/components/Box";
import { AppSidebar } from "@/modules/sidebar/AppSidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwayKin",
  description: "AI-native influencer marketing platform for D2C brands.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WorkspaceProvider>
          <BaseWebProvider>
            <Box className="flex min-h-screen bg-page">
              <AppSidebar />
              <Box as="main" className="min-w-0 flex-1">
                {children}
              </Box>
            </Box>
          </BaseWebProvider>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
