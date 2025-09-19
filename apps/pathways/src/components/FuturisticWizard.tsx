"use client";

import React from "react";
import { motion } from "framer-motion";

type Step = { 
  title: string; 
  content: React.ReactNode; 
};

type Props = { 
  steps: Step[]; 
  initialStep?: number;
  onStepChange?: (step: number) => void;
  isStepValid?: (step: number) => boolean;
};

export const FuturisticWizard: React.FC<Props> = ({ 
  steps, 
  initialStep = 0, 
  onStepChange,
  isStepValid = () => true 
}) => {
  const [i, setI] = React.useState(initialStep);
  const last = steps.length - 1;

  const handleStepChange = (newStep: number) => {
    setI(newStep);
    onStepChange?.(newStep);
  };

  const canProceed = isStepValid(i);
  const isLastStep = i === last;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl p-6 md:p-8">
        {/* Stepper */}
        <div className="relative mb-8">
          <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-slate-700" />
          <motion.div
            className="absolute left-6 top-1/2 h-0.5 -translate-y-1/2 bg-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${(i / Math.max(last, 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ 
              right: `calc(100% - ${(i / Math.max(last, 1)) * 100}% - 1.5rem)` 
            }}
          />
          <div className="flex justify-between">
            {steps.map((s, idx) => {
              const state = idx < i ? "done" : idx === i ? "active" : "future";
              return (
                <button
                  key={s.title}
                  onClick={() => handleStepChange(idx)}
                  className="grid place-items-center gap-1 group"
                  disabled={idx > i + 1} // Allow clicking current, previous, or next step
                >
                  <motion.div
                    className={[
                      "w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                      state === "done" && "bg-cyan-500/40 border-cyan-300 shadow-cyan-500/50 shadow-lg",
                      state === "active" && "bg-cyan-400/30 border-cyan-300 shadow-cyan-400/60 shadow-xl",
                      state === "future" && "bg-slate-800 border-slate-600 group-hover:border-slate-500",
                    ].join(" ")}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {state === "done" && (
                      <motion.svg 
                        className="w-4 h-4 text-cyan-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                    )}
                  </motion.div>
                  <span className={[
                    "text-xs transition-colors duration-300",
                    state === "active" ? "text-cyan-300" : "text-slate-400"
                  ].join(" ")}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content with transitions */}
        <div className="relative min-h-96">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {steps[i].content}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            className={[
              "relative inline-flex items-center justify-center px-5 py-2 font-medium tracking-wide",
              "bg-slate-800 border border-slate-600 text-cyan-200 rounded-lg",
              "hover:text-white hover:bg-slate-700 hover:border-slate-500 transition-all duration-200",
              "hover:shadow-lg hover:shadow-cyan-500/20",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800"
            ].join(" ")}
            disabled={i === 0}
            onClick={() => handleStepChange(Math.max(0, i - 1))}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Step {i + 1} of {steps.length}
            </span>
          </div>

          <button
            className={[
              "relative inline-flex items-center justify-center px-5 py-2 font-medium tracking-wide",
              "bg-slate-800 border border-slate-600 text-cyan-200 rounded-lg",
              "hover:text-white hover:bg-slate-700 hover:border-slate-500 transition-all duration-200",
              "hover:shadow-lg hover:shadow-cyan-500/20",
              (!canProceed && isLastStep) && "opacity-40 cursor-not-allowed"
            ].join(" ")}
            disabled={!canProceed && isLastStep}
            onClick={() => {
              if (isLastStep) {
                // Handle finish action
                console.log("Wizard completed!");
              } else {
                handleStepChange(Math.min(last, i + 1));
              }
            }}
          >
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuturisticWizard;
