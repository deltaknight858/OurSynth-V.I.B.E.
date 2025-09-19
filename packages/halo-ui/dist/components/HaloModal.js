"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaloModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const clsx_1 = __importDefault(require("clsx"));
const SemanticIcons_1 = require("./icons/SemanticIcons");
const HaloModal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true, className }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };
    react_1.default.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: (0, clsx_1.default)('relative w-full rounded-lg bg-slate-900/90 backdrop-blur-lg border border-slate-300/20 shadow-2xl', sizeClasses[size], className), children: [(title || showCloseButton) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-slate-300/20", children: [title && (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-slate-200", children: title }), showCloseButton && ((0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-1 rounded-lg hover:bg-slate-700/50 transition-colors", children: (0, jsx_runtime_1.jsx)(SemanticIcons_1.CloseIcon, { size: 20 }) }))] })), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: children })] })] })) }));
};
exports.HaloModal = HaloModal;
