import { Box } from "@/infra/baseweb/Box";
import { AuthCard } from "./components/AuthCard";
import { AuthLogo } from "./components/AuthLogo";
import { BrandProfileModal } from "./components/BrandProfileModal";
import { GoogleButton } from "./components/GoogleButton";
import { useSignupForm } from "./hooks/useSignupForm";

const Signup = () => {
  const { showProfileModal, openProfileModal, closeProfileModal } = useSignupForm();

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
          <GoogleButton label="Continue with Google" onClick={openProfileModal} />
        </AuthCard>

        <Box className="mt-[18px] text-center text-[13px] text-text-secondary">
          Already have an account?{" "}
          <Box as="a" href="/login" className="font-semibold text-accent-strong">
            Log in
          </Box>
        </Box>
      </Box>

      <BrandProfileModal
        isOpen={showProfileModal}
        onClose={closeProfileModal}
        onComplete={closeProfileModal}
      />
    </Box>
  );
};

export default Signup;
