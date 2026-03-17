import { useCallback } from "react";
import { useSession, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from "@/lib/auth-client";
import { env } from "@/lib/env";

type AuthActionResult = {
  error: { message: string } | null;
};

function normalizeAuthError(error: unknown): { message: string } {
  if (error instanceof Error) {
    return {
      message:
        error.message ||
        `Authentication failed. Make sure the API server is running at ${env.API_URL}.`,
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
      return { error: normalizeAuthError(error) };
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
      return { error: normalizeAuthError(error) };
    }
  }, []);

  const signOut = useCallback(async (): Promise<AuthActionResult> => {
    try {
      await authSignOut();
      return { error: null };
    } catch (error) {
      return { error: normalizeAuthError(error) };
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
