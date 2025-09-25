import React, { useEffect, useState } from 'react';
import { ServiceList, Service } from '../components/ServiceList';
import styles from './index.module.css';

const initialServices: Service[] = [
  { 
    name: 'Studio', 
    url: 'http://localhost:3004',
    description: 'Visual web app builder with drag-and-drop interface',
    icon: '🎨',
    category: 'Creative'
  },
  { 
    name: 'Deploy', 
    url: 'http://localhost:3006',
    description: 'Deployment management and infrastructure automation',
    icon: '🚀',
    category: 'Infrastructure'
  },
  { 
    name: 'Domains', 
    url: 'http://localhost:3007',
    description: 'Domain management and DNS configuration',
    icon: '🌐',
    category: 'Infrastructure'
  },
  { 
    name: 'Pathways', 
    url: 'http://localhost:3008',
    description: 'AI-powered workflow automation and decision trees',
    icon: '🧙‍♂️',
    category: 'AI/Automation'
  },
  { 
    name: 'Sentient Developer', 
    url: 'http://localhost:4001',
    description: 'AI development assistant and code generation',
    icon: '🤖',
    category: 'AI/Automation'
  },
  { 
    name: 'Orchestrator', 
    url: 'N/A (library)',
    description: 'Core orchestration engine for platform services',
    icon: '🎼',
    category: 'Core Library'
  },
  { 
    name: 'Analyzer', 
    url: 'N/A (library)',
    description: 'Data analysis and insights generation',
    icon: '📊',
    category: 'Core Library'
  },
];

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>(initialServices);

  // Example: Live status polling and log simulation (stub)
  useEffect(() => {
    // Simulate status and logs
    setTimeout(() => {
      setServices(s => s.map(service =>
        service.url.startsWith('http')
          ? {
              ...service,
              status: 'Online',
              logs: [
                `[${service.name}] Service started at 08:00:00`,
                `[${service.name}] Health check passed`,
                `[${service.name}] No errors detected`,
                `[${service.name}] Ready for requests`,
                `[${service.name}] Last request: 08:04:12`,
                `[${service.name}] Status: Online`,
              ],
            }
          : service
      ));
    }, 1000);
  }, []);

  return (
    <main className={`${styles.main} background-flow`}>
      <header className={styles.header}>
        <h1 className={`${styles.heading} gradient-text typewriter`}>OurSynth Platform Dashboard</h1>
        <p className={`${styles.description} delayed-fade-in`}>Monitor and launch all platform services from one place.</p>
        
        <div className={`${styles.quickNav} fade-in-up`}>
          <h2 className="gradient-text">Quick Launch</h2>
          <div className={styles.quickLinks}>
            <a href="http://localhost:3004" target="_blank" rel="noopener" className="sparkle-button lime-border-glow">
              🎨 Studio
            </a>
            <a href="http://localhost:3008" target="_blank" rel="noopener" className="sparkle-button purple-border-glow">
              🧙‍♂️ Pathways
            </a>
            <a href="http://localhost:3006" target="_blank" rel="noopener" className="sparkle-button morph-glow">
              🚀 Deploy
            </a>
            <a href="http://localhost:3007" target="_blank" rel="noopener" className="sparkle-button lime-border-glow">
              🌐 Domains
            </a>
          </div>
        </div>
      </header>

      <div className="fade-in-up">
        <ServiceList services={services} />
      </div>
      
      <footer className={`${styles.footer} delayed-fade-in-3`}>
        <div className={styles.stats}>
          <div className="glass-morphism">
            <span className="lime-glow">Online Services:</span> {services.filter(s => s.status === 'Online').length}
          </div>
          <div className="glass-morphism">
            <span className="purple-glow">Total Services:</span> {services.length}
          </div>
          <div className="glass-morphism">
            <span className="wizard-glow">Platform Status:</span> Operational ✨
          </div>
        </div>
        <p>More features coming soon: live service monitoring, advanced orchestration, and AI-powered insights.</p>
      </footer>
    </main>
  );
}
