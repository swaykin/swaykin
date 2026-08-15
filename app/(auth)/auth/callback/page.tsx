import { Suspense } from "react";
import { AuthCallback } from "@/modules/auth";

const Page = () => {
  return (
    <Suspense fallback={null}>
      <AuthCallback />
    </Suspense>
  );
};

export default Page;
