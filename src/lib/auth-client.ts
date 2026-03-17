import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: env.API_URL,
});

// Re-export the hooks and methods for easy import throughout the app
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
