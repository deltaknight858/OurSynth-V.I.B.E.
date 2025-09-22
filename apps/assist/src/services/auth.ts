// De-Firebase: Provide minimal, framework-agnostic auth surface.
// Replace these implementations with your chosen auth provider (e.g., NextAuth, custom JWT, Supabase).

export interface AuthError {
  code: string;
  message: string;
}

export type User = { id: string; email: string };

export async function signUp(email: string, password: string): Promise<User> {
  void email; void password;
  throw { code: "auth/disabled", message: "Firebase is removed. Implement signUp with your auth provider." } as AuthError;
}

export async function signIn(email: string, password: string, rememberMe: boolean = false): Promise<User> {
  void email; void password; void rememberMe;
  throw { code: "auth/disabled", message: "Firebase is removed. Implement signIn with your auth provider." } as AuthError;
}

export async function signInWithGoogle(rememberMe: boolean = false): Promise<User> {
  void rememberMe;
  throw { code: "auth/disabled", message: "Firebase is removed. Implement Google sign-in with your auth provider." } as AuthError;
}

export async function resetPassword(email: string): Promise<void> {
  void email;
  throw { code: "auth/disabled", message: "Firebase is removed. Implement resetPassword with your auth provider." } as AuthError;
}

export async function signOut(): Promise<void> {
  throw { code: "auth/disabled", message: "Firebase is removed. Implement signOut with your auth provider." } as AuthError;
}

export function subscribeToAuthState(_callback: (user: User | null) => void): () => void {
  // No-op subscription; return unsubscribe stub
  return () => {};
}
