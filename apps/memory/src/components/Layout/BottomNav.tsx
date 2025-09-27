import { Home, Book, User, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export function BottomNav() {
  const router = useRouter();
  
  const isActive = (path: string) => router.pathname === path;
  
  const linkStyle = (path: string) => {
    const baseStyle = "flex flex-col items-center space-y-1 transition-all duration-300 p-2 rounded-lg hover:bg-primary/10";
    const activeStyle = "text-primary illuminate scale-110";
    const inactiveStyle = "text-muted-foreground hover:text-primary hover:scale-105";
    
    return `${baseStyle} ${isActive(path) ? activeStyle : inactiveStyle}`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-white/10 backdrop-blur-lg">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <Link href="/" className={linkStyle("/")}>
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/notebooks" className={linkStyle("/notebooks")}>
          <Book size={24} />
          <span className="text-xs font-medium">Notebooks</span>
        </Link>
        <Link href="/notes" className={linkStyle("/notes")}>
          <User size={24} />
          <span className="text-xs font-medium">Notes</span>
        </Link>
        <Link href="/settings" className={linkStyle("/settings")}>
          <Settings size={24} />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
}