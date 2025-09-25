'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NextArrowButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const NextArrowButton: React.FC<NextArrowButtonProps> = ({
  onClick,
  disabled = false,
  label = "Next step",
  className = ""
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        relative w-16 h-16 rounded-full 
        bg-gradient-to-r from-indigo-500 to-purple-500 
        ring-4 ring-indigo-400/50 
        hover:ring-indigo-400 
        focus:outline-none focus:ring-4 focus:ring-indigo-300
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        hover:shadow-xl hover:scale-105
        ${className}
      `}
      whileHover={!disabled ? { 
        scale: 1.1,
        boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)"
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={!disabled ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        boxShadow: { duration: 0.3 }
      }}
    >
      {/* Pulsing background effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75"
        animate={!disabled ? {
          scale: [1, 1.2, 1],
          opacity: [0.75, 0.3, 0.75]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Arrow SVG */}
      <motion.svg
        className="w-6 h-6 text-white relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        whileHover={!disabled ? { x: 2 } : {}}
        transition={{ duration: 0.2 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </motion.svg>
    </motion.button>
  );
};

export default NextArrowButton;
