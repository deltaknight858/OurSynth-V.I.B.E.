
import { MainNav } from "@/components/layout/NavigationMenu";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn("sticky top-0 z-50 w-full glass border-b border-glass-border neon-glow")}>
      <MainNav />
    </header>
  );
}
