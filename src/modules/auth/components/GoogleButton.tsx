import { Button } from "@/infra/baseweb/Button";

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 15.9 3 9 7.9 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 45c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6c-2 1.4-4.7 2.2-7.7 2.2-5.2 0-9.7-3.5-11.3-8.2l-6.6 5.1C9 40.1 15.9 45 24 45z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.9 36 45 30.8 45 24c0-1.2-.1-2.4-.4-3.5z"
    />
  </svg>
);

type GoogleButtonProps = {
  label: string;
  onClick?: () => void;
};

export const GoogleButton = ({ label, onClick }: GoogleButtonProps) => (
  <Button
    kind="secondary"
    width="100%"
    height="42px"
    fontSize="13.5px"
    startEnhancer={<GoogleIcon />}
    onClick={onClick}
  >
    {label}
  </Button>
);
