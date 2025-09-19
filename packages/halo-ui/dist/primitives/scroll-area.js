"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollArea = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ScrollArea = ({ height = 240, children }) => {
    const styleVar = typeof height === 'number' ? `${height}px` : height;
    // Consumer or global stylesheet should map [data-halo-scroll][data-maxh] to max-height using attribute selectors or a style injection utility.
    return ((0, jsx_runtime_1.jsx)("div", { className: "halo-scroll-area", "data-halo-scroll": true, "data-maxh": styleVar, children: children }));
};
exports.ScrollArea = ScrollArea;
