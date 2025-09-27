import React from "react";

export default function TopTabs({ tabs, activeTab, onSelect, onClose }: {
  tabs: string[];
  activeTab: string;
  onSelect: (tab: string) => void;
  onClose: (tab: string) => void;
}) {
  return (
    <div className="top-tabs">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`top-tab${tab === activeTab ? " active" : ""}`}
          onClick={() => onSelect(tab)}
        >
          {tab}
          <button className="close-tab" onClick={(e) => { e.stopPropagation(); onClose(tab); }}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
