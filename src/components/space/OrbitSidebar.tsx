import { motion, AnimatePresence } from "framer-motion";
import { PlanetData } from "@/data/planets";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface OrbitSidebarProps {
  planet: PlanetData;
  onClose: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }
};

export function OrbitSidebar({ planet, onClose }: OrbitSidebarProps) {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'ENVIRONMENT' | 'MISSIONS'>('TELEMETRY');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 h-full w-full md:w-[40%] max-w-lg z-50 flex flex-col justify-center p-8 md:p-12 pointer-events-auto"
    >
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        exit="exit"
        key={planet.id} // Re-trigger stagger when planet changes
        className="w-full flex flex-col"
      >
        <motion.button 
          variants={itemVariants}
          onClick={onClose}
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mb-12 w-fit"
        >
          <ArrowLeft size={14} />
          <span>Return to Journey</span>
        </motion.button>

        <motion.div variants={itemVariants}>
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono mb-2">
            {planet.classification}
          </h3>
          <h2 className="text-6xl md:text-8xl font-serif text-white tracking-tighter mb-6">
            {planet.name}
          </h2>
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-sm text-white/70 leading-relaxed max-w-md font-sans">
          {planet.description}
        </motion.p>

        {/* Interesting Fact Callout */}
        <motion.div variants={itemVariants} className="mt-6 mb-8 p-3 bg-white/5 border border-white/10 rounded-sm max-w-md">
          <span className="block text-[9px] text-white/50 uppercase tracking-[0.2em] mb-1">Fascinating Detail</span>
          <p className="text-[12px] text-white/90 italic leading-relaxed">
            "{planet.interestingFact}"
          </p>
        </motion.div>

        {/* Tab Selector */}
        <motion.div variants={itemVariants} className="flex space-x-6 mb-6 border-b border-white/10">
          {(['TELEMETRY', 'ENVIRONMENT', 'MISSIONS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] tracking-[0.2em] transition-colors pb-2 border-b uppercase ${
                activeTab === tab
                  ? 'text-white border-white'
                  : 'text-white/40 border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tab Content Container */}
        <div className="relative w-full max-w-md h-64 overflow-y-auto scrollbar-hide pr-4">
          <AnimatePresence mode="wait">
            {activeTab === 'TELEMETRY' && (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col w-full"
              >
                {planet.telemetry ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {Object.entries(planet.telemetry).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-white/10 pb-2">
                        <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-1">
                          {/* Format camelCase keys to Normal Words (e.g. distanceFromSun -> Distance From Sun) */}
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-[13px] text-white tracking-wider">
                          {value}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-white/50 text-xs italic">Awaiting telemetry data...</div>
                )}
                
                {/* Bottom Callout moved here */}
                <div className="pl-4 border-l-2 py-1 mt-6" style={{ borderColor: planet.themeColor }}>
                  <h4 className="text-[10px] uppercase tracking-widest text-white/50 font-mono mb-1">
                    {planet.specialFeature.title}
                  </h4>
                  <p className="text-xs text-white/70 font-light leading-relaxed max-w-[280px]">
                    {planet.specialFeature.description}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'ENVIRONMENT' && (
              <motion.div
                key="environment"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col space-y-6"
              >
                {planet.environment ? (
                  <>
                    <div className="border-l-2 border-white/20 pl-4">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Atmosphere</h4>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">{planet.environment.atmosphereDetails}</p>
                    </div>
                    <div className="border-l-2 border-white/20 pl-4">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Surface Conditions</h4>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">{planet.environment.surfaceConditions}</p>
                    </div>
                    <div className="border-l-2 border-white/20 pl-4">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Core Composition</h4>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">{planet.environment.coreComposition}</p>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] uppercase tracking-widest">
                    Error: Environment data missing from planet prop.
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'MISSIONS' && (
              <motion.div
                key="missions"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col space-y-6"
              >
                {planet.missions ? (
                  <>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-4">Notable Missions</h4>
                      <ul className="space-y-3">
                        {planet.missions.notableMissions.map((mission, idx) => (
                          <li key={idx} className="text-sm font-mono text-white/80 flex items-center before:content-['—'] before:mr-3 before:text-white/30">
                            {mission}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-2">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">Future Prospects</h4>
                      <p className="text-sm text-white/80 leading-relaxed font-sans">{planet.missions.futureProspects}</p>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] uppercase tracking-widest">
                    Error: Missions data missing from planet prop.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
