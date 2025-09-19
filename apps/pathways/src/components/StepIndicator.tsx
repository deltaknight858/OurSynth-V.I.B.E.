'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../contexts/WizardContext';

const StepIndicator: React.FC = () => {
  const { state, goToStep } = useWizard();
  const { currentStep } = state;

  const steps = [
    { number: 1, title: 'Template', description: 'Choose your template' },
    { number: 2, title: 'Configure', description: 'Set up your project' },
    { number: 3, title: 'Review', description: 'Confirm details' },
    { number: 4, title: 'Create', description: 'Generate project' },
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'inactive';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return `
          bg-gradient-to-r from-green-500 to-emerald-500 
          text-white ring-2 ring-green-400 
          shadow-lg shadow-green-500/30
        `;
      case 'active':
        return `
          bg-gradient-to-r from-indigo-500 to-purple-500 
          text-white ring-2 ring-indigo-400 
          shadow-lg shadow-indigo-500/50
          animate-pulse
        `;
      default:
        return `
          bg-gray-200 text-gray-500 opacity-50
          ring-1 ring-gray-300
        `;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number);
            const isClickable = step.number <= currentStep;

            return (
              <motion.div
                key={step.number}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step Circle */}
                <motion.button
                  onClick={() => isClickable && goToStep(step.number)}
                  disabled={!isClickable}
                  className={`
                    relative w-12 h-12 rounded-full font-bold text-sm
                    transition-all duration-300 cursor-pointer
                    hover:scale-105 hover:shadow-xl
                    focus:outline-none focus:ring-4 focus:ring-indigo-300
                    disabled:cursor-not-allowed
                    ${getStepClasses(status)}
                  `}
                  whileHover={isClickable ? { 
                    scale: 1.1,
                    boxShadow: status === 'active' 
                      ? "0 0 30px rgba(99, 102, 241, 0.8)" 
                      : "0 0 20px rgba(34, 197, 94, 0.6)"
                  } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  layoutId={`step-${step.number}`}
                >
                  <AnimatePresence mode="wait">
                    {status === 'completed' ? (
                      <motion.svg
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        {step.number}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Glowing ring effect for active step */}
                  {status === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full ring-2 ring-indigo-400"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 0.2, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>

                {/* Step Labels */}
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <h3 className={`
                    text-sm font-semibold mb-1 transition-colors duration-300
                    ${status === 'active' ? 'text-indigo-400' : 
                      status === 'completed' ? 'text-green-400' : 'text-gray-400'}
                  `}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
