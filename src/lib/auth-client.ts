import { createAuthClient } from "better-auth/react";

const apiUrl = import.meta.env.VITE_API_URL as string;

export const authClient = createAuthClient({
  baseURL: apiUrl,
});

// Re-export the hooks and methods for easy import throughout the app
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
