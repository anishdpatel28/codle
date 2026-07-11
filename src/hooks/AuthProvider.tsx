// Subscribes to the Supabase auth session and shares it through context.

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { migrateGuestScores } from '../data/queries';
import { AuthContext, type AuthContextValue, type AuthUser } from './authContext';

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email,
    name: (meta.full_name as string) ?? (meta.name as string) ?? undefined,
    avatarUrl: (meta.avatar_url as string) ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      const authed = toAuthUser(data.session?.user ?? null);
      prevUserId.current = authed?.id ?? null;
      setUser(authed);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authed = toAuthUser(session?.user ?? null);
      // On a guest -> signed-in transition, carry local progress into the account
      // before exposing the new user so downstream reads see the merged data.
      if (authed && prevUserId.current !== authed.id) {
        try {
          await migrateGuestScores(authed.id);
        } catch {
          // migration is best-effort; local scores remain intact on failure
        }
      }
      prevUserId.current = authed?.id ?? null;
      setUser(authed);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    // Open the OAuth flow in a new tab so the current game/session is preserved;
    // the session syncs back to this tab via Supabase's cross-tab auth events.
    const { data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, skipBrowserRedirect: true },
    });
    if (data?.url) window.open(data.url, '_blank', 'noopener,noreferrer');
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isConfigured: isSupabaseConfigured,
      signInWithGoogle,
      signOut,
    }),
    [user, loading, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
