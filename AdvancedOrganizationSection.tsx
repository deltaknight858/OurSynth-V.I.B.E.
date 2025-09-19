"use client";

import React from "react";
import { HaloButton } from "@/components/system/HaloButton";
import { SuccessIcon } from "@/components/icons";
// Temporary fallback until ExternalLinkIcon is added to the icon set
const ExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M10 2h4v4h-2V4.41L8.7 7.7 7.3 6.3 10.59 3H10V2z"/>
    <path fill="currentColor" d="M14 9v5H1V2h5v2H3v8h8V9h3z"/>
  </svg>
);

export function AdvancedOrganizationSection() {
  return (
    <section id="advanced-organization" className="layout-edge py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Organization</p>
            <h1 className="mb-5 font-bold md:mb-6 text-[var(--font-size-4xl)] leading-tight">
              Effortless Organization with Notebooks and Sections
            </h1>
            <p className="mb-5 md:mb-6 text-secondary text-[var(--font-size-md)]">
              Stay organized with our advanced hierarchical structure. Create
              notebooks, sections, and folders to categorize your notes
              intuitively.
            </p>
            <ul className="grid grid-cols-1 gap-4 py-2">
              <li className="flex self-start">
                <div className="mr-4 flex-none self-start text-[var(--color-accent-primary)]"><SuccessIcon size={20} /></div>
                <span>Easily manage your notes with customizable folders.</span>
              </li>
              <li className="flex self-start">
                <div className="mr-4 flex-none self-start text-[var(--color-accent-primary)]"><SuccessIcon size={20} /></div>
                <span>Organize your thoughts with dedicated sections.</span>
              </li>
              <li className="flex self-start">
                <div className="mr-4 flex-none self-start text-[var(--color-accent-primary)]"><SuccessIcon size={20} /></div>
                <span>
                  Simplify your workflow with intuitive notebook management.
                </span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <HaloButton variant="secondary">Learn More</HaloButton>
              <HaloButton variant="ghost">
                Sign Up <ExternalLinkIcon className="inline ml-1 h-4 w-4" />
              </HaloButton>
            </div>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full object-cover"
              alt="Abstract representation of organized notes and sections"
            />
          </div>
        </div>
      </div>
    </section>
  );
}