
import Image from "next/image";

import styles from "./LandingPage.module.css";
import InteractiveDemo from "./InteractiveDemo";
// Optionally import a mindmap visual here in the future

export default function LandingPage() {
  return (
    <div className={styles.landingRoot}>
      <div className={styles.backgroundGlow} />
      <header className={styles.header}>
        <div className={styles.logo}>OurSynth</div>
        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#docs">Docs</a>
          <a href="/shell" className={styles.ctaButtonSm}>
            Enter Studio
          </a>
        </nav>
      </header>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.tagline}>Universal Knowledge Compiler</div>
            <h1 className={styles.heroTitle}>Transform Any File Into Structured Knowledge</h1>
            <p className={styles.heroSubtitle}>
              OurSynth is the AI-first platform that turns your files, scans, and images into queryable, 
              monetizable knowledge assets. Built on Google Cloud's advanced AI stack.
            </p>
            <div className={styles.heroCta}>
              <a href="/shell" className={styles.ctaButtonLg}>
                Enter Studio
              </a>
            </div>
            <form
              className={styles.waitlistForm}
              onSubmit={(e) => {
                e.preventDefault();
                /* TODO: handle submit */
              }}
            >
              <input type="email" placeholder="Your email" required />
              <button type="submit">Join the Waitlist</button>
            </form>
          </div>
        </section>
        <section id="features" className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧑‍💻</div>
            <h2>Studio</h2>
            <p>
              Conversational IDE powered by generative AI. Directly aligns with Vertex AI Agent Builder 
              for natural language development workflows.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧭</div>
            <h2>Pathways</h2>
            <p>
              Natural language scaffolding that showcases Gemini APIs for rapid prototyping. 
              Transform intentions into structured development paths.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧠</div>
            <h2>NoteFlow</h2>
            <p>
              Memory capsules provide persistent context layers, ideal for BigQuery and Cloud Storage 
              integration. Long-term knowledge retention for AI agents.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h2>Deploy</h2>
            <p>
              One-click builds that run seamlessly on Cloud Run and Google Kubernetes Engine. 
              Automated CI/CD with Google Cloud infrastructure.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💊</div>
            <h2>Capsules</h2>
            <p>
              Portable, replayable bundles monetizable via knowledge marketplace. 
              Revenue-generating digital assets with built-in provenance.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
        </section>

        <InteractiveDemo />

        <section className={styles.socialProof}>
          <div className={styles.builtWith}>
            <span>Built with</span>
            <Image src="/next.svg" alt="Next.js" height={24} width={24} />
            <Image src="/vercel.svg" alt="Vercel" height={24} width={24} />
            <Image src="/tailwind.svg" alt="Tailwind CSS" height={24} width={24} />
            <span className={styles.cyanAccent}>and OurSynth magic</span>
          </div>
          <blockquote className={styles.founderQuote}>
            <span>
              “OurSynth is where ideas become living, learning software. We’re building the future
              of creative automation.”
            </span>
            <cite>— The OurSynth Team</cite>
          </blockquote>
        </section>

        <section className={styles.pricingPreview}>
          <h3>Pricing Preview</h3>
          <div className={styles.pricingTiers}>
            <div className={styles.tier}>
              <strong>Free</strong>
              <span>Get started, explore, and build.</span>
            </div>
            <div className={styles.tier}>
              <strong>Pro</strong>
              <span>Advanced features, more memory, priority support.</span>
            </div>
            <div className={styles.tier}>
              <strong>Enterprise</strong>
              <span>Custom integrations, SLAs, and white-glove onboarding.</span>
            </div>
          </div>
          <div className={styles.comingSoon}>Coming Soon</div>
        </section>

        <section className={styles.marketplaceTeaser}>
          <h3>Marketplace</h3>
          <p>Soon: Buy and sell Capsules, workflows, and memory packs.</p>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2025 OurSynth Labs. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
