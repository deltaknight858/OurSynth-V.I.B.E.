import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <div className="text-center space-y-6">
        <div className="inline-block p-4 bg-slate-800/50 rounded-full border border-slate-700">
          <Globe className="h-16 w-16 text-cyan-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome to DomainManager
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400">
          Your one-stop solution for managing all your domains with ease.
          Beautifully designed and powerfully built.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/domains">
            <Button size="lg" className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold text-lg px-8 py-6">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/concept/domain-search">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 font-bold text-lg px-8 py-6 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Domain Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
