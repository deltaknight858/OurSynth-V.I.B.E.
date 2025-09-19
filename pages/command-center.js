


import React, { useState, useRef, useEffect } from "react";
import fs from "fs";
import path from "path";

export async function getStaticProps() {
  const dirPath = path.join(process.cwd(), "public/np");
  const files = fs.readdirSync(dirPath);

  const corePages = [
    { slug: "", label: "Home" },
    { slug: "workspace", label: "Workspace" },
    { slug: "history", label: "History" },
    { slug: "command-center", label: "Command Center" },
    { slug: "about", label: "About" },
  ];

  // All HTML files in /public/np
  const allSlugs = files
    .filter((file) => file.endsWith(".html"))
    .map((file) => file.replace(".html", ""));

  // Dynamic pages = all minus core
  const dynamicPages = allSlugs
    .filter((slug) => !corePages.some((p) => p.slug === slug))
    .map((slug) => ({
      slug,
      label: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    }));

  const pages = [
    ...corePages,
    ...dynamicPages,
  ];

  return { props: { pages } };
}

export default function CommandCenter({ pages }) {
  const [previewSlug, setPreviewSlug] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);
  const closeBtnRef = useRef(null);
  const overlayRef = useRef(null);

  const handleRefresh = () => setIframeKey((k) => k + 1);

  // Close on ESC and trap focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewSlug(null);
      }
      // Trap focus inside overlay
      if (e.key === "Tab" && overlayRef.current && previewSlug !== null) {
        const focusableEls = overlayRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [previewSlug]);

  // Auto-focus close button when overlay opens
  useEffect(() => {
    if (previewSlug !== null && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [previewSlug]);

  const showRefresh = process.env.NODE_ENV === "development" || process.env.ALLOW_REFRESH === "true";

  return (
    <BaseLayout title="OurSynth Command Center">
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        🚀 OurSynth Command Center
      </h1>
      {showRefresh && (
        <button
          onClick={async () => {
            const res = await fetch("/api/refresh-previews", { method: "POST" });
            const data = await res.json();
            alert(data.message || data.error);
          }}
          style={{
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            background: "rgba(0,255,255,0.1)",
            border: "1px solid rgba(0,255,255,0.5)",
            borderRadius: "8px",
            color: "#0ff",
            cursor: "pointer",
          }}
        >
          🔄 Refresh Previews
        </button>
      )}
      <div className="cc-grid">
        {pages.map(({ slug, label }) => (
          <button
            key={slug || "home"}
            className="cc-card"
            onClick={() => setPreviewSlug(slug)}
          >
            <Image
              src={`/previews/${slug || "home"}.jpg`}
              alt={`${label} thumbnail`}
              width={400}
              height={220}
              className="cc-img"
            />
            <span className="cc-label">{label}</span>
          </button>
        ))}
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`cc-overlay${previewSlug !== null ? " active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Live page preview"
        style={{ display: previewSlug !== null ? "flex" : "none" }}
      >
        {previewSlug && (
          <div className="cc-overlay-content">
            <button
              ref={closeBtnRef}
              className="cc-close"
              onClick={() => setPreviewSlug(null)}
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="cc-toolbar">
              <span className="cc-toolbar-label">
                Preview: {pages.find((p) => p.slug === previewSlug)?.label || "Home"}
              </span>
              <button className="cc-refresh" onClick={handleRefresh} aria-label="Refresh preview">
                ⟳ Refresh
              </button>
            </div>
            <iframe
              key={iframeKey}
              src={`/${previewSlug}`}
              title={`Live preview of ${previewSlug || "home"}`}
              className="cc-iframe"
            />
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
