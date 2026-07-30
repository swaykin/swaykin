"use client";

import dynamic from "next/dynamic";

export const AppSidebar = dynamic(() => import("./AppSidebar"), {
  ssr: false,
});
