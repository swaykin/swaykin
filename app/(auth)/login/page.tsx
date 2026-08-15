import { AuthGate } from "@/providers/AuthGate";
import { Login } from "@/modules/auth";

const Page = () => {
  return (
    <AuthGate require="unauthenticated" redirectTo="/">
      <Login />
    </AuthGate>
  );
};

export default Page;
