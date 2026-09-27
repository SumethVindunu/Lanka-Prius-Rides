"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingRing({ position, rotation, color, speed }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = rotation[0] + state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.y = rotation[1] + state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
    </mesh>
  );
}

function GlowingSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </mesh>
    </Float>
  );
}

function generateParticlePositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  return pos;
}

function Particles() {
  const count = 500;
  const positions = useMemo(() => generateParticlePositions(count), []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#f59e0b"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function MovingLight() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5;
      ref.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 5;
    }
  });

  return <pointLight ref={ref} color="#f59e0b" intensity={2} distance={20} />;
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10 canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.1} />
        <MovingLight />
        <pointLight position={[5, 5, 5]} color="#ff6b35" intensity={0.5} />

        <GlowingSphere />

        <FloatingRing position={[0, 0, 0]} rotation={[0.5, 0, 0]} color="#f59e0b" speed={0.5} />
        <FloatingRing position={[0, 0, 0]} rotation={[0, 0.5, 0.5]} color="#ff6b35" speed={0.3} />
        <FloatingRing position={[0, 0, 0]} rotation={[1, 0.3, 0]} color="#f59e0b" speed={0.4} />

        <Particles />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
