"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { PLANETS } from "@/data/planets";
import { PlanetVisuals } from "./PlanetVisuals";
import { OrbitSidebar } from "./OrbitSidebar";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { motion, AnimatePresence } from "framer-motion";

function CameraRig({ activePlanetId, planetRefs, controlsRef }: { activePlanetId: string | null, planetRefs: React.MutableRefObject<Record<string, THREE.Group | null>>, controlsRef: React.MutableRefObject<any> }) {
  const { state, camera, gl } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      if (activePlanetId) {
        const w = gl.domElement.clientWidth;
        const h = gl.domElement.clientHeight;
        camera.setViewOffset(w, h, w * -0.25, 0, w, h);
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
    }
  }, [activePlanetId, camera, gl]);

  useFrame((state, delta) => {
    if (activePlanetId && planetRefs.current[activePlanetId]) {
      // 1. Get exact world position of the frozen planet
      const targetPos = new THREE.Vector3();
      planetRefs.current[activePlanetId]!.getWorldPosition(targetPos);

      // 2. Calculate where camera should sit (slightly offset)
      const cameraOffset = new THREE.Vector3(targetPos.x, targetPos.y + 1, targetPos.z + 5);

      // 3. Smoothly Lerp Camera Position
      state.camera.position.lerp(cameraOffset, 0.05);

      // 4. Smoothly Lerp Controls Target (where the camera is looking)
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetPos, 0.05);
        controlsRef.current.update(); // CRITICAL: Must update controls after target changes
      }
    } else {
      // Return to Sandbox View (Sun) but let the user control the camera
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        controlsRef.current.update();
      }

      // Do NOT force state.camera.position.lerp here on every frame!
      // Simply let OrbitControls handle the zooming/panning.
    }
  });

  return null;
}

function StarField() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (starsRef.current) {
      // Extremely subtle, continuous galactic background rotation
      starsRef.current.rotation.y += delta * 0.01;
      starsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group ref={starsRef} position={[0, 0, -450]}>
      {/* Layer 1 - Very distant faint stars (Milky Way background impression) */}
      <Stars radius={450} depth={300} count={12000} factor={2} saturation={0} fade speed={0.5} />

      {/* Layer 2 - Medium distance stars (slight color) */}
      <Stars radius={300} depth={200} count={4000} factor={4} saturation={0.5} fade speed={1} />

      {/* Layer 3 - Close foreground stars for strong parallax during scroll */}
      <Stars radius={150} depth={100} count={1000} factor={7} saturation={0.8} fade speed={1.5} />
    </group>
  );
}

// We no longer need the linear SceneContainer with scroll interpolation.
// The planets are now anchored to the origin natively.

const VOYAGER_SCALE = 0.0001;
const VOYAGER_RADIUS = 120;

function VoyagerVisual({ isOrbitMode }: { isOrbitMode: boolean }) {
  const voyagerOrbitRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/voyager.glb');
  const voyagerClone = useMemo(() => scene.clone(true), [scene]);
  const localTimeRef = useRef(0);

  useFrame((state, delta) => {
    if (!isOrbitMode) {
      localTimeRef.current += delta * 0.02; // Global speed scaling
    }

    if (voyagerOrbitRef.current) {
      voyagerOrbitRef.current.rotation.y = localTimeRef.current * 0.5; // Very slow speed
    }
  });

  return (
    <group rotation={[0.8, 0, 0]}>
      {/* The Escape Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[VOYAGER_RADIUS - 0.2, VOYAGER_RADIUS + 0.2, 256]} />
        <meshBasicMaterial color="white" opacity={0.08} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* The Moving Orbit Group */}
      <group ref={voyagerOrbitRef}>
        <group position={[VOYAGER_RADIUS, 0, 0]}>
          <ambientLight intensity={2} />
          <primitive object={voyagerClone} scale={[VOYAGER_SCALE, VOYAGER_SCALE, VOYAGER_SCALE]} />
        </group>
      </group>
    </group>
  );
}

export default function SolarSystemExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOrbitMode, setIsOrbitMode] = useState(false);
  const planetRefs = useRef<Record<string, THREE.Group | null>>({});
  const controlsRef = useRef<any>(null);

  const activePlanetId = isOrbitMode ? PLANETS[activeIndex].id : null;

  useEffect(() => {
    if (isOrbitMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOrbitMode]);

  const handleNavClick = (index: number) => {
    setActiveIndex(index);
    setIsOrbitMode(true);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">

      {/* 3D Canvas */}
      <div className={`fixed inset-0 z-0 ${isOrbitMode ? 'pointer-events-auto' : 'pointer-events-auto'}`}>
        <Canvas camera={{ position: [0, 40, 60], fov: 45 }}>
          <color attach="background" args={["#000000"]} />
          {/* Deep Space Lighting */}
          <ambientLight intensity={0.2} />
          {/* Primary light from the Sun at [0,0,0] */}
          <pointLight position={[0, 0, 0]} intensity={1500} decay={1.5} distance={500} />

          <Suspense fallback={null}>
            <StarField />
            <VoyagerVisual isOrbitMode={isOrbitMode} />
            <CameraRig
              activePlanetId={activePlanetId}
              planetRefs={planetRefs}
              controlsRef={controlsRef}
            />

            <OrbitControls
              ref={controlsRef}
              makeDefault
              target={[0, 0, 0]}
              maxDistance={100}
              minDistance={10}
              enablePan={!isOrbitMode}
              enableZoom={!isOrbitMode}
              autoRotate={!isOrbitMode}
              autoRotateSpeed={0.5}
            />

            {PLANETS.map((planet, index) => (
              <PlanetVisuals
                key={planet.id}
                innerRef={(el) => { planetRefs.current[planet.id] = el; }}
                planet={planet}
                index={index}
                isOrbitMode={isOrbitMode}
                isActive={activeIndex === index}
              />
            ))}

            <EffectComposer>
              <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
              <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay Wrappers */}
      <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between">

        {/* Top Navigation Bar */}
        <div className="w-full flex justify-center items-start p-6 bg-gradient-to-b from-black/80 to-transparent">
          <div className="hidden md:flex space-x-8 text-[10px] uppercase tracking-[0.2em] font-mono">
            {PLANETS.map((planet, index) => {
              const isSelected = activeIndex === index && isOrbitMode;
              return (
                <button
                  key={planet.id}
                  onClick={() => handleNavClick(index)}
                  className="transition-all pointer-events-auto hover:text-white"
                  style={{
                    color: isSelected ? planet.themeColor : "#71717a",
                    textShadow: isSelected ? `0 0 10px ${planet.themeColor}80` : "none"
                  }}
                >
                  {planet.name}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Orbit Mode HUD */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <AnimatePresence>
          {isOrbitMode && activePlanetId && (
            <OrbitSidebar
              planet={PLANETS.find(p => p.id === activePlanetId)!}
              onClose={() => setIsOrbitMode(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
