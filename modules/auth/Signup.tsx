import { Box } from "@/infra/baseweb/Box";
import { AuthCard } from "./components/AuthCard";
import { AuthLogo } from "./components/AuthLogo";
import { GoogleButton } from "./components/GoogleButton";
import { useAuthErrorParam } from "./hooks/useAuthErrorParam";
import { startGoogleSignIn } from "./utils";

const Signup = () => {
  const error = useAuthErrorParam("/signup");

  return (
    <Box className="flex items-center justify-center p-6">
      <Box className="w-full max-w-[400px]">
        <Box className="mb-7">
          <AuthLogo />
        </Box>

        <AuthCard
          heading="Create your account"
          subtitle="Start discovering and managing creators"
        >
          {error && (
            <Box className="mb-3.5 rounded-lg bg-[var(--red-50)] px-2.5 py-2 text-[12px] text-[var(--red-600)]">
              {error}
            </Box>
          )}

          <GoogleButton
            label="Continue with Google"
            onClick={() => startGoogleSignIn("signup")}
          />
        </AuthCard>

        <Box className="mt-[18px] text-center text-[13px] text-text-secondary">
          Already have an account?{" "}
          <Box as="a" href="/login" className="font-semibold text-accent-strong">
            Log in
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
