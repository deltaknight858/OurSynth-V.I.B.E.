import React from 'react';

export default function AmbientPanel() {
  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1 className="panel-title">Ambient Generator</h1>
        <p className="panel-description">
          Create atmospheric and environmental soundscapes.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🌊</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Soundscape Creation</h3>
          <p className="text-slate-600 dark:text-slate-400">Generate immersive ambient environments</p>
        </div>
      </div>
    </div>
  );
}