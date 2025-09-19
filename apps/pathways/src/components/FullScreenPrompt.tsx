'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FullScreenPrompt() {
  const [blueprint, setBlueprint] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto p-4 lg:p-8 gap-6">
        
        {/* Main Prompt Panel */}
        <motion.div 
          className="glass-strong w-full lg:w-2/3 rounded-2xl p-6 md:p-8 backdrop-blur-lg border border-gray-200 relative overflow-hidden"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Animated underline decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-lime-400 underline-in"></div>
          
          <motion.h1 
            className="neon-etched flicker text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 md:mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
              You&apos;re building something powerful.
          </motion.h1>
          
          <motion.p 
            className="neon-accent text-lg sm:text-xl md:text-2xl text-center mb-6 md:mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            💡 Describe your vision in vivid detail — every function, every interaction, every design nuance.
          </motion.p>
          
          <motion.p 
            className="text-center text-base md:text-lg mb-6 md:mb-8 text-gray-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Don&apos;t hold back. This isn&apos;t a &quot;start typing&quot; prompt — it&apos;s your blueprint.
          </motion.p>
          
          {/* Examples Section */}
          <motion.div 
            className="glass rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h3 className="neon-text text-lg md:text-xl font-semibold mb-4">Examples:</h3>
            <ul className="list-none space-y-3 neon-text text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="neon-lime font-bold">→</span>
                A modular analytics dashboard with live charts, user authentication, and exportable reports
              </li>
              <li className="flex items-start gap-2">
                <span className="neon-lime font-bold">→</span>
                A sleek login interface with animated transitions and multi-factor authentication
              </li>
              <li className="flex items-start gap-2">
                <span className="neon-lime font-bold">→</span>
                A storytelling app with AI-generated characters, scenes, and branching narrative paths
              </li>
            </ul>
          </motion.div>
          
          {/* Tech Stack Hints */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <div className="glass rounded-lg p-4 text-center border border-gray-100">
              <p className="neon-lime text-sm md:text-base font-semibold">🧠 Tech Stack</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">React + Tailwind + Supabase</p>
            </div>
            <div className="glass rounded-lg p-4 text-center border border-gray-100">
              <p className="neon-lime text-sm md:text-base font-semibold">🎨 Styling</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Animations, themes, glassmorphism</p>
            </div>
            <div className="glass rounded-lg p-4 text-center border border-gray-100">
              <p className="neon-lime text-sm md:text-base font-semibold">🛠 Features</p>
              <p className="text-xs md:text-sm text-gray-600 mt-1">CRUD, websockets, realtime</p>
            </div>
          </motion.div>
          
          <motion.p 
            className="neon-accent text-center text-lg md:text-xl mb-4 md:mb-6 floaty"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            👇 Type it all out below 👇
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <textarea
              value={blueprint}
              onChange={(e) => setBlueprint(e.target.value)}
              className="w-full h-32 md:h-48 lg:h-56 glass-strong border-none neon-text p-4 md:p-6 rounded-xl focus-ring resize-none outline-none placeholder-gray-500 text-sm md:text-base transition-all duration-300"
              placeholder="Type your blueprint here…"
            />
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <button 
              className="neon-accent glass py-3 px-6 rounded-xl glow focus-ring font-semibold text-white w-full sm:w-auto transition-all duration-300 hover:scale-105"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Live Preview'}
            </button>
            <button className="glass py-3 px-6 rounded-xl focus-ring font-semibold text-gray-700 w-full sm:w-auto transition-all duration-300 hover:scale-105 border border-gray-200">
              Generate Project
            </button>
          </motion.div>
          
          <motion.p 
            className="neon-text text-center mt-6 md:mt-8 text-xs md:text-sm flicker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.6 }}
          >
            No distractions. No menus. Just flow.
          </motion.p>
        </motion.div>

        {/* Live Preview Panel */}
        <AnimatePresence>
          {showPreview && (
            <motion.div 
              className="glass w-full lg:w-1/3 rounded-2xl p-6 backdrop-blur-lg border border-gray-200 neon-border fixed lg:relative inset-4 lg:inset-auto z-50 lg:z-auto"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close button for mobile */}
              <button 
                className="lg:hidden absolute top-4 right-4 glass rounded-full p-2 neon-accent font-bold"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </button>
              
              <h3 className="neon-text text-xl md:text-2xl font-bold mb-6 floaty">Live Preview</h3>
              
              <div className="space-y-4">
                <div className="glass-strong rounded-lg p-4 border border-gray-100">
                  <h4 className="neon-lime font-semibold mb-2">Project Type</h4>
                  <p className="text-sm text-gray-600">Auto-detected from description</p>
                </div>
                
                <div className="glass-strong rounded-lg p-4 border border-gray-100">
                  <h4 className="neon-lime font-semibold mb-2">Tech Stack</h4>
                  <p className="text-sm text-gray-600">Recommended based on requirements</p>
                </div>
                
                <div className="glass-strong rounded-lg p-4 border border-gray-100">
                  <h4 className="neon-lime font-semibold mb-2">Blueprint Analysis</h4>
                  <p className="text-sm text-gray-600">{blueprint.length} characters</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(blueprint.length / 500 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
