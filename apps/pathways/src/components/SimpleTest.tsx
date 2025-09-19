'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              OurSynth AI Code Generator
            </span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: '🧩', title: 'Component', desc: 'Build reusable components' },
              { icon: '📄', title: 'Page', desc: 'Create full pages' },
              { icon: '🚀', title: 'App', desc: 'Generate complete apps' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Start Building
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/60">
              Status: Testing basic styling and animations
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
