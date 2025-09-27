
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import EmailPasswordForm from '@/components/auth/EmailPasswordForm';
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import OAuthLoading from "@/components/auth/OAuthLoading";
import authService from '@/services/auth';

export default function SignInPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) throw error;
      // On success, Supabase handles the redirect.
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Error",
        description: authError.message,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setErrorMsg(null); // Clear any existing errors when switching modes
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[url('/bg-neon-grid.jpg')] bg-cover flex items-center justify-center p-4">
        <div className="glass-card p-8 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-300 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[url('/bg-neon-grid.jpg')] bg-cover flex items-center justify-center p-4">
      <div className="glass-card p-6 sm:p-8 rounded-xl max-w-md w-full mx-4">
        {!showEmailForm ? (
          // OAuth and Email Option View
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold neon-text">Welcome Back</h1>
              <p className="text-gray-300 text-sm">
                Choose your preferred sign-in method
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-white/20 hover:bg-white/30 border border-white/40 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <OAuthLoading className="w-5 h-5" />
              ) : (
                <>
                  <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-3" />
                  <span className="text-white font-medium">
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email/Password Option */}
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/30 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <span className="text-white font-medium">Continue with Email</span>
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              </div>
            )}

            <p className="text-gray-400 text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        ) : (
          // Email/Password Form View
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowEmailForm(false);
                setErrorMsg(null);
              }}
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
            >
              ← Back to options
            </button>
            
            <EmailPasswordForm 
              mode={authMode} 
              onToggleMode={toggleAuthMode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
