"use client";

import dynamic from "next/dynamic";

export const Login = dynamic(() => import("./Login"), { ssr: false });
export const Signup = dynamic(() => import("./Signup"), { ssr: false });
