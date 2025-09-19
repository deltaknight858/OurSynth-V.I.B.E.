
import React from "react";
import Head from "next/head";
import DomainSearchConcept from "@/components/concept/DomainSearchConcept";
import { Globe } from "lucide-react";

export default function DomainSearchPage() {
  return (
    <>
      <Head>
        <title>Domain Search - Find Your Perfect Domain</title>
        <meta name="description" content="Search millions of available domains. Get instant availability results and secure your online presence today." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Full-screen domain search application */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0">
          {/* Large gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-3"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px"
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/10 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Main application content */}
        <div className="relative z-10 flex flex-col flex-grow min-h-screen">
          {/* Header */}
          <header className="border-b border-gray-800/50 backdrop-blur-sm bg-transparent">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl">DomainFinder</span>
                </div>
                
                <nav>
                  <button className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300">
                    Sign In
                  </button>
                </nav>
              </div>
            </div>
          </header>

          {/* Main search interface */}
          <main className="flex-grow flex flex-col items-center justify-center px-6 text-center">
            <div className="w-full">
                <div className="mb-12">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                        Find Your Perfect Domain
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Search millions of available domains. Get instant availability results and secure your online presence today.
                    </p>
                </div>
                <DomainSearchConcept />
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-800/50 backdrop-blur-sm bg-transparent mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-400 text-sm">
                <p>© 2025 DomainFinder. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
