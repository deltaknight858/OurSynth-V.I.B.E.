import React, { useState } from "react";
import "./RadialCommandCenter.css";

export interface CommandAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface RadialCommandCenterProps {
  actions: CommandAction[];
  centerIcon?: React.ReactNode;
}

export const RadialCommandCenter: React.FC<RadialCommandCenterProps> = ({
  actions,
  centerIcon,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`command-wheel-container${open ? " is-open" : ""}`}>
      <div className="command-wheel" aria-hidden={!open}>
        {actions.map((action, i) => (
          <button
            key={action.label}
            className="wheel-item glass"
            style={{ ["--i" as any]: i } as React.CSSProperties}
            title={action.label}
            aria-label={action.label}
            tabIndex={open ? 0 : -1}
            onClick={action.onClick}
          >
            {action.icon}
          </button>
        ))}
      </div>
      <button
        className="command-wheel-toggle glass"
        aria-label="Toggle Command Wheel"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((o) => !o)}
      >
        {centerIcon || <span>☰</span>}
      </button>
    </div>
  );
};

export default RadialCommandCenter;
