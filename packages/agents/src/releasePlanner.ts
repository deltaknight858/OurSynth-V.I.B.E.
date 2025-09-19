/**
 * Release Planner Agent
 * Purpose: Aggregate changes since last tag; produce semantic version suggestion & changelog
 * Outputs: CHANGELOG.md snippet + version bump
 */

import type { AgentEvent } from './types.js';

export interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  date: string;
  type: 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore' | 'breaking';
  scope?: string;
  description: string;
  breaking?: boolean;
}

export interface ReleasePlanInput {
  since?: string; // git tag or commit hash
  includeUnreleased?: boolean;
  conventionalCommits?: boolean;
}

export interface ChangelogEntry {
  type: string;
  scope?: string;
  description: string;
  hash: string;
  breaking?: boolean;
}

export interface VersionBump {
  current: string;
  suggested: string;
  type: 'major' | 'minor' | 'patch';
  reason: string;
}

export interface ReleasePlanOutput {
  versionBump: VersionBump;
  changelog: {
    version: string;
    date: string;
    sections: Record<string, ChangelogEntry[]>;
  };
  releaseNotes: string;
  commits: CommitInfo[];
  recommendations: string[];
}

export class ReleasePlannerAgent {
  private onEvent?: (event: AgentEvent) => void;

  constructor(onEvent?: (event: AgentEvent) => void) {
    this.onEvent = onEvent;
  }

  private emit(type: AgentEvent['type'], payload?: unknown) {
    this.onEvent?.({ type, payload, timestamp: Date.now() });
  }

  async execute(input: ReleasePlanInput): Promise<ReleasePlanOutput> {
    this.emit('start', { agent: 'releasePlanner', input });

    try {
      this.emit('progress', { message: 'Analyzing commit history...' });

      // Mock commits - in real implementation, would parse git log
      const commits: CommitInfo[] = [
        {
          hash: 'abc123',
          message: 'feat(agents): add Phase 3 monetization and marketplace agents',
          author: 'deltaknight858',
          date: '2025-09-13T08:52:00Z',
          type: 'feat',
          scope: 'agents',
          description: 'add Phase 3 monetization and marketplace agents',
          breaking: false
        },
        {
          hash: 'def456',
          message: 'feat(brand): implement brand consistency checking agent',
          author: 'deltaknight858',
          date: '2025-09-13T08:50:00Z',
          type: 'feat',
          scope: 'brand',
          description: 'implement brand consistency checking agent',
          breaking: false
        },
        {
          hash: 'ghi789',
          message: 'feat(release): add automated release planning agent',
          author: 'deltaknight858',
          date: '2025-09-13T08:48:00Z',
          type: 'feat',
          scope: 'release',
          description: 'add automated release planning agent',
          breaking: false
        },
        {
          hash: 'jkl012',
          message: 'fix(chat): resolve message rendering issue',
          author: 'deltaknight858',
          date: '2025-09-12T15:30:00Z',
          type: 'fix',
          scope: 'chat',
          description: 'resolve message rendering issue',
          breaking: false
        }
      ];

      this.emit('progress', { message: 'Determining version bump...' });

      const versionBump = this.determineVersionBump(commits);
      
      this.emit('progress', { message: 'Generating changelog...' });

      const changelog = this.generateChangelog(commits, versionBump.suggested);
      const releaseNotes = this.generateReleaseNotes(commits, versionBump);
      const recommendations = this.generateRecommendations(commits);

      const output: ReleasePlanOutput = {
        versionBump,
        changelog,
        releaseNotes,
        commits,
        recommendations
      };

      this.emit('complete', { output });
      return output;
    } catch (error) {
      this.emit('complete', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  private determineVersionBump(commits: CommitInfo[]): VersionBump {
    const hasBreaking = commits.some(c => c.breaking);
    const hasFeatures = commits.some(c => c.type === 'feat');
    const hasFixes = commits.some(c => c.type === 'fix');

    let bumpType: 'major' | 'minor' | 'patch';
    let reason: string;

    if (hasBreaking) {
      bumpType = 'major';
      reason = 'Breaking changes detected';
    } else if (hasFeatures) {
      bumpType = 'minor';
      reason = 'New features added';
    } else if (hasFixes) {
      bumpType = 'patch';
      reason = 'Bug fixes included';
    } else {
      bumpType = 'patch';
      reason = 'Documentation and maintenance updates';
    }

    // Mock current version
    const current = '2.1.4';
    const suggested = this.bumpVersion(current, bumpType);

    return {
      current,
      suggested,
      type: bumpType,
      reason
    };
  }

  private bumpVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
    const [major, minor, patch] = version.split('.').map(Number);
    
    switch (type) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  private generateChangelog(commits: CommitInfo[], version: string) {
    const sections: Record<string, ChangelogEntry[]> = {
      'Features': [],
      'Bug Fixes': [],
      'Documentation': [],
      'Code Refactoring': [],
      'Tests': [],
      'Chores': []
    };

    commits.forEach(commit => {
      const entry: ChangelogEntry = {
        type: commit.type,
        scope: commit.scope,
        description: commit.description,
        hash: commit.hash,
        breaking: commit.breaking
      };

      switch (commit.type) {
        case 'feat':
          sections['Features'].push(entry);
          break;
        case 'fix':
          sections['Bug Fixes'].push(entry);
          break;
        case 'docs':
          sections['Documentation'].push(entry);
          break;
        case 'refactor':
          sections['Code Refactoring'].push(entry);
          break;
        case 'test':
          sections['Tests'].push(entry);
          break;
        default:
          sections['Chores'].push(entry);
      }
    });

    return {
      version,
      date: new Date().toISOString().split('T')[0],
      sections
    };
  }

  private generateReleaseNotes(commits: CommitInfo[], versionBump: VersionBump): string {
    const lines: string[] = [];
    
    lines.push(`# Release ${versionBump.suggested}`);
    lines.push('');
    lines.push(`**${versionBump.reason}**`);
    lines.push('');

    const features = commits.filter(c => c.type === 'feat');
    const fixes = commits.filter(c => c.type === 'fix');
    
    if (features.length > 0) {
      lines.push('## ✨ New Features');
      features.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}**: ` : '';
        lines.push(`- ${scope}${commit.description} (${commit.hash.substring(0, 7)})`);
      });
      lines.push('');
    }

    if (fixes.length > 0) {
      lines.push('## 🐛 Bug Fixes');
      fixes.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}**: ` : '';
        lines.push(`- ${scope}${commit.description} (${commit.hash.substring(0, 7)})`);
      });
      lines.push('');
    }

    lines.push('## 🔄 Full Changelog');
    lines.push(`**Full Changelog**: v${versionBump.current}...v${versionBump.suggested}`);

    return lines.join('\n');
  }

  private generateRecommendations(commits: CommitInfo[]): string[] {
    const recommendations: string[] = [];
    
    const conventionalCommits = commits.every(c => 
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'].includes(c.type)
    );
    
    if (!conventionalCommits) {
      recommendations.push('Consider adopting conventional commit format for better automation');
    }

    if (commits.length > 20) {
      recommendations.push('Large number of changes - consider breaking into smaller releases');
    }

    const hasTests = commits.some(c => c.type === 'test');
    if (!hasTests && commits.some(c => c.type === 'feat')) {
      recommendations.push('New features added without test commits - verify test coverage');
    }

    const hasDocs = commits.some(c => c.type === 'docs');
    if (!hasDocs && commits.some(c => c.type === 'feat')) {
      recommendations.push('New features may need documentation updates');
    }

    recommendations.push('Review breaking changes policy before major version bump');
    recommendations.push('Ensure all CI checks pass before release');
    recommendations.push('Consider beta release for major changes');

    return recommendations;
  }
}