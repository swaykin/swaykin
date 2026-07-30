"use client";

import dynamic from "next/dynamic";

export const Competitors = dynamic(() => import("./Competitors"), {
  ssr: false,
});
