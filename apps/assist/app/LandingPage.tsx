
import Image from "next/image";

import React from "react";
import styles from "./LandingPage.module.css";
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
          <a href="#studio" className={styles.ctaButtonSm}>
            Enter Studio
          </a>
        </nav>
      </header>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Build at the Speed of Thought</h1>
            <p className={styles.heroSubtitle}>
              From idea to deployed app in minutes — with AI that remembers, adapts, and ships for you.
            </p>
            <div className={styles.heroCta}>
              <a href="#studio" className={styles.ctaButtonLg}>
                Begin Your Synthesis
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
              The conversational IDE. A creative hub to compose, edit, and orchestrate your
              applications with AI.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧭</div>
            <h2>Pathways</h2>
            <p>
              The generative core. Use templates and natural language to scaffold entire features in
              seconds.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧠</div>
            <h2>NoteFlow</h2>
            <p>
              Intelligent memory capsules that let your apps learn, adapt, and carry context
              anywhere.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h2>Deploy</h2>
            <p>
              The shipping pipeline. One-click, automated builds and deployments to your preferred
              environment.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏳</div>
            <h2>Capsules</h2>
            <p>
              The time machine. Create signed, portable, and replayable application bundles with
              built-in provenance.
            </p>
            <a className={styles.learnMore} href="#">
              Learn More
            </a>
          </div>
        </section>

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
