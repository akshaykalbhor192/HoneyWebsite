"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type JarLook = { color: string; name: string; size?: string };

// Hex prism with one flat face toward the camera (+z).
const HEX_START = -Math.PI + Math.PI / 6;
// u coordinate range of that front face on a cylinder built with HEX_START
const FRONT = [4 / 12, 6 / 12];

function drawLabel(look: JarLook) {
  const W = 3072, H = 720;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  const cream = "#f7ebd3", ink = "#3b1f12", honey = "#e8a020", red = "#b83a22";
  g.fillStyle = cream; g.fillRect(0, 0, W, H);
  // stripes top and bottom
  g.fillStyle = ink; g.fillRect(0, 0, W, 34); g.fillRect(0, H - 34, W, 34);
  g.fillStyle = honey; g.fillRect(0, 34, W, 14); g.fillRect(0, H - 48, W, 14);

  const face = (i: number) => (FRONT[0] + (i * 1) / 6) * W; // left edge of face i (0 = front)
  const fw = W / 6;
  const center = (i: number) => (((face(i) % W) + W) % W) + fw / 2;

  // front face
  const cx = center(0);
  g.textAlign = "center";
  g.fillStyle = honey;
  g.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    g.lineTo(cx + Math.cos(a) * 54, 150 + Math.sin(a) * 54);
  }
  g.closePath(); g.fill();
  g.fillStyle = ink;
  g.font = "bold 60px Georgia, serif";
  g.fillText("अ", cx, 172);
  g.font = "900 104px Anton, Impact, sans-serif";
  g.fillText("AMRITASYA", cx, 320);
  g.fillStyle = red;
  g.font = "600 30px Manrope, Arial, sans-serif";
  g.fillText("·  RAW WILD HONEY  ·", cx, 372);
  g.fillStyle = ink;
  g.font = "900 54px Anton, Impact, sans-serif";
  const name = look.name.toUpperCase();
  const words = name.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
  g.fillText(line1, cx, 470);
  if (line2) g.fillText(line2, cx, 530);
  g.font = "600 28px Manrope, Arial, sans-serif";
  g.fillText(look.size ?? "500 g", cx, 600);

  // side faces
  const sides = ["NEVER HEATED", "PRODUCT OF INDIA", "अमृतस्य", "LAB TESTED", "WILD FOREST HIVES"];
  sides.forEach((t, i) => {
    const x = center(i + 1);
    g.fillStyle = i % 2 ? red : ink;
    g.font = t === "अमृतस्य" ? "110px 'Tiro Devanagari Sanskrit', serif" : "900 64px Anton, Impact, sans-serif";
    g.fillText(t, x, H / 2 + 24);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// 36 grip ridges in one draw call
function LidRidges() {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Object3D();
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      m.position.set(Math.sin(a) * 0.825, 1.4, Math.cos(a) * 0.825);
      m.rotation.set(0, a, 0);
      m.updateMatrix();
      ref.current!.setMatrixAt(i, m.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 36]}>
      <boxGeometry args={[0.03, 0.32, 0.02]} />
      <meshStandardMaterial color="#b9862c" metalness={1} roughness={0.35} />
    </instancedMesh>
  );
}

export default function HoneyJar3D({ look }: { look: JarLook }) {
  const label = useMemo(() => (typeof document === "undefined" ? null : drawLabel(look)), [look]);
  useEffect(() => () => label?.dispose(), [label]);

  const honey = `#${new THREE.Color(look.color).multiplyScalar(0.82).getHexString()}`;

  return (
    <group position={[0, -0.2, 0]}>
      {/* honey inside (opaque, glossy) */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.93, 0.93, 1.9, 6, 1, false, HEX_START]} />
        <meshPhysicalMaterial color={honey} roughness={0.08} clearcoat={1} clearcoatRoughness={0.03} emissive={honey} emissiveIntensity={0.1} specularIntensity={1} ior={1.5} flatShading />
      </mesh>

      {/* glass body */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1, 1, 2, 6, 1, false, HEX_START]} />
        <meshPhysicalMaterial transparent opacity={0.1} roughness={0} clearcoat={1} color="#fff6e0" flatShading envMapIntensity={2.4} depthWrite={false} />
      </mesh>
      {/* shoulder */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.78, 1, 0.2, 6, 1, false, HEX_START]} />
        <meshPhysicalMaterial transparent opacity={0.16} roughness={0}  clearcoat={1} color="#fffaf0" flatShading envMapIntensity={2.4} depthWrite={false} />
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.16, 0]}>
        <cylinderGeometry args={[0.74, 0.76, 0.16, 48]} />
        <meshPhysicalMaterial transparent opacity={0.35} roughness={0} clearcoat={1} color="#fffaf0" envMapIntensity={2.4} depthWrite={false} />
      </mesh>

      {/* label band */}
      {label && (
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[1.012, 1.012, 1.15, 6, 1, true, HEX_START]} />
          <meshStandardMaterial map={label} roughness={0.75} side={THREE.FrontSide} />
        </mesh>
      )}

      {/* gold lid with ridges */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.38, 64]} />
        <meshStandardMaterial color="#d9a441" metalness={1} roughness={0.28} />
      </mesh>
      <LidRidges />
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.7, 0.82, 0.04, 64]} />
        <meshStandardMaterial color="#e8b75a" metalness={1} roughness={0.22} />
      </mesh>
    </group>
  );
}
