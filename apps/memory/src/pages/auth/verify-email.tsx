import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { resendVerificationEmail } = useAuth(); // Changed from resendVerification

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      if (!resendVerificationEmail) { // Changed from resendVerification
        setError("Resend verification feature is not available at the moment.");
        setLoading(false);
        return;
      }
      const { error: apiError } = await resendVerificationEmail(email); // Changed from resendVerification
      
      if (apiError) {
        setError(apiError.message || "Failed to resend verification email");
        setLoading(false); // Ensure loading is set to false on error
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
      <div className="min-h-screen flex items-center justify-center synthnote-gradient">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md glass-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Email Sent
              </CardTitle>
              <CardDescription>
                We&apos;ve sent a verification email to {email}. Please check your inbox (and spam folder) and click the link to activate your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  If you haven&apos;t received the email after a few minutes, you can request another one.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/auth/login")}
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center synthnote-gradient">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Verify Your Email
            </CardTitle>
            <CardDescription>
              Enter your email address to resend the verification link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResendVerification} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend Verification Email
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => router.push("/auth/login")}
                className="text-sm"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
