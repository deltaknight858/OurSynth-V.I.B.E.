
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import MagicLinkForm from "@/components/auth/MagicLinkForm";

export default function MagicLinkPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

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
        <div className="mb-6">
          <Link 
            href="/signin"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>

        <MagicLinkForm />

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
