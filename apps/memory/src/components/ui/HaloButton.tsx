import React from "react";
import clsx from "clsx";

export interface HaloButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "solid" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const HaloButton: React.FC<HaloButtonProps> = ({
  variant = "ghost",
  size = "md",
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "ghost" && "bg-transparent hover:bg-gray-100",
        variant === "solid" && "bg-primary text-white hover:bg-primary-dark",
        variant === "outline" && "border border-primary text-primary hover:bg-primary/10",
        size === "sm" && "px-2 py-1 text-xs rounded",
        size === "md" && "px-3 py-1.5 text-sm rounded-md",
        size === "lg" && "px-4 py-2 text-base rounded-lg",
        "halo-effect",
        className
      )}
    >
      <span className="z-10">{children}</span>
      <span className="absolute inset-0 pointer-events-none rounded-md border border-primary opacity-20"></span>
    </button>
  );
};

// Optional: Add halo-effect styles to your CSS
// .halo-effect {
//   box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
// }
