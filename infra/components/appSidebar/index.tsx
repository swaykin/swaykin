"use client";

import dynamic from "next/dynamic";
import { SidebarTombstone } from "./SidebarTombstone";

export const AppSidebar = dynamic(() => import("./AppSidebar"), {
  ssr: false,
  loading: () => <SidebarTombstone />,
});
