"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaloCheckbox = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const clsx_1 = __importDefault(require("clsx"));
const HaloCheckbox = ({ checked = false, onChange, disabled = false, label, size = 'md', variant = 'default', className, id }) => {
    const checkboxId = id || react_1.default.useId();
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };
    const switchSizeClasses = {
        sm: 'w-8 h-4',
        md: 'w-10 h-5',
        lg: 'w-12 h-6'
    };
    const thumbSizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };
    if (variant === 'switch') {
        return ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)('flex items-center gap-2', className), children: [(0, jsx_runtime_1.jsx)("button", { type: "button", role: "switch", "aria-checked": checked, onClick: () => !disabled && onChange?.(!checked), disabled: disabled, className: (0, clsx_1.default)('relative rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50', switchSizeClasses[size], checked
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-slate-600', disabled && 'opacity-50 cursor-not-allowed'), children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: {
                            x: checked ?
                                (size === 'sm' ? 16 : size === 'md' ? 20 : 24) :
                                (size === 'sm' ? 2 : size === 'md' ? 2 : 2)
                        }, transition: { type: 'spring', stiffness: 500, damping: 30 }, className: (0, clsx_1.default)('absolute top-0.5 bg-white rounded-full shadow-sm', thumbSizeClasses[size]) }) }), label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: checkboxId, className: (0, clsx_1.default)('text-sm text-slate-200 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed'), children: label }))] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, clsx_1.default)('flex items-center gap-2', className), children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { type: "button", role: "checkbox", "aria-checked": checked, onClick: () => !disabled && onChange?.(!checked), disabled: disabled, whileTap: !disabled ? { scale: 0.95 } : undefined, className: (0, clsx_1.default)('relative rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50', sizeClasses[size], checked
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-500'
                    : 'bg-transparent border-slate-400 hover:border-slate-300', disabled && 'opacity-50 cursor-not-allowed'), children: checked && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.svg, { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, transition: { duration: 0.15 }, className: "w-full h-full text-white", fill: "none", stroke: "currentColor", strokeWidth: "3", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) })) }), label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: checkboxId, className: (0, clsx_1.default)('text-sm text-slate-200 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed'), children: label }))] }));
};
exports.HaloCheckbox = HaloCheckbox;
exports.HaloCheckbox.displayName = 'HaloCheckbox';
