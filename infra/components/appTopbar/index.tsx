"use client";

import dynamic from "next/dynamic";
import { TopbarTombstone } from "./TopbarTombstone";

export const AppTopBar = dynamic(() => import("./AppTopBar"), {
  ssr: false,
  loading: () => <TopbarTombstone />,
});
