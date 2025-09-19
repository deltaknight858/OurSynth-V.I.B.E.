import React from "react";
import Link from "next/link";
import styles from "./Shell.module.css";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: "/icon-dashboard.svg" },
  { href: "/notes", label: "Notes", icon: "/icon-notes.svg" },
  { href: "/notebooks", label: "Notebooks", icon: "/icon-notes.svg" },
  { href: "/studio", label: "Studio", icon: "/icon-studio.svg" },
  { href: "/aether", label: "Aether", icon: "/icon-studio.svg" },
  { href: "/capsules", label: "Capsules", icon: "/icon-dashboard.svg" },
  { href: "/provenance", label: "Provenance", icon: "/icon-dashboard.svg" },
  { href: "/assets", label: "Assets", icon: "/icon-dashboard.svg" },
  { href: "/components", label: "Components", icon: "/icon-dashboard.svg" },
  { href: "/settings", label: "Settings", icon: "/icon-settings.svg" }
];

export default function Shell({ children }) {
  return (
    <div className={styles.shellRoot}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <div className={styles.topbarContent}>
          <span className={styles.brand}>
            <img src="/logo.svg" alt="OurSynth Logo" className={styles.logo} />
            OurSynth
          </span>
          <nav className={styles.topnav}>
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.sidebarLink}>
                <img src={item.icon} alt="" className={styles.icon} />
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
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.sidebarLink}>
                <img src={item.icon} alt="" className={styles.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
