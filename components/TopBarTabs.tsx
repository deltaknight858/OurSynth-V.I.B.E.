
import React from "react";
import { useRouter } from "next/router";
import styles from "./TopBarTabs.module.css";

const tabs = [
  { label: "Dashboard", path: "/" },
  { label: "Agents", path: "/agents" },
  { label: "Capsules", path: "/capsules" },
  { label: "Brand System", path: "/brand-system" },
  { label: "Design System", path: "/design-system" },
  { label: "Blueprints", path: "/blueprints" },
  { label: "Commerce Hub", path: "/commerce-hub" },
  { label: "Glossary", path: "/glossary" },
  { label: "Settings", path: "/settings" },
];

export default function TopBarTabs() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className={styles["tab-bar"]}>
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={
            currentPath === tab.path
              ? `${styles.tab} ${styles.active}`
              : styles.tab
          }
          onClick={() => router.push(tab.path)}
        >
          {tab.label}
          {/* Uncomment below for close button: */}
          {/* <button title="Close tab">×</button> */}
        </div>
      ))}
    </div>
  );
}
