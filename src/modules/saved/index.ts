"use client";

import dynamic from "next/dynamic";

export const Saved = dynamic(() => import("./Saved"), {
  ssr: false,
});
