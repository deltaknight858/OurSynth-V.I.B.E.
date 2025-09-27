
import { useRouter } from "next/router";
import { Globe, Home, Settings } from "lucide-react";

const pageConfig = {
  "/": {
    title: "Welcome",
    icon: Home,
  },
  "/domains": {
    title: "My Domains",
    icon: Globe,
  },
  "/settings": {
    title: "Settings",
    icon: Settings,
  },
};

export default function MobileHeader() {
  const router = useRouter();
  const currentPage = pageConfig[router.pathname as keyof typeof pageConfig] || {
    title: "Domains",
    icon: Globe,
  };
  
  const Icon = currentPage.icon;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 md:hidden">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="p-2 bg-cyan-400/10 rounded-lg">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
        <h1 className="text-lg font-semibold text-white">{currentPage.title}</h1>
      </div>
    </header>
  );
}
