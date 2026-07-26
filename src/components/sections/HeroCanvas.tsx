"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleSwarm({ count = 1200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate initial particle positions and speeds
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8 - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;
    }
    return [pos, initPos];
  }, [count]);

  const targetMouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!pointsRef.current) return;

    // Smooth lerp mouse tracking
    targetMouse.current.x += (state.pointer.x * 2 - targetMouse.current.x) * 0.05;
    targetMouse.current.y += (state.pointer.y * 2 - targetMouse.current.y) * 0.05;

    const time = state.clock.elapsedTime;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const baseX = initialPositions[idx];
      const baseY = initialPositions[idx + 1];

      // Ambient sine wave drift
      const waveX = Math.sin(time * 0.5 + i * 0.1) * 0.15;
      const waveY = Math.cos(time * 0.4 + i * 0.15) * 0.15;

      // Mouse attraction pull
      const dx = targetMouse.current.x - baseX;
      const dy = targetMouse.current.y - baseY;
      const distSq = dx * dx + dy * dy;
      const pullFactor = Math.max(0, 1 - distSq / 16) * 0.4;

      array[idx] = baseX + waveX + dx * pullFactor;
      array[idx + 1] = baseY + waveY + dy * pullFactor;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00c758"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Floating cube */}
      <mesh position={[-2.5, 0.8, -1]} rotation={[0.4, 0.6, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshBasicMaterial color="#00c758" transparent opacity={0.18} />
      </mesh>

      {/* Floating sphere */}
      <mesh position={[2.2, -0.6, -1.5]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.14} />
      </mesh>

      {/* Floating torus */}
      <mesh position={[1.4, 1.2, -2]} rotation={[0.8, 0.3, 0]}>
        <torusGeometry args={[0.35, 0.08, 12, 32]} />
        <meshBasicMaterial color="#00c758" transparent opacity={0.12} />
      </mesh>

      {/* Floating octahedron */}
      <mesh position={[-1.6, -1.1, -0.8]} rotation={[0.5, 0.2, 0.4]}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshBasicMaterial color="#6ee7b7" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0} />
      <ParticleSwarm count={1200} />
      <FloatingShapes />
    </Canvas>
  );
}
