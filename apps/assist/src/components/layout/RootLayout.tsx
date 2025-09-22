
import { ReactNode } from "react";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/services/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">
                    EbFlo
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/codebot" className="text-sm font-medium hover:text-primary transition-colors">
                    Codebot
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/chatbot" className="text-sm font-medium hover:text-primary transition-colors">
                    Chatbot
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <div className="ml-auto flex items-center gap-4">
                {loading ? (
                  <div className="h-9 w-20 animate-pulse rounded bg-muted" />
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="hover:bg-accent">
                        {user.email?.split("@")[0]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex gap-2">
                    <Button asChild className="hover:bg-accent">
                      <Link href="/auth/login">Sign in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/register">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EbFlo. All rights reserved.
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
