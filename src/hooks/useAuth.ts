import { useCallback } from "react";
import { useSession, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from "@/lib/auth-client";

export function useAuth() {
  const { data: sessionData, isPending: loading } = useSession();

  const user = sessionData?.user ?? null;

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authSignIn.email({ email, password });
    return { error: result.error ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const result = await authSignUp.email({
      email,
      password,
      name: email.split("@")[0], // use email prefix as default name
    });
    return { error: result.error ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
    return { error: null };
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
