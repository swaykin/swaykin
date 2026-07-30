"use client";

import dynamic from "next/dynamic";

export const AppTopBar = dynamic(() => import("./AppTopBar"), {
  ssr: false,
});
