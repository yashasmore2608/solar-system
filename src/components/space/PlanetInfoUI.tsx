"use client";

import { motion } from "framer-motion";
import { PlanetData } from "@/data/planets";
import { useState } from "react";
import { X } from "lucide-react"; // Shadcn typically uses lucide-react

interface PlanetInfoUIProps {
  planet: PlanetData;
  isActive: boolean;
  themeColor: string;
}

export function PlanetInfoUI({ planet, isActive, themeColor }: PlanetInfoUIProps) {
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  return (
    <motion.div
      className={`fixed inset-0 w-full h-screen flex items-center justify-start z-10 ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Contextual Radial Gradient Background */}
      <div 
        className="absolute inset-0 z-[-1] opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 25% 50%, ${themeColor}, transparent 60%)`
        }}
      />

      <div className="container mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full relative">
        
        {/* Left column: Typography & Info */}
        <div className="flex flex-col justify-center space-y-12 max-w-xl mt-24 md:mt-0 mix-blend-difference relative z-10">
          
          <motion.div 
            initial={false}
            animate={{ y: isActive ? 0 : 50 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-2"
          >
            <h2 className="text-xl md:text-2xl text-zinc-400 tracking-[0.3em] uppercase font-light">
              {planet.classification}
            </h2>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter uppercase" style={{ color: themeColor }}>
              {planet.name}
            </h1>
          </motion.div>

          <motion.div 
            initial={false}
            animate={{ y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light"
          >
            {planet.description}
          </motion.div>

          <motion.div 
            initial={false}
            animate={{ y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="grid grid-cols-2 gap-y-8 gap-x-12 pt-8 border-t border-white/20"
          >
            <div className="space-y-1">
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Distance</div>
              <div className="text-xl font-medium tracking-wide">{planet.telemetry.distanceFromSun}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Diameter</div>
              <div className="text-xl font-medium tracking-wide">{planet.telemetry.diameter}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Orbital Period</div>
              <div className="text-xl font-medium tracking-wide">{planet.telemetry.orbitalPeriod}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Temperature</div>
              <div className="text-xl font-medium tracking-wide">{planet.telemetry.temperature}</div>
            </div>
          </motion.div>

          {/* Progressive Disclosure Trigger */}
          <motion.div
            initial={false}
            animate={{ y: isActive ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="pt-4"
          >
            <button 
              onClick={() => setIsTelemetryOpen(true)}
              className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white border-b border-transparent hover:border-white transition-all pb-1"
            >
              Explore Telemetry
            </button>
          </motion.div>
        </div>
        
        {/* Right column: Empty space for the 3D planet to be visible */}
        <div className="hidden md:block"></div>
      </div>

      {/* ----------------------------------------------------------------------
          PROGRESSIVE DISCLOSURE DRAWER (Off-canvas Bottom Sheet)
      ----------------------------------------------------------------------- */}
      <motion.div
        className="fixed bottom-0 left-0 w-full md:w-[600px] md:left-8 md:bottom-8 h-auto p-8 rounded-t-3xl md:rounded-3xl backdrop-blur-xl bg-black/60 border border-white/10 z-50 overflow-hidden"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ 
          y: isTelemetryOpen && isActive ? 0 : "120%", 
          opacity: isTelemetryOpen && isActive ? 1 : 0 
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      >
        <button 
          onClick={() => setIsTelemetryOpen(false)}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-light tracking-widest uppercase mb-8" style={{ color: themeColor }}>
          {planet.name} Telemetry
        </h3>

        <div className="grid grid-cols-2 gap-8 text-sm font-light">
          {/* Mock Atmospheric Composition */}
          <div className="space-y-4">
            <h4 className="text-zinc-500 uppercase tracking-widest text-xs">Atmospheric Comp</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between"><span>Primary Gas</span><span className="font-mono">75%</span></div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "75%", backgroundColor: themeColor }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Secondary</span><span className="font-mono">23%</span></div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-zinc-500" style={{ width: "23%" }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Trace Elements</span><span className="font-mono">2%</span></div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-zinc-700" style={{ width: "2%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Mock Core Layers List */}
          <div className="space-y-4">
            <h4 className="text-zinc-500 uppercase tracking-widest text-xs">Core Structure</h4>
            <ul className="space-y-3 border-l border-white/10 pl-4">
              <li className="relative">
                <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                <span className="text-white block">Crust / Exosphere</span>
                <span className="text-zinc-500 text-xs">Outer layer</span>
              </li>
              <li className="relative">
                <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-zinc-600"></span>
                <span className="text-zinc-300 block">Mantle</span>
                <span className="text-zinc-500 text-xs">Silicate rock / Ice</span>
              </li>
              <li className="relative">
                <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-zinc-800"></span>
                <span className="text-zinc-400 block">Core</span>
                <span className="text-zinc-500 text-xs">Dense center</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
      
    </motion.div>
  );
}
