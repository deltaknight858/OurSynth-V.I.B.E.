import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile, authService } from "@/services/authService";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string | null) => Promise<{ user: User | null; error: any }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInAnonymously: () => Promise<{ user: User | null; error: any }>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: any }>;
  resendVerificationEmail: (email: string) => Promise<{ error: any }>; // Added this line
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const setData = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      
      if (data?.session?.user) {
        try {
          const userProfile = await authService.getUserProfile(data.session.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error loading user profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userProfile = await authService.getUserProfile(session.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error("Error loading user profile:", error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      });

      unsubscribe = () => {
        listener.subscription.unsubscribe();
      };
    };
    setData();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [supabase.auth]); // Added supabase.auth to dependency array

  const signUp = async (email: string, password: string, fullName?: string | null) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
        data: { 
          email,
          full_name: fullName || null
        }
      }
    });
    return { user: data.user, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  };

  const signInAnonymously = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `anonymous_${Date.now()}@temp.com`,
        password: `temp${Date.now()}`,
      });
      return { user: data.user, error };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const sendPasswordResetEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password",
    });
    return { error };
  };

  const resendVerificationEmail = async (email: string) => { // Added this function
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile,
      loading, 
      signUp, 
      signIn,
      signInAnonymously,
      signInWithGoogle, 
      signOut, 
      sendPasswordResetEmail,
      resendVerificationEmail // Added this line
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
