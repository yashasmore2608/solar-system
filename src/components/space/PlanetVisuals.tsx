"use client";

import { useRef, Suspense, useMemo, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture, Html, PresentationControls, useGLTF } from "@react-three/drei";
import { PlanetData } from "@/data/planets";
import { PlanetRings } from "./PlanetRings";
import { useState } from "react";

interface PlanetVisualsProps {
  planet: PlanetData;
  index: number;
  isOrbitMode?: boolean;
  isActive?: boolean;
  innerRef?: React.Ref<THREE.Group>;
}

// -----------------------------------------------------------------------------
// Procedural Neptune Material
// -----------------------------------------------------------------------------
function NeptuneSurface() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 0.15;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBaseColor: { value: new THREE.Color("#0a1536") }, // deep navy
    uStormColor: { value: new THREE.Color("#060c1e") }, // dark storm
    uBandColor: { value: new THREE.Color("#163573") }, // royal blue
    uCloudColor: { value: new THREE.Color("#5685c2") }, // subtle cyan-blue
  }), []);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec3 uStormColor;
    uniform vec3 uBandColor;
    uniform vec3 uCloudColor;

    // Compact 3D noise
    float hash(float n) { return fract(sin(n) * 1e4); }
    float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
    float noise(vec3 x) {
        const vec3 step = vec3(110, 241, 171);
        vec3 i = floor(x);
        vec3 f = fract(x);
        float n = dot(i, step);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                       mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                   mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                       mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
    }

    // Fractal Brownian Motion
    float fbm(vec3 x) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100);
        for (int i = 0; i < 5; ++i) {
            v += a * noise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
      // 1. Atmospheric Bands (distorted by noise)
      float n1 = fbm(vPosition * 1.5 + uTime * 0.1);
      float band = sin(vPosition.y * 2.5 + n1 * 3.0);
      band = smoothstep(-0.2, 0.8, band);

      // 2. Dark Storm Features
      float stormNoise = fbm(vPosition * 1.2 - uTime * 0.05);
      float storm = smoothstep(0.65, 0.85, stormNoise);

      // 3. Fine Cloud Texture
      float cloudNoise = fbm(vPosition * 5.0 + uTime * 0.2);
      float cloudMask = smoothstep(0.5, 0.8, cloudNoise * (band + 0.5)); // Clouds follow bands slightly

      // Combine Colors
      vec3 color = uBaseColor;
      color = mix(color, uBandColor, band * 0.8);
      color = mix(color, uStormColor, storm);
      color = mix(color, uCloudColor, cloudMask * 0.6); // keep clouds subtle

      // Lighting (Matching the scene directional light at [10, 10, 10])
      vec3 lightDir = normalize(vec3(10.0, 10.0, 10.0));
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      float ambient = 0.05;

      // Atmospheric Rim (scattering edge)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rimDot = 1.0 - max(dot(viewDir, vNormal), 0.0);
      float rimGlow = smoothstep(0.6, 1.0, rimDot);
      vec3 rimColor = vec3(0.2, 0.5, 0.9); // bright soft blue rim

      // Final composite
      // Rim is mostly visible on the illuminated side
      vec3 finalColor = color * (diffuse + ambient) + (rimColor * rimGlow * (diffuse + 0.1));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  );
}

// -----------------------------------------------------------------------------
// Procedural Uranus Material
// -----------------------------------------------------------------------------
function UranusSurface() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 0.05; // extremely slow
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBaseColor: { value: new THREE.Color("#b3d4d6") }, // pale cyan
    uBandColor: { value: new THREE.Color("#9abfbf") }, // slightly darker muted teal
    uCloudColor: { value: new THREE.Color("#e0f2f2") }, // very faint white/cyan
  }), []);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec3 uBandColor;
    uniform vec3 uCloudColor;

    float hash(float n) { return fract(sin(n) * 1e4); }
    float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
    float noise(vec3 x) {
        const vec3 step = vec3(110, 241, 171);
        vec3 i = floor(x);
        vec3 f = fract(x);
        float n = dot(i, step);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                       mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                   mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                       mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
    }

    float fbm(vec3 x) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100);
        for (int i = 0; i < 4; ++i) { // fewer octaves for softer look
            v += a * noise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
      // 1. Very subtle atmospheric bands
      float n1 = fbm(vPosition * 1.0 + uTime * 0.05);
      float band = sin(vPosition.y * 3.0 + n1 * 1.5);
      band = smoothstep(0.0, 1.0, band);

      // 2. Extremely subtle, sparse clouds
      float cloudNoise = fbm(vPosition * 3.0 - uTime * 0.1);
      float cloudMask = smoothstep(0.65, 0.9, cloudNoise * (band * 0.5 + 0.5));

      // Combine Colors (very low contrast)
      vec3 color = uBaseColor;
      color = mix(color, uBandColor, band * 0.4); // soft bands
      color = mix(color, uCloudColor, cloudMask * 0.3); // soft clouds

      // Lighting (Matching the scene directional light)
      vec3 lightDir = normalize(vec3(10.0, 10.0, 10.0));
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      float ambient = 0.08; // slightly higher ambient so it doesn't get too dark

      // Atmospheric Rim (pale, thin)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float rimDot = 1.0 - max(dot(viewDir, vNormal), 0.0);
      float rimGlow = smoothstep(0.7, 1.0, rimDot);
      vec3 rimColor = vec3(0.7, 0.9, 0.9); // very pale cyan rim

      // Final composite
      vec3 finalColor = color * (diffuse + ambient) + (rimColor * rimGlow * (diffuse + 0.05));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  );
}

// -----------------------------------------------------------------------------
// Sub-components for Materials to handle useTexture without Hook violations
// -----------------------------------------------------------------------------

function TexturedSurfaceMaterial({ planet }: { planet: PlanetData }) {
  const map = useTexture(planet.textureUrl as string);

  const clonedMap = useMemo(() => {
    const m = map.clone();
    m.colorSpace = THREE.SRGBColorSpace;
    m.anisotropy = 16;
    m.needsUpdate = true;
    return m;
  }, [map]);

  if (planet.id === "sun") {
    return <meshBasicMaterial map={clonedMap} color={new THREE.Color(planet.color).multiplyScalar(2.0)} />;
  }

  // Adjust material properties per planet as requested
  const isMercury = planet.id === "mercury";
  const isVenus = planet.id === "venus";
  const isEarth = planet.id === "earth";
  const isMars = planet.id === "mars";
  const isJupiter = planet.id === "jupiter";

  let roughness = 0.7;
  let metalness = 0.0;
  let emissive = new THREE.Color(0x000000);
  let emissiveIntensity = 0;

  if (isMercury || isMars) {
    roughness = 0.9;
    metalness = 0.1;
  } else if (isVenus) {
    roughness = 0.9;
    emissive = new THREE.Color(planet.color);
    emissiveIntensity = 0.2;
  } else if (isJupiter) {
    roughness = 0.6;
  } else if (isEarth) {
    roughness = 0.3;
    metalness = 0.2;
  }

  return (
    <meshStandardMaterial 
      map={clonedMap} 
      color="#ffffff" 
      roughness={roughness} 
      metalness={metalness} 
      emissive={emissive} 
      emissiveIntensity={emissiveIntensity} 
    />
  );
}

function SurfaceMaterial({ planet }: { planet: PlanetData }) {
  if (planet.id === "neptune") {
    return <NeptuneSurface />;
  }

  if (planet.id === "uranus") {
    return <UranusSurface />;
  }

  if (!planet.textureUrl) {
    if (planet.id === "sun") {
      return <meshBasicMaterial color={new THREE.Color(planet.color).multiplyScalar(2.0)} />;
    }
    return <meshStandardMaterial color={planet.color} roughness={0.8} metalness={0.0} />;
  }

  return <TexturedSurfaceMaterial planet={planet} />;
}

function CloudMaterial({ planet }: { planet: PlanetData }) {
  const cloudMap = useTexture(planet.cloudMapUrl as string);

  const clonedMap = useMemo(() => {
    const m = cloudMap.clone();
    m.colorSpace = THREE.SRGBColorSpace;
    m.anisotropy = 16;
    m.needsUpdate = true;
    return m;
  }, [cloudMap]);

  return (
    <meshStandardMaterial
      map={clonedMap}
      transparent={true}
      opacity={planet.id === "venus" ? 0.9 : 0.4}
      blending={planet.id === "venus" ? THREE.NormalBlending : THREE.AdditiveBlending}
      depthWrite={false}
    />
  );
}

// -----------------------------------------------------------------------------
// Hotspot Component (Spatial Markers)
// -----------------------------------------------------------------------------
function PlanetHotspot({ position, label, color = "white" }: { position: [number, number, number], label: string, color?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} occlude transform={false} style={{ pointerEvents: 'none' }}>
      <div
        className="relative flex items-center justify-center cursor-pointer group pointer-events-auto"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <button
          className="w-3 h-3 rounded-full bg-transparent ring-2 animate-pulse transition-all duration-300"
          style={{
            boxShadow: `0 0 10px ${color}40`,
            borderColor: hovered ? color : `${color}80`,
            transform: hovered ? 'scale(1.3)' : 'scale(1)'
          }}
        />

        <div
          className="absolute left-6 whitespace-nowrap bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-md text-xs text-white uppercase tracking-widest pointer-events-none transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-8px)'
          }}
        >
          {label}
        </div>
      </div>
    </Html>
  );
}

// -----------------------------------------------------------------------------
// Orbit Mode High-Fidelity Assets
// -----------------------------------------------------------------------------
function EarthOrbitAssets({ planetSize }: { planetSize: number }) {
  const issOrbitRef = useRef<THREE.Group>(null);
  const shuttleOrbitRef = useRef<THREE.Group>(null);

  const iss = useGLTF("/iss.glb");
  const shuttle = useGLTF("/shuttle.glb");

  // Prevent Object Reference Conflicts by explicitly cloning
  const issClone = useMemo(() => iss.scene.clone(true), [iss.scene]);
  const shuttleClone = useMemo(() => shuttle.scene.clone(true), [shuttle.scene]);

  useFrame((state, delta) => {
    if (issOrbitRef.current) {
      issOrbitRef.current.rotation.y += delta * 0.5;
    }

    if (shuttleOrbitRef.current) {
      shuttleOrbitRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <group ref={issOrbitRef}>
        {/* The group handles the distance from Earth */}
        <group position={[1.5, 0.3, 0]}>
          {/* The primitive ONLY handles the extreme shrink */}
          <primitive 
            object={issClone} 
            scale={[0.00005, 0.00005, 0.00005]} 
          />
        </group>
      </group>
      <group ref={shuttleOrbitRef}>
        {/* Force Lighting (Debugging) */}
        <ambientLight intensity={2} />
        <group position={[-1.5, -0.8, 0]}>
          <primitive 
            object={shuttleClone} 
            scale={[0.008, 0.008, 0.008]} 
          />
        </group>
      </group>
    </>
  );
}

function OrbitAssets({ planetId, planetSize }: { planetId: string, planetSize: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2; // orbital speed
    }
  });

  if (planetId === "earth") {
    return (
      <Suspense fallback={null}>
        <EarthOrbitAssets planetSize={planetSize} />
      </Suspense>
    );
  }

  return null;
}

function MoonsVisuals({ moons, localTimeRef }: { moons: PlanetData['moons'], localTimeRef: React.MutableRefObject<number> }) {
  if (!moons) return null;

  return (
    <>
      {moons.map((moon, i) => (
        <MoonModel key={i} moon={moon} localTimeRef={localTimeRef} />
      ))}
    </>
  );
}

const MOON_SCALE = 0.05;

function MoonModel({ moon, localTimeRef }: { moon: NonNullable<PlanetData['moons']>[0], localTimeRef: React.MutableRefObject<number> }) {
  const moonGroupRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF('/moon.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    clone.traverse((child) => {
      if ((child as any).isMesh) {
        // Ensure the model receives and reflects light properly
        (child as any).material.roughness = 1; 
        (child as any).material.metalness = 0;
        (child as any).material.needsUpdate = true;
      }
    });
  }, [clone]);

  useFrame(() => {
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y = (localTimeRef.current * moon.speed) + moon.startingPhase;
    }
  });

  return (
    <group ref={moonGroupRef}>
      <group position={[moon.localRadius, 0, 0]}>
        <primitive object={clone} scale={MOON_SCALE} />
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// Main Planet Component
// -----------------------------------------------------------------------------

export function PlanetVisuals({ planet, index, isOrbitMode, isActive, innerRef }: PlanetVisualsProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const localTimeRef = useRef(0);
  
  const isOrbiting = isOrbitMode && isActive;

  useFrame((state, delta) => {
    // Only increment time if not in orbit mode
    if (!isOrbitMode) {
      localTimeRef.current += delta * 0.02;
    }
    const time = localTimeRef.current;
    
    // Orbital mechanics (slightly variable speeds based on planet identity or radius)
    const speedMultiplier = planet.id === "sun" ? 0 : planet.id === "earth" ? 1 : planet.id === "jupiter" ? 0.4 : planet.sandboxRadius === 0 ? 0 : (20 / planet.sandboxRadius);
    const sandboxX = Math.cos(time * speedMultiplier) * planet.sandboxRadius;
    const sandboxZ = Math.sin(time * speedMultiplier) * planet.sandboxRadius;

    // Position planet on orbital path
    if (groupRef.current) {
      groupRef.current.position.x = sandboxX;
      groupRef.current.position.y = 0;
      groupRef.current.position.z = sandboxZ;
    }

    // CONTINUOUS ANIMATION (independent of scroll)
    const rotationSpeed = planet.id === "sun" ? 0.02 : planet.id === "jupiter" ? 0.08 : 0.04;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }

    // Clouds move slightly faster/differently than the surface
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * (rotationSpeed * 1.2);
    }

    // Atmosphere subtle pulse or rotation
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  const planetSize = planet.sandboxScale;

  const content = (
    <>
      {/* 1. MAIN PLANET SURFACE */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planetSize, 64, 64]} />
        <Suspense fallback={<meshBasicMaterial color={planet.color} />}>
          <SurfaceMaterial planet={planet} />
        </Suspense>

        {/* Spatial Hotspots attached to the rotating mesh */}
        {planet.id === "mars" && (
          <PlanetHotspot position={[planetSize * 0.7, planetSize * 0.4, planetSize * 0.58]} label="Olympus Mons" color={planet.themeColor} />
        )}
        {planet.id === "mars" && (
          <PlanetHotspot position={[-planetSize * 0.6, -planetSize * 0.2, planetSize * 0.77]} label="Valles Marineris" color={planet.themeColor} />
        )}
        {planet.id === "earth" && (
          <PlanetHotspot position={[planetSize * 0.2, planetSize * 0.6, planetSize * 0.77]} label="Mariana Trench" color={planet.themeColor} />
        )}
        {planet.id === "jupiter" && (
          <PlanetHotspot position={[planetSize * 0.8, -planetSize * 0.3, planetSize * 0.51]} label="Great Red Spot" color={planet.themeColor} />
        )}
      </mesh>

      {/* Atmospheric Shell for Earth and Venus */}
      {(planet.id === "earth" || planet.id === "venus") && (
        <mesh>
          <sphereGeometry args={[planetSize * 1.05, 64, 64]} />
          <meshPhysicalMaterial 
            color={planet.id === "earth" ? "#4b90ff" : "#e6c280"}
            transparent={true}
            opacity={0.3}
            roughness={1}
            transmission={0.5}
          />
        </mesh>
      )}

      {/* 2. CLOUD LAYER */}
      {planet.cloudMapUrl && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[planetSize * 1.01, 64, 64]} />
          <Suspense fallback={null}>
            <CloudMaterial planet={planet} />
          </Suspense>
        </mesh>
      )}

      {/* 4. PLANETARY RINGS (PROCEDURAL PARTICLES) */}
      {planet.hasRings && (
        <group rotation={[0.3, 0, 0]}>
          <PlanetRings planet={planet} planetSize={planetSize} />
        </group>
      )}

      {/* 5. PERMANENT SATELLITES */}
      <OrbitAssets planetId={planet.id} planetSize={planetSize} />

      {/* 6. DYNAMIC MOONS */}
      <MoonsVisuals moons={planet.moons} localTimeRef={localTimeRef} />
    </>
  );

  return (
    <group rotation={[planet.orbitalInclination, 0, planet.orbitalInclination * 0.5]}>
      {/* Permanent Orbital Ring for NASA Eyes Tactical Aesthetic (Anchored at [0,0,0]) */}
      {planet.sandboxRadius > 0 && !isOrbiting && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.sandboxRadius - 0.05, planet.sandboxRadius + 0.05, 128]} />
          <meshBasicMaterial color="white" opacity={0.15} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      <group ref={(el) => {
        // @ts-ignore - groupRef is MutableRefObject, innerRef could be callback or object
        groupRef.current = el;
        if (typeof innerRef === 'function') innerRef(el);
        else if (innerRef) (innerRef as any).current = el;
      }}>
        {isOrbitMode && isActive ? (
          <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 2, Math.PI / 2]}
          azimuth={[-Infinity, Infinity]}
          zoom={1}
        >
          {content}
        </PresentationControls>
      ) : (
        content
      )}
      </group>
    </group>
  );
}
