import styles from './ArchitectureCard.module.css';

export default function ArchitectureCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Technical Architecture</h3>
      <p className={styles.subtitle}>Google Cloud AI Stack Alignment</p>
      
      <div className={styles.layers}>
        <div className={`${styles.layer} ${styles.distribution}`}>
          <div className={styles.layerTitle}>Distribution Layer</div>
          <div className={styles.tech}>Capsules + Marketplace → Cloud Run</div>
        </div>
        
        <div className={`${styles.layer} ${styles.synthesis}`}>
          <div className={styles.layerTitle}>Synthesis Layer</div>
          <div className={styles.tech}>AI Agents → Vertex AI + Gemini Models</div>
        </div>
        
        <div className={`${styles.layer} ${styles.structuring}`}>
          <div className={styles.layerTitle}>Structuring Layer</div>
          <div className={styles.tech}>Markdown Schema + Embeddings → BigQuery</div>
        </div>
        
        <div className={`${styles.layer} ${styles.ingestion}`}>
          <div className={styles.layerTitle}>Ingestion Layer</div>
          <div className={styles.tech}>OCR + MarkItDown → Cloud Functions</div>
        </div>
      </div>
      
      <div className={styles.benefits}>
        <div className={styles.benefit}>
          <span className={styles.icon}>🚀</span>
          <span>Scalable</span>
        </div>
        <div className={styles.benefit}>
          <span className={styles.icon}>🤖</span>
          <span>AI-First</span>
        </div>
        <div className={styles.benefit}>
          <span className={styles.icon}>☁️</span>
          <span>Cloud-Native</span>
        </div>
        <div className={styles.benefit}>
          <span className={styles.icon}>💰</span>
          <span>Monetizable</span>
        </div>
      </div>
    </div>
  );
}