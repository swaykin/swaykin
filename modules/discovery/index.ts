"use client";

import dynamic from "next/dynamic";

export const DiscoveryPage = dynamic(() => import("./DiscoveryPage"), {
  ssr: false,
});
