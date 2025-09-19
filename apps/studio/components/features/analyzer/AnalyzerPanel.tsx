import React from 'react';

export default function AnalyzerPanel() {
  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1 className="panel-title">Audio Analyzer</h1>
        <p className="panel-description">
          Analyze and process audio content with advanced visualization tools.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium mb-4 text-slate-900 dark:text-slate-100">
            Upload Audio
          </h3>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🎧</div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Drop your audio file here or click to browse
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Select File
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium mb-4 text-slate-900 dark:text-slate-100">
              Frequency Analysis
            </h3>
            <div className="h-48 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
              <span className="text-slate-500 dark:text-slate-400">Spectrum visualization</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium mb-4 text-slate-900 dark:text-slate-100">
              Audio Properties
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">BPM:</span>
                <span className="text-slate-900 dark:text-slate-100">120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Key:</span>
                <span className="text-slate-900 dark:text-slate-100">C Major</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                <span className="text-slate-900 dark:text-slate-100">3:45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Sample Rate:</span>
                <span className="text-slate-900 dark:text-slate-100">44.1 kHz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}