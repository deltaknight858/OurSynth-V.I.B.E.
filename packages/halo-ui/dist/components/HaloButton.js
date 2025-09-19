"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaloButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const clsx_1 = __importDefault(require("clsx"));
const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed';
const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-3.5 py-2',
    lg: 'text-base px-5 py-3'
};
const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30',
    secondary: 'bg-slate-200/20 backdrop-blur-sm border border-slate-300/30 text-slate-200 hover:bg-slate-200/30 hover:shadow-lg',
    ghost: 'bg-transparent text-slate-200 hover:bg-slate-200/10 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/20 hover:shadow-red-500/30'
};
const HaloButton = ({ variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, children, label, className, disabled, onClick, type = 'button' }) => {
    const content = children ?? label;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileTap: !disabled && !loading ? { scale: 0.97 } : undefined, className: (0, clsx_1.default)(baseStyles, sizeStyles[size], variantStyles[variant], className), "data-variant": variant, "data-size": size, "aria-busy": loading || undefined, disabled: disabled || loading, onClick: onClick, type: type, children: loading ? ((0, jsx_runtime_1.jsx)("span", { className: "animate-pulse", children: "Loading..." })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [leftIcon && (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center", "aria-hidden": true, children: leftIcon }), content && (0, jsx_runtime_1.jsx)("span", { children: content }), rightIcon && (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center", "aria-hidden": true, children: rightIcon })] })) }));
};
exports.HaloButton = HaloButton;
exports.HaloButton.displayName = 'HaloButton';
