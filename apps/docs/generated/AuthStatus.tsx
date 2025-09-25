import React from 'react';
import { useAuth } from '../../../lib/auth/auth-context';
import { supabase } from '../../../lib/integrations/supabase';

export function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-2 text-sm text-slateGrey">Authenticating...</div>;
  }

  if (!user) {
    return (
      <div className="p-2 flex items-center gap-4">
        <span className="text-sm text-slateGrey">Not signed in</span>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
          className="px-3 py-1 text-sm bg-slateGrey/20 text-white rounded hover:bg-slateGrey/40 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 flex items-center gap-4">
      <span className="text-sm text-slateGrey">Signed in as {user.email || 'User'}</span>
      <button onClick={() => supabase.auth.signOut()} className="px-3 py-1 text-sm bg-slateGrey/20 text-white rounded hover:bg-slateGrey/40 transition">
        Sign Out
      </button>
    </div>
  );
}