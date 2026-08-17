import { auth } from "@/lib/firebase";

const functionsBaseUrl = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL as string;

const fetchWithAuth = async (
  path: string,
  forceRefresh: boolean,
  method: "GET" | "POST",
  body?: unknown,
) => {
  const idToken = await auth.currentUser?.getIdToken(forceRefresh);
  if (!idToken) throw new Error("User is not authenticated");

  return fetch(`${functionsBaseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${idToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

/** Retries once with a force-refreshed ID token on a 401, per the backend's auth contract. */
const request = async <T>(
  path: string,
  method: "GET" | "POST",
  body?: unknown,
): Promise<T> => {
  let res = await fetchWithAuth(path, false, method, body);
  if (res.status === 401) {
    res = await fetchWithAuth(path, true, method, body);
  }

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? `${path} failed with status (${res.status})`);
  }

  return res.json();
};

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown) => request<T>(path, "POST", body),
  request,
};
