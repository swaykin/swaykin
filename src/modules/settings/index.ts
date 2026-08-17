"use client";

import dynamic from "next/dynamic";

export const Settings = dynamic(() => import("./Settings"), { ssr: false });
