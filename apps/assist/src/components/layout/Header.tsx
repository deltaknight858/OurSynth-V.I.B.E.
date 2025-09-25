
import { MainNav } from "@/components/layout/NavigationMenu";
import { cn } from "@/lib/utils";

export function Header() {
  return (
<<<<<<< HEAD
    <header className={cn("sticky top-0 z-50 w-full glass border-b border-glass-border neon-glow")}>
=======
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60")}>
>>>>>>> main
      <MainNav />
    </header>
  );
}
