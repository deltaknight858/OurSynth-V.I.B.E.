"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaloCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const HaloCard = ({ variant = 'glass', glow = 'none', children, className, ...props }) => {
    const baseClasses = 'relative rounded-lg transition-all duration-300 ease-out';
    const variantClasses = {
        glass: 'bg-slate-900/20 backdrop-blur-lg border border-slate-300/20 shadow-lg',
        elevated: 'bg-slate-900/40 border border-slate-300/10 shadow-xl',
        minimal: 'bg-transparent border border-slate-300/10'
    };
    const glowClasses = {
        primary: 'hover:shadow-cyan-500/20 hover:shadow-xl hover:border-cyan-500/30',
        secondary: 'hover:shadow-purple-500/20 hover:shadow-xl hover:border-purple-500/30',
        none: ''
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, clsx_1.default)(baseClasses, variantClasses[variant], glowClasses[glow], className), ...props, children: children }));
};
exports.HaloCard = HaloCard;
exports.HaloCard.displayName = 'HaloCard';
