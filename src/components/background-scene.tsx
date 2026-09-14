"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Geo = "icosahedron" | "octahedron" | "tetrahedron" | "dodecahedron";

type NodeDef = {
  position: [number, number, number];
  geometry: Geo;
  scale: number;
  color: string;
  spin: number;
  opacity: number;
};

// Spaced out along Z so each one owns its own stretch of the page instead
// of all nine crowding the same screen at once. The camera dollies through
// this line as you scroll (see CameraRig), so scrolling reveals a new
// shape rather than just re-spinning the ones already on screen.
const NODES: NodeDef[] = [
  { position: [-6.5, 0.8, -4], geometry: "icosahedron", scale: 1, color: "#f0c14b", spin: 0.12, opacity: 0.32 },
  { position: [10, -1, -16], geometry: "octahedron", scale: 0.9, color: "#c9922c", spin: 0.16, opacity: 0.28 },
  { position: [-13.5, 1.2, -28], geometry: "tetrahedron", scale: 0.85, color: "#f0c14b", spin: -0.14, opacity: 0.24 },
  { position: [17, -0.6, -40], geometry: "octahedron", scale: 0.8, color: "#c9922c", spin: 0.18, opacity: 0.2 },
  { position: [-20.5, 0.4, -52], geometry: "icosahedron", scale: 0.75, color: "#f0c14b", spin: -0.1, opacity: 0.16 },
];

// Small, sparse fragments — a muted, more desaturated "antique gold" rather
// than the brand gold above, so they read as atmosphere, not as more logo
// shapes. Opacity fades with depth so the farthest ones nearly vanish into
// black. Kept deliberately few (this is atmosphere, not a particle field).
type ParticleDef = {
  position: [number, number, number];
  geometry: Geo;
  scale: number;
  color: string;
  opacity: number;
  driftAmp: number;
  driftSpeed: number;
  phase: number;
};

const PARTICLES: ParticleDef[] = [
  { position: [4, 2.5, -9], geometry: "tetrahedron", scale: 0.18, color: "#a4854f", opacity: 0.22, driftAmp: 0.25, driftSpeed: 0.06, phase: 0 },
  { position: [-3, -2, -14], geometry: "octahedron", scale: 0.14, color: "#8a7550", opacity: 0.16, driftAmp: 0.2, driftSpeed: 0.05, phase: 1.4 },
  { position: [8, -2.8, -22], geometry: "icosahedron", scale: 0.2, color: "#a4854f", opacity: 0.18, driftAmp: 0.3, driftSpeed: 0.045, phase: 2.6 },
  { position: [-9, 2.2, -30], geometry: "tetrahedron", scale: 0.16, color: "#8a7550", opacity: 0.14, driftAmp: 0.22, driftSpeed: 0.055, phase: 0.7 },
  { position: [2, -1.5, -36], geometry: "octahedron", scale: 0.15, color: "#a4854f", opacity: 0.12, driftAmp: 0.28, driftSpeed: 0.04, phase: 3.3 },
  { position: [-16, -0.8, -46], geometry: "tetrahedron", scale: 0.19, color: "#8a7550", opacity: 0.1, driftAmp: 0.24, driftSpeed: 0.05, phase: 1.9 },
  { position: [12, 1.6, -58], geometry: "icosahedron", scale: 0.17, color: "#a4854f", opacity: 0.08, driftAmp: 0.26, driftSpeed: 0.035, phase: 4.1 },
];

const START_Z = 9;
const TRAVEL = 58; // how far the camera dollies from top to bottom of the page

function useScrollFraction() {
  const fracRef = useRef(0);

  useEffect(() => {
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fracRef.current = max > 0 ? window.scrollY / max : 0;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return fracRef;
}

/** Normalized mouse position (-1..1), only tracked when the device has a
    fine pointer and the user hasn't asked for reduced motion — this drives
    the barely-there parallax, not the camera itself. */
function useMouseParallax(enabled: boolean) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    function onMove(e: MouseEvent) {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  return mouseRef;
}

function CameraRig({ fracRef }: { fracRef: React.RefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetZ = START_Z - fracRef.current * TRAVEL;
    camera.position.z += (targetZ - camera.position.z) * 0.07;
  });

  return null;
}

/** Tiny, slow, opposite-direction shift of the whole scene relative to the
    cursor — the classic parallax illusion of depth. Deliberately capped to
    a fraction of a unit so it reads as atmosphere, not a scene that visibly
    tracks the mouse. */
function ParallaxGroup({
  mouseRef,
  animate,
  children,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  animate: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    const targetX = animate ? -mouseRef.current.x * 0.35 : 0;
    const targetY = animate ? -mouseRef.current.y * 0.22 : 0;
    group.position.x += (targetX - group.position.x) * 0.03;
    group.position.y += (targetY - group.position.y) * 0.03;
  });

  return <group ref={ref}>{children}</group>;
}

function Shape({ node, animate }: { node: NodeDef; animate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!animate) return;
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.x += delta * node.spin;
    mesh.rotation.y += delta * node.spin * 0.8;
  });

  return (
    <mesh ref={ref} position={node.position} scale={node.scale}>
      {node.geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {node.geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
      {node.geometry === "tetrahedron" && <tetrahedronGeometry args={[1, 0]} />}
      {node.geometry === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
      <meshBasicMaterial color={node.color} wireframe transparent opacity={node.opacity} />
    </mesh>
  );
}

/** Small drifting fragments — slow sinusoidal wander, not full rotation,
    so they read as suspended dust rather than spinning ornaments. */
function Particle({ node, animate }: { node: ParticleDef; animate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const base = node.position;

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    if (!animate) {
      mesh.position.set(...base);
      return;
    }
    const t = clock.elapsedTime * node.driftSpeed + node.phase;
    mesh.position.set(
      base[0] + Math.sin(t) * node.driftAmp,
      base[1] + Math.cos(t * 0.8) * node.driftAmp * 0.6,
      base[2],
    );
    mesh.rotation.x += 0.0006;
    mesh.rotation.y += 0.0009;
  });

  return (
    <mesh ref={ref} position={node.position} scale={node.scale}>
      {node.geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {node.geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
      {node.geometry === "tetrahedron" && <tetrahedronGeometry args={[1, 0]} />}
      <meshBasicMaterial color={node.color} wireframe transparent opacity={node.opacity} />
    </mesh>
  );
}

/** One clean path linking each shape to the next — a line, not a web. */
function ConnectionPath() {
  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < NODES.length - 1; i++) {
      pts.push(...NODES[i].position, ...NODES[i + 1].position);
    }
    return new Float32Array(pts);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#f0c14b" transparent opacity={0.14} />
    </lineSegments>
  );
}

function Scene({
  fracRef,
  mouseRef,
  animate,
  particleCount,
}: {
  fracRef: React.RefObject<number>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  animate: boolean;
  particleCount: number;
}) {
  return (
    <>
      <CameraRig fracRef={fracRef} />
      <ParallaxGroup mouseRef={mouseRef} animate={animate}>
        <ConnectionPath />
        {NODES.map((n, i) => (
          <Shape key={i} node={n} animate={animate} />
        ))}
        {PARTICLES.slice(0, particleCount).map((p, i) => (
          <Particle key={i} node={p} animate={animate} />
        ))}
      </ParallaxGroup>
    </>
  );
}

export function BackgroundScene() {
  const fracRef = useScrollFraction();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [particleCount, setParticleCount] = useState(PARTICLES.length);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const widthMq = window.matchMedia("(max-width: 640px)");

    const apply = () => {
      setReducedMotion(motionMq.matches);
      setFinePointer(pointerMq.matches);
      setParticleCount(widthMq.matches ? Math.ceil(PARTICLES.length / 2) : PARTICLES.length);
    };
    apply();

    motionMq.addEventListener("change", apply);
    pointerMq.addEventListener("change", apply);
    widthMq.addEventListener("change", apply);
    return () => {
      motionMq.removeEventListener("change", apply);
      pointerMq.removeEventListener("change", apply);
      widthMq.removeEventListener("change", apply);
    };
  }, []);

  const mouseRef = useMouseParallax(finePointer && !reducedMotion);

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, START_Z], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene
          fracRef={fracRef}
          mouseRef={mouseRef}
          animate={!reducedMotion}
          particleCount={particleCount}
        />
      </Canvas>
      <div className="scene-grain" />
    </div>
  );
}
