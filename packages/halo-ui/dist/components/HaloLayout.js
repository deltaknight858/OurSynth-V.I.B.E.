"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaloSection = exports.HaloContainer = exports.HaloLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const HaloLayout = ({ children, variant = 'centered', className }) => {
    const variantClasses = {
        centered: 'flex items-center justify-center min-h-screen p-4',
        sidebar: 'flex min-h-screen',
        split: 'grid grid-cols-1 md:grid-cols-2 min-h-screen',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)(variantClasses[variant], className), children: children }));
};
exports.HaloLayout = HaloLayout;
const HaloContainer = ({ children, size = 'lg', className }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full'
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)('mx-auto w-full px-4', sizeClasses[size], className), children: children }));
};
exports.HaloContainer = HaloContainer;
const HaloSection = ({ children, background = 'transparent', spacing = 'normal', className }) => {
    const backgroundClasses = {
        transparent: 'bg-transparent',
        glass: 'bg-slate-900/20 backdrop-blur-lg border border-slate-300/20 rounded-lg',
        solid: 'bg-slate-900/40 rounded-lg'
    };
    const spacingClasses = {
        tight: 'py-4',
        normal: 'py-8',
        loose: 'py-16'
    };
    return ((0, jsx_runtime_1.jsx)("section", { className: (0, clsx_1.default)(backgroundClasses[background], spacingClasses[spacing], className), children: children }));
};
exports.HaloSection = HaloSection;
