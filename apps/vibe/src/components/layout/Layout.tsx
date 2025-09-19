
import React from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import BottomNavbar from "./BottomNavbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <main className="pb-20 md:pb-0">{children}</main>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
}
