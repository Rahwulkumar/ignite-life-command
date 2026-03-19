import { useCallback } from "react";
import { useSession, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from "@/lib/auth-client";
import { env } from "@/lib/env";

type AuthActionResult = {
  error: { message: string } | null;
};

async function normalizeAuthError(error: unknown): Promise<{ message: string }> {
  if (error instanceof Error) {
    if (error.message) {
      return { message: error.message };
    }

    try {
      const response = await fetch(`${env.API_URL}/health/db`, {
        credentials: "include",
      });

      if (!response.ok) {
        return {
          message: "Authentication is unavailable because the database connection is down.",
        };
      }
    } catch {
      // Fall through to the default API unavailable message below.
    }

    return {
      message: `Authentication failed. Make sure the API server is running at ${env.API_URL}.`,
    };
  }

  if (typeof error === "string" && error.trim()) {
    return { message: error };
  }

  return {
    message: `Authentication failed. Make sure the API server is running at ${env.API_URL}.`,
  };
}

export function useAuth() {
  const { data: sessionData, isPending: loading } = useSession();

  const user = sessionData?.user ?? null;

  const signIn = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
    try {
      const result = await authSignIn.email({ email, password });
      return { error: result.error ?? null };
    } catch (error) {
      return { error: await normalizeAuthError(error) };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
    try {
      const result = await authSignUp.email({
        email,
        password,
        name: email.split("@")[0], // use email prefix as default name
      });
      return { error: result.error ?? null };
    } catch (error) {
      return { error: await normalizeAuthError(error) };
    }
  }, []);

  const signOut = useCallback(async (): Promise<AuthActionResult> => {
    try {
      await authSignOut();
      return { error: null };
    } catch (error) {
      return { error: await normalizeAuthError(error) };
    }
  }, []);

  return {
    session: sessionData,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!sessionData,
  };
}
