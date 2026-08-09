import { Box } from "@/infra/baseweb/Box";
import { AuthCard } from "./components/AuthCard";
import { AuthLogo } from "./components/AuthLogo";
import { GoogleButton } from "./components/GoogleButton";
import { useAuthErrorParam } from "./hooks/useAuthErrorParam";
import { startGoogleSignIn } from "./utils";

const Login = () => {
  const error = useAuthErrorParam("/login");

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
          {error && (
            <Box className="mb-3.5 rounded-lg bg-[var(--red-50)] px-2.5 py-2 text-[12px] text-[var(--red-600)]">
              {error}
            </Box>
          )}

          <GoogleButton
            label="Continue with Google"
            onClick={() => startGoogleSignIn("login")}
          />
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
