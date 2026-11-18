// Client-only: Supabase Auth for the admin panel (replaces firebase-auth.ts).
import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  email: string | null;
  displayName: string | null;
};

function mapUser(su: SupabaseUser): User {
  return {
    email: su.email ?? null,
    displayName: su.user_metadata?.full_name ?? su.user_metadata?.name ?? su.email ?? null,
  };
}

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/admin` },
  });
  if (error) throw error;
}

export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Subscribes to auth state changes. Returns an unsubscribe function. */
export function watchAuth(callback: (user: User | null) => void): () => void {
  // Check current session immediately
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user ? mapUser(session.user) : null);
  });

  // Listen for future changes (sign-in, sign-out, token refresh)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? mapUser(session.user) : null);
  });

  return () => subscription.unsubscribe();
}
