"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { tunnelState } from "@/components/webgl/tunnelState";

const RINGS = 26;
const PER_RING = 16;
const SPACING = 2.35;
const DEPTH = RINGS * SPACING;
const RADIUS = 3.35;
const VOID = "#131212";

/** The brand lozenge: an ogee diamond with a matching cutout. */
function useLatticeGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1);
    shape.bezierCurveTo(0.38, 0.5, 0.38, -0.5, 0, -1);
    shape.bezierCurveTo(-0.38, -0.5, -0.38, 0.5, 0, 1);

    const hole = new THREE.Path();
    hole.moveTo(0, 0.6);
    hole.bezierCurveTo(0.2, 0.3, 0.2, -0.3, 0, -0.6);
    hole.bezierCurveTo(-0.2, -0.3, -0.2, 0.3, 0, 0.6);
    shape.holes.push(hole);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.035,
      bevelSegments: 2,
      curveSegments: 18,
    });
    geometry.center();
    return geometry;
  }, []);
}

/** One ring of lattice pieces, drawn as a single instanced mesh. */
function Ring({
  geometry,
  material,
  twist,
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  twist: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const scale = new THREE.Vector3();

    for (let i = 0; i < PER_RING; i += 1) {
      const angle = (i / PER_RING) * Math.PI * 2 + twist;
      position.set(Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS, 0);
      euler.set(Math.PI / 2, 0, angle + Math.PI / 2);
      quaternion.setFromEuler(euler);
      const pulse = 0.86 + (i % 2 === 0 ? 0.14 : 0);
      scale.setScalar(pulse);
      mesh.setMatrixAt(i, matrix.compose(position, quaternion, scale));
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [twist]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, PER_RING]}
      frustumCulled={false}
    />
  );
}

function TunnelRig() {
  const geometry = useLatticeGeometry();
  const groupsRef = useRef<Array<THREE.Group | null>>([]);
  const glowRef = useRef<THREE.Mesh>(null);
  const travel = useRef(0);
  const smoothVelocity = useRef(0);
  const { camera } = useThree();

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#cfc7bd"),
        metalness: 0.55,
        roughness: 0.3,
        emissive: new THREE.Color("#6b5a4e"),
        emissiveIntensity: 0.24,
      }),
    [],
  );

  const glowTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, "rgba(253,247,236,0.95)");
      gradient.addColorStop(0.35, "rgba(213,209,204,0.35)");
      gradient.addColorStop(1, "rgba(19,18,18,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      glowTexture.dispose();
    };
  }, [geometry, material, glowTexture]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);

    smoothVelocity.current +=
      (tunnelState.velocity - smoothVelocity.current) * 0.08;

    const dive = tunnelState.dive;
    const speed = 2.6 + dive * 12 + Math.abs(smoothVelocity.current) * 0.35;
    travel.current += speed * dt;

    groupsRef.current.forEach((group, index) => {
      if (!group) return;
      const z = ((index * SPACING + travel.current) % DEPTH) - DEPTH + 5;
      group.position.z = z;
      group.rotation.z = index * 0.14 + travel.current * 0.014;

      // Rings taper inward far away, so the passage reads as depth not a wall.
      const nearness = THREE.MathUtils.clamp((z + DEPTH) / DEPTH, 0, 1);
      const scale = 0.72 + nearness * 0.34 + dive * 0.12;
      group.scale.setScalar(scale);
    });

    camera.position.x += (tunnelState.pointerX * 0.55 - camera.position.x) * 0.05;
    camera.position.y += (-tunnelState.pointerY * 0.4 - camera.position.y) * 0.05;
    camera.position.z = 5 - dive * 2.4;
    camera.lookAt(0, 0, -12);

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.42 + dive * 0.35;
      glowRef.current.scale.setScalar(6 + dive * 5);
      glowRef.current.rotation.z += dt * 0.05;
    }
  });

  return (
    <>
      <fog attach="fog" args={[VOID, 7, 33]} />
      <ambientLight intensity={0.55} color="#d5d1cc" />
      <pointLight
        position={[0, 0, 4]}
        intensity={26}
        distance={22}
        color="#fdf7ec"
      />
      <pointLight
        position={[4, 3, -6]}
        intensity={38}
        distance={30}
        color="#a1877c"
      />
      <pointLight
        position={[-5, -3, -14]}
        intensity={44}
        distance={34}
        color="#d5d1cc"
      />

      {Array.from({ length: RINGS }).map((_, index) => (
        <group
          key={index}
          ref={(node) => {
            groupsRef.current[index] = node;
          }}
        >
          <Ring
            geometry={geometry}
            material={material}
            twist={index * 0.19}
          />
        </group>
      ))}

      <mesh ref={glowRef} position={[0, 0, -24]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

export function Tunnel({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setActive(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(el);

    const onPointer = (e: PointerEvent) => {
      tunnelState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      tunnelState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`}>
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 5], fov: 68, near: 0.1, far: 60 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(VOID, 1);
        }}
      >
        <TunnelRig />
      </Canvas>
    </div>
  );
}
