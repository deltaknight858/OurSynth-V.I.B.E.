"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaloProgress = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const HaloProgress = ({ value, max = 100, size = 'md', variant = 'linear', color = 'primary', showValue = false, className }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const colorClasses = {
        primary: 'from-cyan-500 to-blue-500',
        secondary: 'from-purple-500 to-pink-500',
        success: 'from-green-500 to-emerald-500',
        warning: 'from-yellow-500 to-orange-500',
        error: 'from-red-500 to-rose-500'
    };
    if (variant === 'circular') {
        const sizeMap = { sm: 40, md: 60, lg: 80 };
        const strokeMap = { sm: 3, md: 4, lg: 5 };
        const circleSize = sizeMap[size];
        const strokeWidth = strokeMap[size];
        const radius = (circleSize - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        return ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)('relative inline-flex items-center justify-center', className), children: [(0, jsx_runtime_1.jsxs)("svg", { width: circleSize, height: circleSize, className: "transform -rotate-90", children: [(0, jsx_runtime_1.jsx)("circle", { cx: circleSize / 2, cy: circleSize / 2, r: radius, stroke: "currentColor", strokeWidth: strokeWidth, fill: "none", className: "text-slate-700" }), (0, jsx_runtime_1.jsx)("circle", { cx: circleSize / 2, cy: circleSize / 2, r: radius, stroke: "url(#gradient)", strokeWidth: strokeWidth, fill: "none", strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, className: "transition-all duration-300 ease-out" }), (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: "gradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", className: `stop-color-cyan-500` }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", className: `stop-color-blue-500` })] }) })] }), showValue && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-slate-200", children: [Math.round(percentage), "%"] }) }))] }));
    }
    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)('relative w-full', className), children: [(0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('w-full bg-slate-700/50 rounded-full overflow-hidden', sizeClasses[size]), children: (0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('h-full bg-gradient-to-r transition-all duration-300 ease-out', colorClasses[color]), style: { width: `${percentage}%` } }) }), showValue && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-1 text-xs text-slate-400 text-right", children: [Math.round(percentage), "%"] }))] }));
};
exports.HaloProgress = HaloProgress;
exports.HaloProgress.displayName = 'HaloProgress';
