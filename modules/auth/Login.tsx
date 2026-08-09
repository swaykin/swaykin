import { Box } from "@/infra/baseweb/Box";
import { AuthCard } from "./components/AuthCard";
import { AuthLogo } from "./components/AuthLogo";
import { GoogleButton } from "./components/GoogleButton";

const Login = () => {
  return (
    <Box className="flex items-center justify-center p-6">
      <Box className="w-full max-w-[400px]">
        <Box className="mb-7">
          <AuthLogo />
        </Box>

        <AuthCard
          heading="Welcome back"
          subtitle="Log in to manage your creators and campaigns"
        >
          <GoogleButton label="Continue with Google" />
        </AuthCard>

        <Box className="mt-[18px] text-center text-[13px] text-text-secondary">
          Don&apos;t have an account?{" "}
          <Box
            as="a"
            href="/signup"
            className="font-semibold text-accent-strong"
          >
            Sign up
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
