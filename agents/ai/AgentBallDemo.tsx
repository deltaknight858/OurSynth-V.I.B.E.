// PROMOTED from import-staging/src/features/oai/AgentBallDemo.tsx on 2025-09-08T20:34:32.041Z
// TODO: Review for token + design lint compliance.
import React from 'react';
import styles from './AgentBallDemo.module.css';
// Temporary local placeholder until @oursynth/ui is available
const OurSynthAgentBall: React.FC<{ size?: number; color?: string; glowColor?: string; animate?: boolean }> = ({ size = 128 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Agent Ball">
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="70%" stopColor="#7C4DFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#00EAFF" stopOpacity="0.2" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="url(#g)" />
  </svg>
);

export default function AgentBallDemo() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>OurSynth Agent Ball Demo</h2>

      <div className={styles.spacer}>
        <OurSynthAgentBall size={128} color="#00eaff" glowColor="#a259ff" animate />
      </div>

      <p className={styles.desc}>
        This is a live, animated agent avatar. Use it as a floating assistant, status indicator, or interactive agent UI.
      </p>
    </section>
  );
}
