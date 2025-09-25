import React from 'react';

export default function WizardPanel() {
  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1 className="panel-title">Music Creation Wizard</h1>
        <p className="panel-description">
          Let our AI guide you through the music creation process step by step.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                Step 1 of 4: Choose Your Style
              </h3>
              <div className="text-sm text-slate-500 dark:text-slate-400">25% Complete</div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-6">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['Rock', 'Jazz', 'Electronic', 'Classical', 'Pop', 'Ambient', 'Hip-Hop', 'Folk'].map((style) => (
              <button
                key={style}
                className="p-4 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
              >
                <div className="text-2xl mb-2">🎵</div>
                <div className="font-medium text-slate-900 dark:text-slate-100">{style}</div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Back
            </button>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}