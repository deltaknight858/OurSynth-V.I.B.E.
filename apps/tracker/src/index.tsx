import React, { useState, useEffect } from 'react';
import { HaloButton } from '@vibe/halo-ui';

interface ContributionEvent {
  id: string;
  type: 'code' | 'docs' | 'design' | 'review' | 'discussion';
  title: string;
  description: string;
  timestamp: Date;
  impact: 'low' | 'medium' | 'high';
  tags: string[];
}

interface TrackerStats {
  totalContributions: number;
  streakDays: number;
  topCategory: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

export const Tracker: React.FC = () => {
  const [events, setEvents] = useState<ContributionEvent[]>([]);
  const [stats, setStats] = useState<TrackerStats>({
    totalContributions: 0,
    streakDays: 0,
    topCategory: 'code',
    weeklyGoal: 10,
    weeklyProgress: 0
  });

  // Simulate real-time activity tracking
  useEffect(() => {
    const sampleEvents: ContributionEvent[] = [
      {
        id: '1',
        type: 'code',
        title: 'Updated HaloButton component',
        description: 'Added new neon glow variant and improved accessibility',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        impact: 'high',
        tags: ['ui', 'components', 'accessibility']
      },
      {
        id: '2',
        type: 'docs',
        title: 'Completed first-hour onboarding guide',
        description: 'Comprehensive walkthrough for new contributors',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        impact: 'high',
        tags: ['documentation', 'onboarding', 'contributor-experience']
      },
      {
        id: '3',
        type: 'design',
        title: 'Created brand guidelines',
        description: 'Established glass/neon design system principles',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        impact: 'medium',
        tags: ['design-system', 'branding', 'guidelines']
      }
    ];

    setEvents(sampleEvents);
    setStats({
      totalContributions: sampleEvents.length,
      streakDays: 5,
      topCategory: 'code',
      weeklyGoal: 10,
      weeklyProgress: sampleEvents.length
    });
  }, []);

  const impactColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-purple-400'
  };

  const typeIcons = {
    code: '💻',
    docs: '📚',
    design: '🎨',
    review: '👁️',
    discussion: '💬'
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          📊 Activity Tracker
        </h1>
        <p className="text-slate-300 text-lg">
          Monitor your contributions and growth in the VIBE ecosystem
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <span className="text-cyan-400 text-xl">📈</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Contributions</p>
              <p className="text-white text-2xl font-bold">{stats.totalContributions}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-xl">🔥</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Current Streak</p>
              <p className="text-white text-2xl font-bold">{stats.streakDays} days</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 text-xl">🎯</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Weekly Progress</p>
              <p className="text-white text-2xl font-bold">
                {stats.weeklyProgress}/{stats.weeklyGoal}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 text-xl">⭐</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Top Category</p>
              <p className="text-white text-2xl font-bold capitalize">{stats.topCategory}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <HaloButton variant="ghost" size="sm">
            View All
          </HaloButton>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300"
            >
              <div className="text-2xl">
                {typeIcons[event.type]}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-white font-medium">{event.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full bg-current/20 ${impactColors[event.impact]}`}>
                    {event.impact} impact
                  </span>
                </div>
                
                <p className="text-slate-300 text-sm mb-2">
                  {event.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-slate-600/50 text-slate-300 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <span className="text-slate-400 text-xs">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HaloButton variant="primary" className="flex flex-col items-center py-6">
            <span className="text-2xl mb-2">💻</span>
            <span>Log Code</span>
          </HaloButton>
          
          <HaloButton variant="secondary" className="flex flex-col items-center py-6">
            <span className="text-2xl mb-2">📚</span>
            <span>Add Docs</span>
          </HaloButton>
          
          <HaloButton variant="ghost" className="flex flex-col items-center py-6">
            <span className="text-2xl mb-2">🎨</span>
            <span>Design Work</span>
          </HaloButton>
          
          <HaloButton variant="neon" className="flex flex-col items-center py-6">
            <span className="text-2xl mb-2">🎯</span>
            <span>Set Goal</span>
          </HaloButton>
        </div>
      </div>
    </div>
  );
};