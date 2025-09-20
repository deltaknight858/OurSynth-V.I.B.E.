import styles from './Shell.module.css';
import ArchitectureCard from './ArchitectureCard';

export default function ShellPage() {
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>OS</span>
          OurSynth
        </div>
        <div className={styles.tagline}>Universal Knowledge Compiler</div>
        
        <nav>
          <div className={`${styles.navItem} ${styles.navItemActive}`}>
            <span>📊</span>
            Dashboard
          </div>
          <div className={styles.navItem}>
            <span>📝</span>
            Notes
          </div>
          <div className={styles.navItem}>
            <span>📓</span>
            Notebooks
          </div>
          <a href="/shell/studio" className={styles.navItem}>
            <span>🎨</span>
            Studio
            <span className={styles.aiTag}>AI</span>
          </a>
          <div className={styles.navItem}>
            <span>🌀</span>
            Aether
          </div>
          <a href="/shell/capsules" className={styles.navItem}>
            <span>💊</span>
            Capsules
            <span className={styles.marketplaceTag}>$</span>
          </a>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <span>🏠 Dashboard</span>
          <span className={styles.cloudBadge}>Powered by Google Cloud AI</span>
        </div>
        <h1 className={styles.title}>Knowledge Compiler Dashboard</h1>
        <p className={styles.description}>
          Transform any file, scan, or image into structured, queryable, and monetizable knowledge. 
          Built on Google Cloud's advanced AI stack with Vertex AI and Gemini models.
        </p>
        
        <div className={styles.quickActions}>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>🔄</div>
            <h3>Ingest Documents</h3>
            <p>Upload files for OCR and structuring</p>
          </div>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>🧠</div>
            <h3>Generate Capsules</h3>
            <p>Create monetizable knowledge assets</p>
          </div>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>🚀</div>
            <h3>Deploy Workflows</h3>
            <p>Launch on Google Cloud infrastructure</p>
          </div>
        </div>
        
        <ArchitectureCard />
      </div>
    </div>
  );
}