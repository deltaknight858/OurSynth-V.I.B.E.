import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopTabs from "./TopTabs";
import RightPanel from "./RightPanel";
import MarkdownRenderer from "./MarkdownRenderer";
import docsIndex from "../doc";
import styles from "./DocsApp.module.css";

export default function DocsApp() {
  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  // Open a doc tab
  const openTab = (path: string) => {
    if (!tabs.includes(path)) {
      setTabs([...tabs, path]);
    }
    setActiveTab(path);
  };

  // Close a doc tab
  const closeTab = (path: string) => {
    const idx = tabs.indexOf(path);
    const newTabs = tabs.filter((t) => t !== path);
    setTabs(newTabs);
    if (activeTab === path) {
      setActiveTab(newTabs[idx - 1] || newTabs[0] || "");
    }
  };

  return (
    <div className={styles["docs-shell"]}>
      <Sidebar onSelect={openTab} />
      <main className={styles["docs-content"]}>
        <TopTabs
          tabs={tabs}
          activeTab={activeTab}
          onSelect={setActiveTab}
          onClose={closeTab}
        />
        <div className={styles["docs-main"]}>
          {activeTab ? (
            <MarkdownRenderer filePath={activeTab} />
          ) : (
            <div className={styles["docs-empty"]}>Select a doc from the sidebar.</div>
          )}
        </div>
      </main>
      <RightPanel>
        {/* Provenance timeline, Capsule Export, Agent Suggestions */}
      </RightPanel>
    </div>
  );
}
