import React from "react";

type HaloButtonProps = {
  size?: "sm" | "md";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export const HaloButton: React.FC<HaloButtonProps> = ({ size = "md", onClick, children, className = "" }) => (
  <button
    className={`halo-btn px-4 py-2 rounded bg-[#4683ff] text-white font-semibold shadow hover:bg-[#305fd8] transition ${size === "sm" ? "text-xs" : "text-base"} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);