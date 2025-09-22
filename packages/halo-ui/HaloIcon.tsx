import React from "react";

export const HaloIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <span className="halo-icon align-middle mr-2">{icon}</span>
);