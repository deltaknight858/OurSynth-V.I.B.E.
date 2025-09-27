
import Link from "next/link";
import { useRouter } from "next/router";
import { Globe, Home, Plus, Settings } from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/domains",
    label: "Domains",
    icon: Globe,
  },
  {
    href: "/domains/add",
    label: "Add",
    icon: Plus,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function BottomNavbar() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
