"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaloSelect = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const clsx_1 = __importDefault(require("clsx"));
const HaloSelect = ({ options, value, onChange, placeholder = 'Select an option...', variant = 'glass', size = 'md', disabled = false, error = false, label, className }) => {
    const [isOpen, setIsOpen] = react_1.default.useState(false);
    const selectId = react_1.default.useId();
    const selectedOption = options.find(option => option.value === value);
    const baseClasses = 'relative w-full rounded-lg border cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50';
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    const variantClasses = {
        glass: 'bg-slate-900/20 backdrop-blur-sm border-slate-300/20 focus:border-cyan-500/50',
        elevated: 'bg-slate-900/40 border-slate-300/30 focus:border-cyan-500/60 shadow-sm',
        minimal: 'border-slate-300/30 focus:border-cyan-500/60 hover:border-slate-300/40'
    };
    const errorClasses = error ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/50' : '';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: selectId, className: "block text-sm font-medium text-slate-300 mb-1", children: label })), (0, jsx_runtime_1.jsx)("div", { id: selectId, className: (0, clsx_1.default)(baseClasses, sizeClasses[size], variantClasses[variant], errorClasses, disabled && 'opacity-50 cursor-not-allowed', className), onClick: () => !disabled && setIsOpen(!isOpen), role: "combobox", "aria-expanded": isOpen, "aria-haspopup": "listbox", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, clsx_1.default)(selectedOption ? 'text-slate-200' : 'text-slate-400'), children: selectedOption?.label || placeholder }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.svg, { animate: { rotate: isOpen ? 180 : 0 }, transition: { duration: 0.2 }, className: "w-4 h-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isOpen && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -4, scale: 0.95 }, transition: { duration: 0.15 }, className: "absolute z-50 w-full mt-1 bg-slate-900/90 backdrop-blur-lg border border-slate-300/20 rounded-lg shadow-xl max-h-60 overflow-auto", children: options.map((option) => ((0, jsx_runtime_1.jsx)("button", { className: (0, clsx_1.default)('w-full px-4 py-2 text-left text-sm transition-colors duration-150', 'hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none', option.disabled && 'opacity-50 cursor-not-allowed', option.value === value && 'bg-cyan-500/20 text-cyan-300'), onClick: () => {
                            if (!option.disabled && onChange) {
                                onChange(option.value);
                                setIsOpen(false);
                            }
                        }, disabled: option.disabled, children: option.label }, option.value))) })) }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-40", onClick: () => setIsOpen(false) }))] }));
};
exports.HaloSelect = HaloSelect;
exports.HaloSelect.displayName = 'HaloSelect';
