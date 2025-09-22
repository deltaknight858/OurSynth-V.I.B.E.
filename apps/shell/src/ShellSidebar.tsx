import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HaloIcon } from "halo-ui";
import { SidebarNavItem } from "halo-ui";
import { icons } from "../../brand/sidebar-icons"; // You'd define these SVGs or halo-ui icons

const navItems = [
  { label: "Studio", icon: icons.studio, route: "/studio" },
  { label: "Pathways", icon: icons.pathways, route: "/pathways" },
  { label: "Orchestrator", icon: icons.orchestrator, route: "/orchestrator" },
  { label: "MeshSim", icon: icons.meshsim, route: "/mesh-sim" },
  { label: "Provenance", icon: icons.provenance, route: "/provenance" },
  { label: "Capsule", icon: icons.capsule, route: "/capsule" },
  { label: "Command Center", icon: icons.commandcenter, route: "/command-center" },
  { label: "Agents", icon: icons.agents, route: "/agents" },
  // Existing apps
  { label: "Taskflow", icon: icons.taskflow, route: "/taskflow" },
  { label: "Noteflow", icon: icons.noteflow, route: "/noteflow" },
];

export const ShellSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="halo-sidebar bg-shell shadow-lg border-r border-shell-accent">
      <ul>
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.route}
            icon={<HaloIcon icon={item.icon} />}
            active={location.pathname.startsWith(item.route)}
          >
            <Link to={item.route}>{item.label}</Link>
          </SidebarNavItem>
        ))}
      </ul>
    </nav>
  );
};