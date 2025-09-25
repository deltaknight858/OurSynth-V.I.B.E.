import React from 'react';

export default function VibePanel() {
  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1 className="panel-title">Vibe Creator</h1>
        <p className="panel-description">
          Create atmospheric and mood-based musical elements with intuitive controls.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium mb-4 text-slate-900 dark:text-slate-100">
            Mood Controls
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Energy Level
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Emotional Tone
              </label>
              <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                <option>Happy</option>
                <option>Melancholy</option>
                <option>Mysterious</option>
                <option>Energetic</option>
                <option>Calm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Complexity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="30"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium mb-4 text-slate-900 dark:text-slate-100">
            Preview
          </h3>
          <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4">
            <div className="text-4xl">🎵</div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Generate
            </button>
            <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-md transition-colors">
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}