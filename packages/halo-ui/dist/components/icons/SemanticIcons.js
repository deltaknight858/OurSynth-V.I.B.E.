"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlusIcon = exports.ChevronIcon = exports.LoadingIcon = exports.CloseIcon = exports.SettingsIcon = exports.CheckboxIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const CheckboxIcon = ({ size = 20, className, color = 'primary', checked = false }) => {
    const colorClasses = {
        primary: 'border-cyan-500 bg-cyan-500/20',
        secondary: 'border-purple-500 bg-purple-500/20',
        success: 'border-green-500 bg-green-500/20',
        warning: 'border-yellow-500 bg-yellow-500/20',
        error: 'border-red-500 bg-red-500/20'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('inline-flex items-center justify-center rounded border-2 transition-all duration-200', checked ? colorClasses[color] : 'border-slate-400 bg-transparent', className), style: { width: size, height: size }, children: checked && ((0, jsx_runtime_1.jsx)("svg", { width: "60%", height: "60%", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: (0, jsx_runtime_1.jsx)("path", { d: "M20 6L9 17l-5-5" }) })) }));
};
exports.CheckboxIcon = CheckboxIcon;
const SettingsIcon = ({ size = 24, className, color = 'primary' }) => {
    const colorClasses = {
        primary: 'text-cyan-400',
        secondary: 'text-purple-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('inline-flex items-center justify-center', colorClasses[color], className), style: { width: size, height: size }, children: (0, jsx_runtime_1.jsxs)("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "12", r: "3" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" })] }) }));
};
exports.SettingsIcon = SettingsIcon;
const CloseIcon = ({ size = 24, className, color = 'primary' }) => {
    const colorClasses = {
        primary: 'text-cyan-400',
        secondary: 'text-purple-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('inline-flex items-center justify-center', colorClasses[color], className), style: { width: size, height: size }, children: (0, jsx_runtime_1.jsxs)("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0, jsx_runtime_1.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), (0, jsx_runtime_1.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) }));
};
exports.CloseIcon = CloseIcon;
const LoadingIcon = ({ size = 24, className, color = 'primary' }) => {
    const colorClasses = {
        primary: 'text-cyan-400',
        secondary: 'text-purple-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('inline-flex items-center justify-center animate-spin', colorClasses[color], className), style: { width: size, height: size }, children: (0, jsx_runtime_1.jsx)("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: (0, jsx_runtime_1.jsx)("path", { d: "M21 12a9 9 0 11-6.219-8.56" }) }) }));
};
exports.LoadingIcon = LoadingIcon;
const ChevronIcon = ({ size = 24, className, color = 'primary', direction = 'right' }) => {
    const colorClasses = {
        primary: 'text-cyan-400',
        secondary: 'text-purple-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };
    const rotationClasses = {
        up: 'rotate-[-90deg]',
        down: 'rotate-90',
        left: 'rotate-180',
        right: 'rotate-0'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('inline-flex items-center justify-center', colorClasses[color], rotationClasses[direction], className), style: { width: size, height: size }, children: (0, jsx_runtime_1.jsx)("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: (0, jsx_runtime_1.jsx)("polyline", { points: "9,18 15,12 9,6" }) }) }));
};
exports.ChevronIcon = ChevronIcon;
const PlusIcon = ({ size = 24, className, color = 'primary' }) => {
    const colorClasses = {
        primary: 'text-cyan-400',
        secondary: 'text-purple-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('inline-flex items-center justify-center', colorClasses[color], className), style: { width: size, height: size }, children: (0, jsx_runtime_1.jsxs)("svg", { width: "100%", height: "100%", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), (0, jsx_runtime_1.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }) }));
};
exports.PlusIcon = PlusIcon;
