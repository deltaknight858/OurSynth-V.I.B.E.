import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/Layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/services/authService";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render theme toggle after component mounts to prevent hydration mismatch
  useEffect(() => {
    // Set mounted to true only once after initial client-side render
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      await router.push("/auth/login");
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  return (
    <div className='min-h-screen pb-16 bg-gradient-to-b from-background to-background/95'>
      <div className='fixed top-4 right-4 z-10 flex items-center gap-2'>
        {!loading && user && (
          <div className='glass-morphism illuminate p-1 rounded-lg'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
                    ) : (
                      <AvatarFallback>{getInitials(profile?.full_name || user?.email)}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-morphism border-white/10">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-9 w-9">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || "User"} />
                    ) : (
                      <AvatarFallback>{getInitials(profile?.full_name || user?.email)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid gap-0.5 text-xs">
                    <div className="font-medium">{profile?.full_name || user?.email?.split("@")[0]}</div>
                    <div className="text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-white/10"
                  onClick={() => router.push("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-red-500/20 text-red-500 focus:text-red-500"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Only render ThemeToggle after client-side hydration */}
        {mounted && (
          <div className='glass-morphism illuminate p-2 rounded-lg' key="theme-toggle">
            <ThemeToggle />
          </div>
        )}

        {!loading && !user && (
          <div className='glass-morphism illuminate p-1 rounded-lg'>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-teal-500 hover:bg-teal-500/20"
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
      
      <main className='pt-16 container mx-auto px-4'>
        <div className='glass-morphism rounded-xl p-4 min-h-[calc(100vh-8rem)]'>
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
