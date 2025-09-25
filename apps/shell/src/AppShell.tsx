<<<<<<< HEAD
import React, { useState } from 'react';
import { HaloButton } from '@vibe/halo-ui';
import { colors } from '@vibe/core-tokens';

export interface AppShellProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Tracker', href: '/tracker', icon: '📊', tier: 'free' },
  { name: 'Memory', href: '/memory', icon: '🧠', tier: 'pro' },
  { name: 'Assist', href: '/assist', icon: '🤖', tier: 'free' },
  { name: 'Pathways', href: '/pathways', icon: '🛣️', tier: 'free' },
  { name: 'Docs', href: '/docs', icon: '📚', tier: 'free' },
  { name: 'Aether', href: '/aether', icon: '⚡', tier: 'pro' },
  { name: 'Market', href: '/market', icon: '🏪', tier: 'pro' },
  { name: 'Mesh', href: '/mesh', icon: '🕸️', tier: 'enterprise' },
  { name: 'Story', href: '/story', icon: '📖', tier: 'pro' },
  { name: 'Domains', href: '/domains', icon: '🏛️', tier: 'enterprise' },
  { name: 'Deploy', href: '/deploy', icon: '🚀', tier: 'pro' },
];

const tierColors = {
  free: 'text-cyan-400',
  pro: 'text-purple-400',
  enterprise: 'text-orange-400',
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">V.I.B.E.</h1>
              <p className="text-slate-400 text-xs">Virtual Identity & Build Environment</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`
                group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 hover:bg-slate-700/50 hover:scale-105
                ${tierColors[item.tier as keyof typeof tierColors]}
                hover:text-white relative overflow-hidden
              `}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <span className="text-lg relative z-10">{item.icon}</span>
              <span className="relative z-10">{item.name}</span>
              
              {/* Tier badge */}
              <span className={`
                ml-auto px-2 py-0.5 text-xs rounded-full border relative z-10
                ${item.tier === 'free' ? 'border-cyan-400/30 bg-cyan-400/10' : ''}
                ${item.tier === 'pro' ? 'border-purple-400/30 bg-purple-400/10' : ''}
                ${item.tier === 'enterprise' ? 'border-orange-400/30 bg-orange-400/10' : ''}
              `}>
                {item.tier}
              </span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
          <HaloButton
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Settings
          </HaloButton>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <HaloButton variant="neon" size="sm">
                Upgrade to Pro
              </HaloButton>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
=======
import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ShellSidebar } from "./ShellSidebar";
import { HaloThemeProvider } from "halo-ui";
import { AppThemeProvider } from "../../components/theme/AppThemeProvider";

import Studio from "../../apps/studio/src/Studio";
import Pathways from "../../apps/pathways/src/Pathways";
import Orchestrator from "../../apps/orchestrator/src/Orchestrator";
import MeshSim from "../../apps/mesh-sim/src/MeshSim";
import Provenance from "../../apps/provenance/src/Provenance";
import Capsule from "../../apps/capsule/src/Capsule";
import CommandCenter from "../../apps/command-center/src/CommandCenter";
import Agents from "../../apps/agents/src/Agents";
// Pre-existing apps
import Taskflow from "../../apps/taskflow/src/Taskflow";
import Noteflow from "../../apps/noteflow/src/Noteflow";

export const AppShell: React.FC = () => {
  return (
    <AppThemeProvider>
      <HaloThemeProvider>
        <Router>
          <div className="shell-layout flex h-screen w-screen bg-shell">
            <ShellSidebar />
            <main className="shell-main flex-1 overflow-auto bg-main">
              <Switch>
                <Route path="/studio" component={Studio} />
                <Route path="/pathways" component={Pathways} />
                <Route path="/orchestrator" component={Orchestrator} />
                <Route path="/mesh-sim" component={MeshSim} />
                <Route path="/provenance" component={Provenance} />
                <Route path="/capsule" component={Capsule} />
                <Route path="/command-center" component={CommandCenter} />
                <Route path="/agents" component={Agents} />
                {/* Pre-existing apps */}
                <Route path="/taskflow" component={Taskflow} />
                <Route path="/noteflow" component={Noteflow} />
                <Redirect to="/studio" />
              </Switch>
            </main>
          </div>
        </Router>
      </HaloThemeProvider>
    </AppThemeProvider>
>>>>>>> main
  );
};