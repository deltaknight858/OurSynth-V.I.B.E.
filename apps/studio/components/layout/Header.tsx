import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-slate-900 dark:text-slate-100">
            OurSynth Studio
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              href="/studio" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              Workspace
            </Link>
            <Link 
              href="/command-center" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              Command Center
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors">
            Settings
          </button>
          <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            Save Project
          </button>
        </div>
      </div>
    </header>
  );
}