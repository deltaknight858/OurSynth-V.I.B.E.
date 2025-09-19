"use client";
import React from 'react';
import './ui.css';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function DashboardLayout({ title, children }: Props) {
  return (
    <div className="dashboardLayout">
      {title && <h1 className="dashboardTitle">{title}</h1>}
      {children}
    </div>
  );
}

export default DashboardLayout;
