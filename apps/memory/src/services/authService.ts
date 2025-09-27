import { createBrowserClient } from "@supabase/ssr";
import { User, Session, AuthError, AuthResponse } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  updated_at?: string;
  is_anonymous?: boolean;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authService = {
  async signUp(
    email: string,
    password: string,
    fullName?: string | null
  ): Promise<{ data: { user: any; session: any } | null; error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName || null,
          is_anonymous: false,
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    }

    if (data.user && !error) {
      try {
        await this.createUserProfile(data.user.id, email, fullName, false);
      } catch (profileError) {
        console.error("Error creating profile during signup:", profileError);
      }
    }
    return { data, error };
  },

  async signIn(
    email: string,
    password: string
  ): Promise<{ data: { user: any; session: any } | null; error: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Sign in error:", error);
    }
    return { data, error };
  },

  async signInWithGoogle(): Promise<{ data: { provider?: string; url?: string | null; } | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Google sign in error:", error);
    }
    return { data: data || null, error };
  },

  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
    }
    return { error };
  },

  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async sendPasswordResetEmail(email: string): Promise<{ data: Record<string, never> | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      console.error("Password reset error:", error);
    }
    return { data, error };
  },

  async updateUserPassword(password: string): Promise<{ data: { user: User | null } | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error("Update password error:", error);
    }
    return { data: data ? { user: data.user } : null, error };
  },
  
  async resendVerificationEmail(email: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: email,
    });
    if (error) {
        console.error("Resend verification email error:", error);
    }
    return { data, error };
  },

  async createUserProfile(
    userId: string,
    email: string,
    fullName?: string | null,
    isAnonymous: boolean = false
  ): Promise<UserProfile> {
    const profileData: Partial<UserProfile> = {
      id: userId,
      email: email,
      updated_at: new Date().toISOString(),
      is_anonymous: isAnonymous,
    };

    if (isAnonymous) {
      profileData.full_name = "Guest User";
    } else if (fullName) {
      profileData.full_name = fullName;
    } else {
      profileData.full_name = `User-${userId.substring(0, 8)}`;
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
    return data as UserProfile;
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && status !== 406) {
        console.error("Error fetching user profile:", error);
        throw error;
      }

      if (data) {
        return data as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Exception in getUserProfile:", error);
      return null;
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
    return data as UserProfile;
  },

  async signInAnonymously(): Promise<{ data: { user: any; session: any } | null; error: any }> {
    const tempEmail = `guest_${Date.now()}@example.com`;
    const tempPassword = `Pa$$wOrd${Date.now()}`;

    const { data, error } = await supabase.auth.signUp({
      email: tempEmail,
      password: tempPassword,
      options: {
        data: {
          full_name: "Guest User",
          is_anonymous: true,
        },
      },
    });
    
    if (error) {
      console.error("Anonymous sign in error:", error);
      return { data: null, error };
    }

    if (data.user && !error) {
      try {
        await this.createUserProfile(data.user.id, tempEmail, "Guest User", true);
      } catch (profileError) {
         console.error("Error creating profile for anonymous user:", profileError);
      }
    }
    return { data, error };
  }
};
