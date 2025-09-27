
import { ReactNode } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import BottomNavbar from "./BottomNavbar";

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Header - Only visible on mobile */}
      <MobileHeader />

      {/* Main Content */}
      <main 
        className={`
          flex-1 
          ${!isHomePage ? "pb-16 md:pb-0" : ""} 
          min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-5rem)]
        `}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>

      {/* Bottom Navigation - Only visible on mobile for non-home pages */}
      {!isHomePage && (
        <div className="md:hidden">
          <BottomNavbar />
        </div>
      )}
    </div>
  );
}
