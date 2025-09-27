import React from "react";
import { Sidebar as HaloSidebar } from "@oursynth/halo-ui";
import docsIndex from "../docsIndex.json";

export default function Sidebar({ onSelect }: { onSelect: (path: string) => void }) {
  // Recursively render sidebar items
  function renderItems(items: any[]) {
    return items.map((item) => {
      if (item.type === "folder") {
        return (
          <div key={item.name}>
            <div className="sidebar-folder">{item.name}</div>
            <div className="sidebar-folder-children">{renderItems(item.children)}</div>
          </div>
        );
      }
      return (
        <div key={item.path} className="sidebar-file" onClick={() => onSelect(item.path)}>
          {item.name}
        </div>
      );
    });
  }

  return <HaloSidebar>{renderItems(docsIndex.sections)}</HaloSidebar>;
}
