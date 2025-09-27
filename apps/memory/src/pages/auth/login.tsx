import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Chrome, Brain, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/Layout/PageLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn, signInWithGoogle, signInAnonymously, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message || "Failed to sign in");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message || "Failed to sign in with Google");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  const handleGuestAccess = async () => {
    setGuestLoading(true);
    setError("");
    
    try {
      const { error } = await signInAnonymously();
      if (error) {
        setError(error.message || "Failed to create guest session");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to NoteFlow</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or try as guest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || guestLoading}
                required
                className="bg-white/5 border-white/10 focus:border-teal-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || guestLoading}
                required
                className="bg-white/5 border-white/10 focus:border-teal-500/50"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={loading || guestLoading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-white/5 border-white/10 hover:bg-white/10"
              onClick={handleGoogleSignIn}
              disabled={loading || guestLoading}
            >
              Continue with Google
            </Button>

            <Button
              variant="secondary"
              className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border-teal-500/30"
              onClick={handleGuestAccess}
              disabled={loading || guestLoading}
            >
              {guestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Guest Session...
                </>
              ) : (
                "Try as Guest"
              )}
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-teal-400 hover:text-teal-300"
              onClick={() => router.push("/auth/register")}
            >
              Sign up
            </Button>
          </div>

          <div className="mt-2 text-center text-sm">
            <Button
              variant="link"
              className="p-0 h-auto text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/auth/reset-password")}
            >
              Forgot your password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
