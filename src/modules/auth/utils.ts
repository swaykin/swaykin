export type AuthIntent = "login" | "signup";

export const startGoogleSignIn = (intent: AuthIntent) => {
  const redirectUri = `${window.location.origin}/auth/callback?intent=${intent}`;
  const url = new URL(
    `${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL}/googleSignInStart`,
  );
  url.searchParams.set("redirect_uri", redirectUri);
  window.location.href = url.toString();
};
