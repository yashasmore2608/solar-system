"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlanetData } from "@/data/planets";

export type RingConfig = {
  innerRadius: number;
  outerRadius: number;
  particleCount: number;
  thickness: number;
  color: string;
  isUranus?: boolean;
};

interface PlanetRingsProps {
  planet: PlanetData;
  planetSize: number;
}

// External function to avoid React hook purity checks for Math.random
function generateParticles(config: RingConfig) {
  const { innerRadius, outerRadius, particleCount, thickness, isUranus } = config;
  
  const posArray = new Float32Array(particleCount * 3);
  const colArray = new Float32Array(particleCount * 3);
  const sizeArray = new Float32Array(particleCount);
  
  const baseColor = new THREE.Color(config.color);
  const darkColor = new THREE.Color(config.color).multiplyScalar(0.4);
  
  let i = 0;
  while (i < particleCount) {
    let radius = 0;
    
    if (!isUranus) {
      const rand = Math.random();
      if (rand < 0.1) {
        radius = THREE.MathUtils.lerp(innerRadius, innerRadius + (outerRadius - innerRadius) * 0.2, Math.random());
      } else if (rand < 0.6) {
        radius = THREE.MathUtils.lerp(innerRadius + (outerRadius - innerRadius) * 0.2, innerRadius + (outerRadius - innerRadius) * 0.55, Math.random());
      } else if (rand < 0.65) {
        radius = THREE.MathUtils.lerp(innerRadius + (outerRadius - innerRadius) * 0.55, innerRadius + (outerRadius - innerRadius) * 0.6, Math.random());
      } else if (rand < 0.95) {
        radius = THREE.MathUtils.lerp(innerRadius + (outerRadius - innerRadius) * 0.6, innerRadius + (outerRadius - innerRadius) * 0.85, Math.random());
      } else {
        radius = THREE.MathUtils.lerp(innerRadius + (outerRadius - innerRadius) * 0.85, outerRadius, Math.random());
      }
    } else {
      const rand = Math.random();
      if (rand < 0.3) {
        radius = THREE.MathUtils.lerp(innerRadius, innerRadius + 0.1, Math.random());
      } else if (rand < 0.6) {
        radius = THREE.MathUtils.lerp(innerRadius + 0.2, innerRadius + 0.3, Math.random());
      } else {
        radius = THREE.MathUtils.lerp(outerRadius - 0.1, outerRadius, Math.random());
      }
    }

    const theta = Math.random() * Math.PI * 2;
    const yStr = (Math.random() - 0.5) + (Math.random() - 0.5) + (Math.random() - 0.5);
    const y = yStr * thickness;

    posArray[i * 3] = Math.cos(theta) * radius;
    posArray[i * 3 + 1] = y;
    posArray[i * 3 + 2] = Math.sin(theta) * radius;

    const particleColor = baseColor.clone().lerp(darkColor, Math.random() * (isUranus ? 0.8 : 0.4));
    colArray[i * 3] = particleColor.r;
    colArray[i * 3 + 1] = particleColor.g;
    colArray[i * 3 + 2] = particleColor.b;

    const sizeRand = Math.random();
    let pSize = 0.01;
    if (sizeRand > 0.98) pSize = 0.04;
    else if (sizeRand > 0.9) pSize = 0.02;

    sizeArray[i] = pSize;
    i++;
  }

  return [posArray, colArray, sizeArray];
}

export function PlanetRings({ planet, planetSize }: PlanetRingsProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const config: RingConfig = useMemo(() => planet.id === "saturn" 
    ? {
        innerRadius: planetSize * 1.2,
        outerRadius: planetSize * 2.8,
        particleCount: 150000,
        thickness: 0.05,
        color: "#ead6b8",
      }
    : {
        innerRadius: planetSize * 1.5,
        outerRadius: planetSize * 2.0,
        particleCount: 40000,
        thickness: 0.02,
        color: "#c6d3e3",
        isUranus: true,
      }, [planet.id, planetSize]);

  const [positions, colors, sizes] = useMemo(() => generateParticles(config), [config]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color: { value: new THREE.Color(0xffffff) },
  }), []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef} rotation={[0, 0, planet.id === "uranus" ? -Math.PI / 2 : 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
        uniforms={uniforms}
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          varying vec3 vPos;
          void main() {
            vColor = color;
            vPos = position;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying vec3 vPos;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.2, dist) * 0.6;
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  );
}
