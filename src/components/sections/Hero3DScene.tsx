"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Environment,
  Sphere,
  Box,
  Torus,
  Cylinder,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";

// Suppress known harmless Three.js/WebGL warnings from the console
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = String(args[0] || "");
    if (
      msg.includes("THREE.Clock") ||
      msg.includes("THREE.WebGLProgram") ||
      msg.includes("warning X4122")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// ─── Individual 3D Objects ─────────────────────────────────────────────────────

/** Open Book — two planes angled like an open book */
function FloatingBook() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Book spine */}
        <Box args={[0.08, 1.4, 1.0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#001e2b" roughness={0.3} metalness={0.6} />
        </Box>

        {/* Left page */}
        <Box args={[0.02, 1.3, 0.95]} position={[-0.55, 0, 0]} rotation={[0, 0.35, 0]}>
          <meshStandardMaterial color="#f4f7f6" roughness={0.8} metalness={0.1} />
        </Box>

        {/* Right page */}
        <Box args={[0.02, 1.3, 0.95]} position={[0.55, 0, 0]} rotation={[0, -0.35, 0]}>
          <meshStandardMaterial color="#e3fcef" roughness={0.8} metalness={0.1} />
        </Box>

        {/* Page lines (simplified as thin boxes) */}
        {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
          <Box key={i} args={[0.01, 0.02, 0.6]} position={[-0.5, y, 0]} rotation={[0, 0.35, 0]}>
            <meshStandardMaterial color="#00a35c" emissive="#00a35c" emissiveIntensity={0.3} />
          </Box>
        ))}

        {/* Glowing cover edge */}
        <Box args={[0.1, 1.42, 1.02]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#00ed64"
            emissive="#00ed64"
            emissiveIntensity={0.4}
            transparent
            opacity={0.3}
          />
        </Box>
      </group>
    </Float>
  );
}

/** Graduation Cap — flat box + tassel */
function FloatingGraduationCap() {
  const capRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (capRef.current) {
      capRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.2}>
      <group ref={capRef} position={[2.2, 0.8, -0.5]}>
        {/* Cap board */}
        <Box args={[1.1, 0.07, 1.1]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#7b3ff2"
            emissive="#7b3ff2"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.2}
          />
        </Box>

        {/* Cap top button */}
        <Cylinder args={[0.06, 0.06, 0.12, 8]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#fa6e39" emissive="#fa6e39" emissiveIntensity={0.8} />
        </Cylinder>

        {/* Cap base / dome */}
        <Cylinder args={[0.42, 0.38, 0.28, 16]} position={[0, -0.17, 0]}>
          <meshStandardMaterial color="#3d4f9f" metalness={0.5} roughness={0.4} />
        </Cylinder>

        {/* Tassel string */}
        <Cylinder args={[0.012, 0.012, 0.6, 6]} position={[0.38, -0.25, 0.38]}>
          <meshStandardMaterial color="#fa6e39" emissive="#fa6e39" emissiveIntensity={0.6} />
        </Cylinder>

        {/* Tassel end */}
        <Sphere args={[0.06, 8, 8]} position={[0.38, -0.58, 0.38]}>
          <meshStandardMaterial color="#fa6e39" emissive="#fa6e39" emissiveIntensity={1} />
        </Sphere>
      </group>
    </Float>
  );
}

/** Atom / Orbital rings */
function FloatingAtom() {
  const atomRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (atomRef.current) {
      atomRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      atomRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.2;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.6} floatIntensity={1.0}>
      <group ref={atomRef} position={[-2.2, 0.6, -0.3]}>
        {/* Nucleus */}
        <Sphere args={[0.18, 16, 16]}>
          <meshStandardMaterial
            color="#00ed64"
            emissive="#00ed64"
            emissiveIntensity={1}
            metalness={0.3}
            roughness={0.1}
          />
        </Sphere>

        {/* Orbital ring 1 */}
        <Torus args={[0.5, 0.025, 8, 48]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#00a35c" emissive="#00a35c" emissiveIntensity={0.8} />
        </Torus>

        {/* Orbital ring 2 — tilted */}
        <Torus args={[0.5, 0.025, 8, 48]} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
          <meshStandardMaterial color="#3d4f9f" emissive="#3d4f9f" emissiveIntensity={0.8} />
        </Torus>

        {/* Orbital ring 3 — perpendicular */}
        <Torus args={[0.5, 0.025, 8, 48]} rotation={[0, 0, Math.PI / 3]}>
          <meshStandardMaterial color="#f06bb8" emissive="#f06bb8" emissiveIntensity={0.8} />
        </Torus>

        {/* Electrons */}
        {[0, Math.PI * (2 / 3), Math.PI * (4 / 3)].map((angle, i) => (
          <ElectronOrbit key={i} angle={angle} speed={1.5 + i * 0.4} />
        ))}
      </group>
    </Float>
  );
}

/** Orbiting electron sphere */
function ElectronOrbit({ angle, speed }: { angle: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + angle;
    ref.current.position.x = Math.cos(t) * 0.5;
    ref.current.position.z = Math.sin(t) * 0.5;
  });

  return (
    <Sphere ref={ref} args={[0.055, 8, 8]}>
      <meshStandardMaterial color="#e3fcef" emissive="#00ed64" emissiveIntensity={2} />
    </Sphere>
  );
}

/** Glowing distorted sphere — centre-piece */
function GlowOrb() {
  return (
    <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere args={[0.55, 48, 48]} position={[0, -1.2, 0.4]}>
        <MeshDistortMaterial
          color="#00ed64"
          emissive="#00684a"
          emissiveIntensity={0.6}
          distort={0.45}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.75}
        />
      </Sphere>
    </Float>
  );
}

/** Ambient sparkle particles */
function ParticleField() {
  return (
    <Sparkles
      count={80}
      scale={[7, 5, 4]}
      size={1.2}
      speed={0.35}
      color="#00ed64"
      opacity={0.7}
    />
  );
}

/** Small floating math/science icons (cubes + tetrahedra as stand-ins) */
function FloatingSymbols() {
  const symbols = useMemo(
    () => [
      { pos: [-1.2, 1.6, 0.5] as [number, number, number], color: "#f06bb8", emissive: "#f06bb8" },
      { pos: [1.4, 1.5, -0.8] as [number, number, number], color: "#00ed64", emissive: "#00684a" },
      { pos: [-1.8, -1.0, 0.2] as [number, number, number], color: "#fa6e39", emissive: "#fa6e39" },
      { pos: [1.9, -0.9, 0.6] as [number, number, number], color: "#3d4f9f", emissive: "#3d4f9f" },
    ],
    []
  );

  return (
    <>
      {symbols.map((s, i) => (
        <Float key={i} speed={1.5 + i * 0.3} rotationIntensity={1} floatIntensity={1.2}>
          <Box args={[0.18, 0.18, 0.18]} position={s.pos}>
            <meshStandardMaterial
              color={s.color}
              emissive={s.emissive}
              emissiveIntensity={1.2}
              metalness={0.6}
              roughness={0.2}
            />
          </Box>
        </Float>
      ))}
    </>
  );
}

// ─── Main Scene Component ──────────────────────────────────────────────────────

export default function Hero3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" castShadow />
      <spotLight position={[0, 5, 0]} intensity={2.5} angle={0.6} penumbra={1} color="#c3f0d2" castShadow />
      <pointLight position={[-4, 2, 2]} intensity={1.8} color="#00ed64" />
      <pointLight position={[4, -2, -2]} intensity={1.5} color="#003d4f" />
      <pointLight position={[0, -3, 3]} intensity={1.2} color="#7b3ff2" />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* 3D Objects */}
      <FloatingBook />
      <FloatingGraduationCap />
      <FloatingAtom />
      <GlowOrb />
      <FloatingSymbols />
      <ParticleField />

      {/* Slow auto-rotation — no zoom/pan */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />

      {/* Post-processing: Cinematic look */}
      <EffectComposer>
        <DepthOfField focusDistance={0.02} focalLength={0.15} bokehScale={3} height={480} />
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.04} />
      </EffectComposer>
    </Canvas>
  );
}

