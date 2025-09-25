import React from "react";

export const SidebarNavItem: React.FC<{ icon: React.ReactNode, active?: boolean, children: React.ReactNode }> = ({ icon, active, children }) => (
  <li className={`sidebar-nav-item flex items-center px-4 py-3 cursor-pointer transition ${active ? "bg-[#2e3650] font-bold" : "hover:bg-[#232b3a]"}`}>
    {icon}
    <span>{children}</span>
  </li>
);