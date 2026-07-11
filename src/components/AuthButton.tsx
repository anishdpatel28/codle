// Sign-in surfaced as a mono command. OAuth only (Google) via Supabase's hosted
// flow — there is deliberately no credential form here.

import { useAuth } from '../hooks/authContext';

export function AuthButton() {
  const { user, loading, isConfigured, signInWithGoogle, signOut } = useAuth();

  if (!isConfigured) {
    return (
      <span className="font-sans text-meta uppercase text-muted">auth offline · local mode</span>
    );
  }

  if (loading) {
    return <span className="font-mono text-mono text-muted">…</span>;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={signInWithGoogle}
        className="font-mono text-mono text-accent transition-shadow hover:glow-accent"
      >
        &gt; sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.avatarUrl && (
        <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-[2px]" />
      )}
      <span className="hidden font-mono text-mono text-muted sm:inline">
        {user.name ?? user.email}
      </span>
      <button
        type="button"
        onClick={signOut}
        className="font-mono text-mono text-muted transition-colors hover:text-primary"
      >
        &gt; sign out
      </button>
    </div>
  );
}
