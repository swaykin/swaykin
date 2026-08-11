import { Avatar } from "@/infra/baseweb/Avatar";
import { Box } from "@/infra/baseweb/Box";
import { Button } from "@/infra/baseweb/Button";
import { FormInput } from "@/infra/components/FormInput";
import { useProfileForm } from "../../hooks/useProfileForm";

export const ProfileInfoCard = () => {
  const { user, onAction, save } = useProfileForm();

  return (
    <Box className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <Box className="mb-5 flex items-center gap-3.5">
        <Avatar name={user.name} size="72px" fontSize="18px" />
        <Button kind="secondary" height="32px">
          Change photo
        </Button>
      </Box>

      <FormInput
        className="flex-1"
        id="name"
        label="Full name"
        value={user.name}
        onAction={onAction}
      />
      <Box className="mb-5 mt-2 flex gap-3.5">
        <FormInput
          className="flex-1"
          id="email"
          label="Email"
          value={user.email}
          onAction={onAction}
          backgroundColor="var(--sk-surface-sunken)"
          disabled
        />
        <FormInput
          className="flex-1"
          id="phone"
          label="Phone"
          value={user.phone}
          onAction={onAction}
        />
      </Box>

      <Button kind="primary" height="36px" onClick={save}>
        Save changes
      </Button>
    </Box>
  );
};
