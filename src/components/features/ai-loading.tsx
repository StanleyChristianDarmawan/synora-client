import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const agentTasks = [
  "Awakening Synora core...",
  "Extracting key themes...",
  "Analyzing emotional trends...",
  "Detecting risk patterns...",
  "Formulating reflection...",
  "Finalizing suggestions..."
];

export function AILoadingIndicator({ className = "" }: { className?: string }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < agentTasks.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full max-w-sm mx-auto flex flex-col items-center justify-center space-y-6 py-6 ${className}`}>
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-16 h-16 bg-teal-200/50 rounded-full blur-xl"
        />
        <div className="relative bg-white p-3 rounded-2xl shadow-sm border border-teal-100 text-teal-600">
          <BrainCircuit className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <div className="w-full space-y-3">
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / agentTasks.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="h-6 relative overflow-hidden flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-medium text-zinc-500 absolute text-center"
            >
              {agentTasks[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
