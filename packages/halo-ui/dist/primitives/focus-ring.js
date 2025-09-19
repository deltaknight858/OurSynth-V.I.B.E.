"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusRing = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const FocusRing = ({ inset = false, radius = 6, style, ...rest }) => {
    return (0, jsx_runtime_1.jsx)("div", { "data-halo-focus": true, "data-inset": inset ? 'true' : 'false', "data-radius": radius, className: "halo-focus-ring", ...rest });
};
exports.FocusRing = FocusRing;
// Inject a lightweight style block once (idempotent)
if (typeof document !== 'undefined' && !document.getElementById('halo-focus-ring-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'halo-focus-ring-styles';
    styleEl.textContent = `.halo-focus-ring{position:absolute;pointer-events:none;transition:box-shadow 120ms ease;box-shadow:0 0 0 2px var(--color-accent-primary),0 0 12px 2px rgba(123,0,255,0.5);} .halo-focus-ring[data-inset="false"]{inset:-2px;} .halo-focus-ring[data-inset="true"]{inset:0;} .halo-focus-ring{border-radius:6px;} .halo-focus-ring[data-radius]{border-radius:var(--halo-focus-radius,6px);}`;
    document.head.appendChild(styleEl);
}
exports.FocusRing.displayName = 'FocusRing';
