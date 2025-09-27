import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Pass null if fullName is empty to make it truly optional
      const { error: signUpError } = await signUp(email, password, fullName.trim() || null);

      if (signUpError) {
        setError(signUpError.message || "Failed to create account");
        return;
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Account Created!</CardTitle>
            <CardDescription className="text-center">
              Please check your email for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-green-600">
                Registration successful! Please check your email for confirmation.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 text-center">
              <Button
                onClick={() => router.push("/auth/login")}
                className="w-full"
              >
                Continue to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to start taking notes with NoteFlow
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
                disabled={loading}
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
                disabled={loading}
                required
                className="bg-white/5 border-white/10 focus:border-teal-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Display Name (Optional)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="bg-white/5 border-white/10 focus:border-teal-500/50"
              />
              <p className="text-xs text-muted-foreground">
                You can skip this and add it later in your profile
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
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
              variant="secondary"
              className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 border-teal-500/30"
              onClick={() => router.push("/auth/login")}
              disabled={loading}
            >
              Try as Guest Instead
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push("/auth/login")}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
