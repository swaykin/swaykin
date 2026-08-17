import { Box } from "@/infra/baseweb/Box";
import { Icon } from "@/infra/baseweb/Icon";
import { AuthLogo } from "./components/AuthLogo";
import { useAuthCallback } from "./hooks/useAuthCallback";

const AuthCallback = () => {
  useAuthCallback();

  return (
    <Box className="flex items-center justify-center p-6">
      <Box className="flex w-full max-w-[400px] flex-col items-center text-center">
        <Box className="mb-7">
          <AuthLogo />
        </Box>

        <Icon
          name="ph-circle-notch"
          weight="bold"
          size={20}
          color="var(--sk-text-tertiary)"
          className="animate-spin"
        />
        <Box className="mt-3 text-[13px] text-text-secondary">
          Signing you in…
        </Box>
      </Box>
    </Box>
  );
};

export default AuthCallback;
