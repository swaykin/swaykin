"use client";

import dynamic from "next/dynamic";

export const Discovery = dynamic(() => import("./Discovery"), {
  ssr: false,
});
