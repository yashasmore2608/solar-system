import { motion } from "framer-motion";
import { PlanetData } from "@/data/planets";
import { ArrowLeft } from "lucide-react";

interface OrbitDockProps {
  planet: PlanetData;
  onClose: () => void;
}

export function OrbitDock({ planet, onClose }: OrbitDockProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 pointer-events-auto"
    >
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-12 relative overflow-hidden">
        
        {/* Subtle background glow based on themeColor */}
        <div 
          className="absolute top-0 left-0 w-full h-1 opacity-50"
          style={{ backgroundColor: planet.themeColor }}
        />

        {/* Left Column (60%) */}
        <div className="w-full md:w-3/5 space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <button 
              onClick={onClose}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
            >
              <ArrowLeft size={14} />
              <span>Return</span>
            </button>
            <span className="text-xs tracking-[0.2em] text-zinc-500 uppercase">
              {planet.classification}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-widest" style={{ color: planet.themeColor }}>
            {planet.name}
          </h2>
          
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light">
            {planet.description}
          </p>

          <div 
            className="mt-6 p-4 rounded-xl border border-white/10"
            style={{ backgroundColor: `${planet.themeColor}10` }} // 10% opacity hex approximation
          >
            <h4 className="text-xs uppercase tracking-widest mb-1" style={{ color: planet.themeColor }}>
              {planet.specialFeature.title}
            </h4>
            <p className="text-sm text-zinc-300 font-light leading-relaxed">
              {planet.specialFeature.description}
            </p>
          </div>
        </div>

        {/* Right Column (40%) - Telemetry Grid */}
        <div className="w-full md:w-2/5 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12 flex flex-col justify-center">
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-6">Live Telemetry</h3>
          
          <div className="grid grid-cols-2 gap-y-8 gap-x-6">
            <div className="space-y-1">
              <div className="text-[10px] tracking-widest text-white/50 uppercase">Distance</div>
              <div className="text-sm md:text-base text-white font-mono">{planet.telemetry.distanceFromSun}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] tracking-widest text-white/50 uppercase">Diameter</div>
              <div className="text-sm md:text-base text-white font-mono">{planet.telemetry.diameter}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] tracking-widest text-white/50 uppercase">Gravity</div>
              <div className="text-sm md:text-base text-white font-mono">{planet.telemetry.gravity}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] tracking-widest text-white/50 uppercase">Temperature</div>
              <div className="text-sm md:text-base text-white font-mono">{planet.telemetry.temperature}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] tracking-widest text-white/50 uppercase">Length of Day</div>
              <div className="text-sm md:text-base text-white font-mono">{planet.telemetry.lengthOfDay}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] tracking-widest text-white/50 uppercase">Orbital Period</div>
              <div className="text-sm md:text-base text-white font-mono">{planet.telemetry.orbitalPeriod}</div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
