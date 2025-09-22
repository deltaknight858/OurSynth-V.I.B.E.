import React from "react";

export const HaloCard: React.FC<{ className?: string, children: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`halo-card rounded-xl bg-[#232b3a] shadow p-4 ${className}`}>
    {children}
  </div>
);