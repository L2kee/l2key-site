"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Geo = "icosahedron" | "octahedron" | "tetrahedron" | "dodecahedron";

type NodeDef = {
  position: [number, number, number];
  geometry: Geo;
  scale: number;
  color: string;
  spin: number;
};

// Spaced out along Z so each one owns its own stretch of the page instead
// of all nine crowding the same screen at once. The camera dollies through
// this line as you scroll (see CameraRig), so scrolling reveals a new
// shape rather than just re-spinning the ones already on screen.
const NODES: NodeDef[] = [
  { position: [-6.5, 0.8, -4], geometry: "icosahedron", scale: 1, color: "#f0c14b", spin: 0.12 },
  { position: [10, -1, -16], geometry: "octahedron", scale: 0.9, color: "#c9922c", spin: 0.16 },
  { position: [-13.5, 1.2, -28], geometry: "tetrahedron", scale: 0.85, color: "#f0c14b", spin: -0.14 },
  { position: [17, -0.6, -40], geometry: "octahedron", scale: 0.8, color: "#c9922c", spin: 0.18 },
  { position: [-20.5, 0.4, -52], geometry: "icosahedron", scale: 0.75, color: "#f0c14b", spin: -0.1 },
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

function CameraRig({ fracRef }: { fracRef: React.RefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetZ = START_Z - fracRef.current * TRAVEL;
    camera.position.z += (targetZ - camera.position.z) * 0.07;
  });

  return null;
}

function Shape({ node }: { node: NodeDef }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
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
      <meshBasicMaterial color={node.color} wireframe transparent opacity={0.42} />
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
      <lineBasicMaterial color="#f0c14b" transparent opacity={0.22} />
    </lineSegments>
  );
}

function Scene({ fracRef }: { fracRef: React.RefObject<number> }) {
  return (
    <>
      <CameraRig fracRef={fracRef} />
      <ConnectionPath />
      {NODES.map((n, i) => (
        <Shape key={i} node={n} />
      ))}
    </>
  );
}

export function BackgroundScene() {
  const fracRef = useScrollFraction();

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, START_Z], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene fracRef={fracRef} />
      </Canvas>
    </div>
  );
}
