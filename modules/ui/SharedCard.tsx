"use client";
import React from 'react';
import './ui.css';

type Props = {
  title?: string;
  children: React.ReactNode;
  sx?: any; // keeping prop for compatibility; ignored here
};

export function SharedCard({ title, children }: Props) {
  return (
    <section className="sharedCard">
      {title && <h2 className="sharedCardTitle">{title}</h2>}
      {children}
    </section>
  );
}

export default SharedCard;
