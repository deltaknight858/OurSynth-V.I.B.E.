import Link from 'next/link';

export default function CommandCenterPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to Studio
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Command Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            System administration and configuration management
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              System Status
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Monitor system health and performance
            </p>
            <div className="text-green-600 dark:text-green-400 font-medium">
              ✓ All systems operational
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Configuration
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Manage system settings and preferences
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Open Settings
            </button>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Analytics
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              View usage statistics and insights
            </p>
            <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-md transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}