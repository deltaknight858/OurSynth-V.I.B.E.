import React from "react";

export default function RightPanel({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="right-panel">
      {children}
    </aside>
  );
}
