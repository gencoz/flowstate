"use client";

import { useCallback, useEffect, useState } from "react";
import type { Account } from "@/lib/auth/account";
import { toAccount } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/client";

type AuthState = "idle" | "loading" | "ready";

export function useAuthAccount(enabled: boolean) {
  const [account, setAccount] = useState<Account | null>(null);
  const [state, setState] = useState<AuthState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    const client = createClient();

    client.auth.getUser().then(({ data, error: userError }) => {
      if (!active) return;
      if (userError) setError(userError.message);
      setAccount(data.user ? toAccount(data.user) : null);
      setState("ready");
    });

    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAccount(session?.user ? toAccount(session.user) : null);
      setState("ready");
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [enabled]);

  const linkGuestEmail = useCallback(async (email: string) => {
    setError(null);
    const { error: updateError } = await createClient().auth.updateUser({ email });
    if (updateError) {
      setError(updateError.message);
      throw updateError;
    }
  }, []);

  const sendSignInLink = useCallback(async (email: string) => {
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signInError } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
    });
    if (signInError) {
      setError(signInError.message);
      throw signInError;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    const { error: signOutError } = await createClient().auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      throw signOutError;
    }
    window.location.reload();
  }, []);

  return {
    account: enabled ? account : null,
    state: enabled ? (state === "idle" ? "loading" : state) : "idle",
    error,
    linkGuestEmail,
    sendSignInLink,
    signOut,
    clearError: () => setError(null),
  };
}
