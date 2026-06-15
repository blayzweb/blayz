// components/hero/HeroScene.tsx
//
// R3F replacement for HeroCanvas3D.tsx.
// - useGLTF (drei) for loading, with Suspense — no manual loader lifecycle.
// - Refs to the actual scene-graph nodes, set once on load via useEffect
//   inside the component (still fine in R3F — it's a one-time graph walk).
// - The same animProxy + GSAP pattern, but driven via useGSAP and applied
//   to refs directly — no canvas.* bag-of-properties.
//
// NOTE on orientation (bug #1):
// `screenFlipNode.rotation.x` "closed" value needs to be verified against
// the actual mesh. Common cases for a hinge authored with the lid's rest
// pose lying flat against the base:
//   - closed = 0,        open ≈ -1.7 to -1.9 rad (~-100°)
//   - closed = Math.PI,  open ≈ Math.PI - 1.8
// The values below assume closed = 0, open ≈ -1.75. If frame 1 still shows
// the screen face, try `CLOSED_X = Math.PI` and re-check.

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const CLOSED_X = 1.6;       // lid rotation.x when fully closed (verify in model)
const OPEN_X = 0;           // lid rotation.x when fully open

export interface HeroSceneRefs {
  laptopGroup: THREE.Group | null;
  lidNode: THREE.Object3D | null;
  saduGroup: THREE.Group | null;
  screenGlowLight: THREE.PointLight | null;
}

interface HeroSceneProps {
  onReady: (refs: HeroSceneRefs) => void;
}

export function HeroScene({ onReady }: HeroSceneProps) {
  const laptopGroupRef = useRef<THREE.Group>(null!);
  const saduGroupRef = useRef<THREE.Group>(null!);
  const glowLightRef = useRef<THREE.PointLight>(null!);
  const lidNodeRef = useRef<THREE.Object3D | null>(null);

  // useGLTF handles loading + Draco automatically (drei configures the
  // Draco decoder path by default). Suspense above this component handles
  // the loading state — no `if (canvas) return` checks needed.
  const { scene: laptopScene } = useGLTF("/macbook.glb");
  const { scene: saduScene } = useGLTF("/sadu_2.glb");

  // One-time setup once both models are available.
  useEffect(() => {
    if (!laptopScene || !saduGroupRef.current) return;

    // Material tuning (same as before)
    laptopScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.roughness = 0.25;
          child.material.metalness = 0.8;
        }
      }
    });

    // Find the hinge node
    const lid = laptopScene.getObjectByName("screenflip");
    if (lid) {
      lid.rotation.x = CLOSED_X; // start closed
      lidNodeRef.current = lid;
    } else {
      console.warn(
        "[HeroScene] 'screenflip' node not found — check model hierarchy with the R3F devtools outliner."
      );
    }

    // Sadu starts at zero scale — "emerging from nothing"
    saduGroupRef.current.scale.setScalar(0.001);

    onReady({
      laptopGroup: laptopGroupRef.current,
      lidNode: lidNodeRef.current,
      saduGroup: saduGroupRef.current,
      screenGlowLight: glowLightRef.current,
    });
  }, [laptopScene, saduScene, onReady]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

      {/* Screen glow — intensity driven by scroll (animProxy.glowIntensity) */}
      <pointLight
        ref={glowLightRef}
        position={[0.3, 0, 0.5]}
        intensity={0}
        color="#ff6a3d"
        distance={3}
      />

      {/* Laptop — rotation/position/scale driven by scroll */}
      <group ref={laptopGroupRef} position={[0, -0.6, 0]} scale={0.9}>
        <primitive object={laptopScene} />
      </group>

      {/* Sadu ribbon — scale/position driven by scroll */}
      <group ref={saduGroupRef} position={[1.2, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={saduScene} />
      </group>
    </>
  );
}
