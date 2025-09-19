
import React, { useState } from 'react';
import styles from './ServiceList.module.css';

export interface Service {
  name: string;
  url: string;
  description?: string;
  icon?: string;
  category?: string;
  status?: string;
  logs?: string[];
}

export const ServiceList: React.FC<{ services: Service[] }> = ({ services }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

  const orchestrate = async (action: 'start' | 'stop' | 'restart', service: Service) => {
    setLoading(service.name + action);
    setFeedback(f => ({ ...f, [service.name]: '' }));
    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'valid-token' },
        body: JSON.stringify({ action, name: service.name }),
      });
      const data = await res.json();
      setFeedback(f => ({ ...f, [service.name]: data.result || data.error }));
    } catch (err) {
      setFeedback(f => ({ ...f, [service.name]: 'Orchestration failed.' }));
    } finally {
      setLoading(null);
    }
  };
  const handleStart = (service: Service) => orchestrate('start', service);
  const handleStop = (service: Service) => orchestrate('stop', service);
  const handleRestart = (service: Service) => orchestrate('restart', service);

  return (
    <div className={styles.container}>
      <div className={styles.categoryGrid}>
        {['Creative', 'Infrastructure', 'AI/Automation', 'Core Library'].map(category => {
          const categoryServices = services.filter(s => s.category === category);
          if (categoryServices.length === 0) return null;
          
          return (
            <div key={category} className={`${styles.categorySection} glass-morphism fade-in-up`}>
              <h3 className={`${styles.categoryTitle} gradient-text`}>{category}</h3>
              <ul className={styles.list}>
                {categoryServices.map((service, index) => (
                  <li key={service.name} className={`${styles.item} interactive-card ${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}`}>
                    <div className={styles.header}>
                      <div className={styles.serviceInfo}>
                        <span className={styles.icon}>{service.icon}</span>
                        <div className={styles.nameAndDesc}>
                          <span className={`${styles.name} ${service.status === 'Online' ? 'lime-glow data-node' : 'purple-glow'}`}>
                            {service.name}
                          </span>
                          {service.description && (
                            <p className={styles.description}>{service.description}</p>
                          )}
                        </div>
                      </div>
                      <div className={styles.actions}>
                        {service.url.startsWith('http') ? (
                          <a href={service.url} target="_blank" rel="noopener" className={`${styles.link} hover-bounce sparkle-button`}>
                            <span>🔗</span> Launch
                          </a>
                        ) : (
                          <span className={`${styles.library} glass-morphism`}>
                            <span>📚</span> Library
                          </span>
                        )}
                        {service.status && (
                          <span className={`${styles.status} ${service.status === 'Online' ? 'glow-expand' : 'purple-glow-expand'}`} data-status={service.status}>
                            <span className={styles.statusIcon}>●</span> {service.status}
                          </span>
                        )}
                      </div>
                    </div>
                    {service.logs && service.logs.length > 0 && (
                      <details className={`${styles.logs} glass-morphism`}>
                        <summary className="hover-scale">📋 View Logs</summary>
                        <pre className="fade-in-up">
                          {service.logs.slice(-10).join('\n')}
                        </pre>
                      </details>
                    )}
                    <div className={styles.controls}>
                      <button onClick={() => handleStart(service)} className={`${styles.controlBtn} sparkle-button lime-border-glow`} disabled={!!loading}>
                        {loading === service.name + 'start' ? '⏳ Starting...' : '▶️ Start'}
                      </button>
                      <button onClick={() => handleStop(service)} className={`${styles.controlBtn} sparkle-button purple-border-glow`} disabled={!!loading}>
                        {loading === service.name + 'stop' ? '⏳ Stopping...' : '⏹️ Stop'}
                      </button>
                      <button onClick={() => handleRestart(service)} className={`${styles.controlBtn} sparkle-button morph-glow`} disabled={!!loading}>
                        {loading === service.name + 'restart' ? '⏳ Restarting...' : '🔄 Restart'}
                      </button>
                    </div>
                    {feedback[service.name] && (
                      <div className={`${styles.feedback} bounce-animation`}>
                        <span className={styles.feedbackIcon}>💬</span>
                        {feedback[service.name]}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
