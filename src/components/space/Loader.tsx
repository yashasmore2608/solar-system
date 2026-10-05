"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Loader() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  const visualProgress = active ? progress : 100;

  useEffect(() => {
    if (!active) {
      const timeout = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
        >
          <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-sm tracking-[0.4em] uppercase font-light text-zinc-400">
              Initializing Solar System
            </h1>
            
            <div className="w-64 h-[1px] bg-zinc-800 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${visualProgress}%` }}
                transition={{ duration: 0.3, ease: "linear" }}
              />
            </div>
            
            <div className="text-xs font-mono text-zinc-600">
              {Math.round(visualProgress)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
