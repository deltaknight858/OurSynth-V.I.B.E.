
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Home, 
  Shirt, 
  Users, 
  Crown, 
  LogOut, 
  User,
  Settings,
  ChevronDown
} from "lucide-react";

export function MainNav() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const navigation = [
    {
      title: "Home",
      href: "/",
      icon: Home
    },
    {
      title: "Wardrobe",
      href: "/wardrobe",
      icon: Shirt
    },
    {
      title: "Social",
      href: "/social",
      icon: Users
    },
    {
      title: "Premium",
      href: "/premium",
      icon: Crown
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 h-16">
      <div className="flex items-center gap-6">
<<<<<<< HEAD
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex items-center">
            <span className="text-2xl font-bold gradient-text animate-pulse-vibe group-hover:scale-105 transition-transform duration-300">
              V.I.B.E.
            </span>
            <span className="ml-2 text-sm neon-cyan font-medium">Assist</span>
          </div>
=======
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">FASHN</span>
>>>>>>> main
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={navigationMenuTriggerStyle()}
                    active={router.pathname === item.href}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-8 w-8 rounded-full hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.email && (
                    <p className="font-medium">{user.email}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600" 
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild className="hover:bg-accent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
