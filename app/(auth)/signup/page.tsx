import { AuthGate } from "@/providers/AuthGate";
import { Signup } from "@/modules/auth";

const Page = () => {
  return (
    <AuthGate require="unauthenticated" redirectTo="/">
      <Signup />
    </AuthGate>
  );
};

export default Page;
