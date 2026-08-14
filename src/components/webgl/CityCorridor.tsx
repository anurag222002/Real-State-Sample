"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/components/webgl/sceneState";

const BAYS = 16;
const SPACING = 7.4;
const TOTAL = BAYS * SPACING;
const GROUND_Y = -5;
const VOID = "#121212";

/** Deterministic pseudo-random so the skyline is stable between renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const buildingVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 view = viewMatrix * world;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

/**
 * Concrete masses with lit window grids. Lighting is hand-rolled so the whole
 * skyline draws with one program and stays cheap on mobile GPUs.
 */
const buildingFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uFogColor;
  uniform vec3 uStone;
  uniform vec3 uWindow;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying float vDepth;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 normal = normalize(vNormalW);
    float up = clamp(normal.y, 0.0, 1.0);
    float facing = abs(dot(normal, vec3(0.0, 0.0, 1.0)));

    // Directional wash plus a warm bounce from street level.
    float key = 0.32 + 0.5 * clamp(dot(normal, normalize(vec3(-0.6, 0.75, 0.4))), 0.0, 1.0);
    float bounce = 0.18 * smoothstep(14.0, -4.0, vWorld.y);
    vec3 base = uStone * (key + bounce);
    base = mix(base, uStone * 1.28, up * 0.5);

    // Window grid: rows read from world height, columns from the face UV so
    // every elevation lines up like a real curtain wall.
    float rows = floor((vWorld.y + 40.0) * 1.15);
    float cols = floor(vUv.x * 7.0 + facing * 0.5);
    vec2 cell = vec2(cols, rows);

    vec2 grid = fract(vec2(vUv.x * 7.0, (vWorld.y + 40.0) * 1.15));
    float pane = smoothstep(0.16, 0.3, grid.x) * smoothstep(0.84, 0.7, grid.x);
    pane *= smoothstep(0.2, 0.34, grid.y) * smoothstep(0.86, 0.72, grid.y);

    float lit = step(0.52, hash(cell));
    float flicker = 0.82 + 0.18 * sin(uTime * 0.6 + hash(cell) * 40.0);
    float sideMask = 1.0 - up;

    vec3 color = base;
    color += uWindow * pane * lit * flicker * 1.35 * sideMask;

    // Mullion shadows keep the mass from reading as a flat box.
    float mullion = (1.0 - pane) * sideMask * 0.14;
    color -= mullion;

    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    color = mix(color, uFogColor, fog);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const groundVertex = /* glsl */ `
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 view = viewMatrix * world;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

/** Site-plan grid on the ground plane, scrolling with the fly-through. */
const groundFragment = /* glsl */ `
  precision highp float;
  uniform float uTravel;
  uniform vec3 uFogColor;
  uniform vec3 uLine;
  uniform vec3 uAccent;
  varying vec3 vWorld;
  varying float vDepth;

  float gridLine(float coord, float width) {
    float d = abs(fract(coord) - 0.5);
    return 1.0 - smoothstep(0.0, width, d);
  }

  void main() {
    vec2 p = vec2(vWorld.x, vWorld.z + uTravel) * 0.28;

    float minor = max(gridLine(p.x, 0.06), gridLine(p.y, 0.06)) * 0.35;
    float major = max(gridLine(p.x * 0.25, 0.02), gridLine(p.y * 0.25, 0.02)) * 0.6;
    float centre = gridLine(vWorld.x * 0.02, 0.004);

    vec3 color = vec3(0.043, 0.043, 0.043);
    color += uLine * (minor + major);
    color += uAccent * centre * 0.5;

    float fog = smoothstep(10.0, 46.0, vDepth);
    color = mix(color, uFogColor, fog);

    gl_FragColor = vec4(color, 1.0);
  }
`;

type Slab = {
  x: number;
  width: number;
  depth: number;
  height: number;
};

/** Skyline layout is deterministic, so it is built once for the module. */
function buildSkyline() {
  const bays: Slab[][] = [];
  for (let bay = 0; bay < BAYS; bay += 1) {
    const slabs: Slab[] = [];
    [-1, 1].forEach((side, sideIndex) => {
      const count = 2 + Math.floor(rand(bay * 3.1 + sideIndex) * 2);
      for (let i = 0; i < count; i += 1) {
        const seed = bay * 17.3 + sideIndex * 7.7 + i * 3.3;
        slabs.push({
          x: side * (7.4 + rand(seed + 1) * 5.5 + i * 2.4),
          width: 2.6 + rand(seed) * 3.4,
          depth: 2.8 + rand(seed + 2) * 3.6,
          height: 9 + rand(seed + 3) * 26,
        });
      }
    });
    bays.push(slabs);
  }
  return bays;
}

function buildDust() {
  const count = 320;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (rand(i) - 0.5) * 40;
    positions[i * 3 + 1] = rand(i + 100) * 26 - 4;
    positions[i * 3 + 2] = -rand(i + 200) * TOTAL;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

// Shared GPU resources: one program for every mass in the skyline, kept at
// module scope so remounting the canvas never recompiles shaders.
const bays = buildSkyline();
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const dustGeometry = buildDust();

const buildingMaterial = new THREE.ShaderMaterial({
  vertexShader: buildingVertex,
  fragmentShader: buildingFragment,
  uniforms: {
    uTime: { value: 0 },
    uFogColor: { value: new THREE.Color(VOID) },
    uStone: { value: new THREE.Color("#3a3631") },
    uWindow: { value: new THREE.Color("#e8c79a") },
    uFogNear: { value: 12 },
    uFogFar: { value: 62 },
  },
});

const groundMaterial = new THREE.ShaderMaterial({
  vertexShader: groundVertex,
  fragmentShader: groundFragment,
  uniforms: {
    uTravel: { value: 0 },
    uFogColor: { value: new THREE.Color(VOID) },
    uLine: { value: new THREE.Color("#8a8378") },
    uAccent: { value: new THREE.Color("#b38b5b") },
  },
});

function Skyline() {
  const groupsRef = useRef<Array<THREE.Group | null>>([]);
  const beaconsRef = useRef<THREE.Group>(null);
  const travel = useRef(0);
  const smoothVelocity = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const dive = sceneState.dive;

    smoothVelocity.current +=
      (sceneState.velocity - smoothVelocity.current) * 0.08;

    const speed = 6 + dive * 26 + Math.abs(smoothVelocity.current) * 1.1;
    travel.current += speed * dt;

    groupsRef.current.forEach((group, index) => {
      if (!group) return;
      group.position.z = ((index * SPACING + travel.current) % TOTAL) - TOTAL + 9;
    });

    buildingMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    groundMaterial.uniforms.uTravel.value = travel.current * 0.28;

    if (beaconsRef.current) {
      beaconsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity =
          0.35 + 0.65 * Math.abs(Math.sin(state.clock.elapsedTime * 1.1 + i));
      });
    }

    // Camera rides forward and settles lower as the dive deepens, like a
    // drone dropping into the street canyon.
    const camera = state.camera;
    camera.position.x += (sceneState.pointerX * 1.6 - camera.position.x) * 0.045;
    camera.position.y +=
      (1.4 - sceneState.pointerY * 0.9 - dive * 3.4 - camera.position.y) * 0.045;
    camera.lookAt(0, 3.2 - dive * 2.6, -26);
  });

  return (
    <>
      {Array.from({ length: BAYS }).map((_, index) => (
        <group
          key={index}
          ref={(node) => {
            groupsRef.current[index] = node;
          }}
        >
          {bays[index].map((slab, i) => (
            <mesh
              key={i}
              geometry={boxGeometry}
              material={buildingMaterial}
              position={[slab.x, GROUND_Y + slab.height / 2, 0]}
              scale={[slab.width, slab.height, slab.depth]}
            />
          ))}
        </group>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, -20]}>
        <planeGeometry args={[220, 220]} />
        <primitive object={groundMaterial} attach="material" />
      </mesh>

      <group ref={beaconsRef}>
        {[
          [-11, 19, -34],
          [13, 24, -48],
          [-16, 15, -62],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#e8c79a" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      <points geometry={dustGeometry}>
        <pointsMaterial
          size={0.06}
          color="#d8d0c2"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export function CityCorridor({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(el);

    const onPointer = (e: PointerEvent) => {
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
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
        camera={{ position: [0, 1.4, 8], fov: 62, near: 0.1, far: 120 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(VOID, 1)}
      >
        <Skyline />
      </Canvas>
    </div>
  );
}
