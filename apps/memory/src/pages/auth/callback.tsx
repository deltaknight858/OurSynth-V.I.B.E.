import { useEffect } from "react";
import { useRouter } from "next/router";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  // Create a Supabase client for client-side operations
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Check if there's a session.
        // getSession() will automatically exchange the code in the URL for a session.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session in callback:", error.message);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem validating your session. Please try logging in again.",
          });
          router.push("/auth/login");
          return;
        }

        if (session) {
          toast({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          });
          // Redirect to the intended page or home
          const redirectPath = router.query.redirect || "/";
          router.push(typeof redirectPath === "string" ? redirectPath : "/");
        } else {
          // This case should ideally not be hit if the OAuth flow was successful,
          // as getSession() should establish the session.
          // If it is, it might indicate an issue with the OAuth provider or Supabase setup.
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "Could not establish a session. Please try again.",
          });
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Unexpected error during authentication callback:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try again.",
        });
        router.push("/auth/login");
      }
    };

    // The auth flow might include a code in the URL hash or query params.
    // Supabase client handles this automatically when getSession or other auth methods are called.
    // We add a small delay to ensure URL parameters are processed.
    const timeout = setTimeout(() => {
      handleAuthRedirect();
    }, 100); // Reduced delay, as getSession should handle it.

    return () => {
      clearTimeout(timeout);
    };
  }, [router, supabase.auth, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="glass-card p-8 rounded-2xl">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-4" />
        <p className="text-lg">Finalizing authentication...</p>
        <p className="text-sm text-muted-foreground">Please wait while we securely sign you in.</p>
      </div>
    </div>
  );
}
