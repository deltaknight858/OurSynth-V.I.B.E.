import React from "react";
import Link from "next/link";
import styles from "./Shell.module.css";

const navigationItems = [
  { href: "/", label: "Dashboard" },
  { href: "/notes", label: "Notes" },
  { href: "/notebooks", label: "Notebooks" },
  { href: "/studio", label: "Studio" },
  { href: "/aether", label: "Aether" },
  { href: "/capsules", label: "Capsules" },
  { href: "/provenance", label: "Provenance" },
  { href: "/assets", label: "Assets" },
  { href: "/components", label: "Components" },
  { href: "/settings", label: "Settings" }
];

export default function Shell({ children }) {
  return (
    <div className={styles.shellRoot}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarContent}>
          <span className={styles.brand}>OurSynth</span>
          <nav className={styles.topnav}>
            {navigationItems.map(item => (
              <Link key={item.href} href={item.href} className={styles.sidebarLink}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {/* Sidebar + Viewport */}
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {navigationItems.map(item => (
              <Link key={item.href} href={item.href} className={styles.sidebarLink}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
