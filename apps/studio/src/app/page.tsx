import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {/* Hero Section */}
        <div className={styles.glass} style={{ padding: 'var(--spacing-xxl)', textAlign: 'center' }}>
          <h1 className={styles.gradientText} style={{ fontSize: '3.5rem', marginBottom: 'var(--spacing-lg)' }}>
            Welcome to OurSynth
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.2rem', 
            maxWidth: '600px',
            margin: '0 auto var(--spacing-xl)'
          }}>
            Build, collaborate, and share projects with our powerful platform. Create applications, workflows, and solutions with an intuitive drag-and-drop interface.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/studio" 
              className={styles.accentGlow}
              style={{
                background: 'var(--accent-color)',
                color: 'var(--background-primary)',
                padding: 'var(--spacing-md) var(--spacing-xl)',
                borderRadius: 'var(--glass-border-radius)',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'var(--transition-normal)',
                boxShadow: 'var(--shadow-glow)'
              }}>
              Start Building
            </Link>
            
            <Link href="/templates" 
              className={styles.glassInteractive}
              style={{
                background: 'var(--glass-background)',
                color: 'var(--text-primary)',
                padding: 'var(--spacing-md) var(--spacing-xl)',
                borderRadius: 'var(--glass-border-radius)',
                border: 'var(--glass-border)',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'var(--transition-normal)'
              }}>
              Browse Templates
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>Visual Development</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Build applications using our intuitive drag-and-drop interface. No coding required.</p>
          </div>
          <div className={styles.card}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>Smart Templates</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Get started quickly with pre-built templates for common use cases and workflows.</p>
          </div>
          <div className={styles.card}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>Real-time Collaboration</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Work together with your team in real-time. Share, edit, and deploy projects seamlessly.</p>
          </div>
          <div className={styles.card}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>Custom Components</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Create and share reusable components within your organization.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
