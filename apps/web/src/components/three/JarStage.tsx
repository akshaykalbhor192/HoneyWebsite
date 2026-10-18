"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import HoneyJar3D, { type JarLook } from "./HoneyJar3D";

export type JarMotion = {
  /** 0..1 scroll progress written by the page; read every frame */
  progress: { current: number };
  /** normalised pointer -1..1 */
  pointer?: { current: { x: number; y: number } };
};

function Rig({ look, motion, idle }: { look: JarLook; motion?: JarMotion; idle: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    const p = motion?.progress.current ?? 0;
    const px = motion?.pointer?.current.x ?? state.pointer.x;
    const py = motion?.pointer?.current.y ?? -state.pointer.y;
    // idle bob + pointer tilt, plus the scroll tumble (Hungry Tiger style)
    const targetY = (idle ? Math.sin(t * 0.6) * 0.35 : 0) + p * Math.PI * 2 + px * 0.5;
    const targetX = (idle ? Math.sin(t * 0.9) * 0.06 : 0) + Math.sin(p * Math.PI) * 0.9 - py * 0.25;
    const targetZ = Math.sin(p * Math.PI * 2) * 0.35;
    const k = 1 - Math.pow(0.001, dt);
    g.current.rotation.y += (targetY - g.current.rotation.y) * k;
    g.current.rotation.x += (targetX - g.current.rotation.x) * k;
    g.current.rotation.z += (targetZ - g.current.rotation.z) * k;
    g.current.position.y = Math.sin(t * 1.3) * 0.08;
  });
  return (
    <group ref={g}>
      <HoneyJar3D look={look} />
    </group>
  );
}

export default function JarStage({
  look, motion, idle = true, shadow = true, className = "", capture = false,
}: { look: JarLook; motion?: JarMotion; idle?: boolean; shadow?: boolean; className?: string; capture?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // stop rendering entirely while the jar is off screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`h-full w-full ${className}`}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        // measure layout size, not the transformed box (the hero tilts this container while it drops in)
        resize={{ offsetSize: true }}
        dpr={capture ? 1 : [1, 1.5]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: capture }}
        camera={{ position: [0, 0.3, 7.6], fov: 32 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff1d6" />
        <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#ffb547" />
        {/* environment is baked once, not re-rendered per frame */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[6, 2, 1]} color="#fff4e0" />
          <Lightformer form="rect" intensity={2} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} color="#ffd38a" />
          <Lightformer form="rect" intensity={2} position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} color="#ffffff" />
          <Lightformer form="ring" intensity={1.5} position={[0, -3, 4]} scale={3} color="#e8a020" />
        </Environment>
        <Rig look={look} motion={motion} idle={idle} />
        {shadow && <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={6} blur={2.6} far={2} resolution={256} frames={1} color="#3b1f12" />}
      </Canvas>
    </div>
  );
}
