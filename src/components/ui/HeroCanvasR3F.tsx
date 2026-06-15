"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle, Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
export interface HeroCanvas3DHandle {
  laptopGroup: THREE.Group | null;
  lidGroup: THREE.Object3D | null;
  saduGroup: THREE.Group | null;
  logoGroup: THREE.Group | null;
  logoUniforms: {
    uProgress: { value: number };
    uMinX: { value: number };
    uMaxX: { value: number };
    uColorOrange: { value: THREE.Color };
    uColorWhite: { value: THREE.Color };
  };
  screenGlowLight: THREE.PointLight | null;
  saduTargetScaleX: number;
}

export interface HeroCanvas3DProps {
  onReady?: () => void;
}

// 1. Declarative Macbook Sub-component
function Macbook({ groupRef, lidRef, screenGlowRef }: any) {
  const { scene } = useGLTF("/macbook.glb");
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (clonedScene) {
      if (clonedScene.userData.isInitialized) return;
      clonedScene.userData.isInitialized = true;

      // Find the screenflip node
      const screenFlipNode = clonedScene.getObjectByName("screenflip");
      if (screenFlipNode) {
        lidRef.current = screenFlipNode;
        screenFlipNode.rotation.x = 1.6; // starts closed
      }
      
      // Enable shadows and style standard materials
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = 0.25;
            child.material.metalness = 0.8;
          }
        }
      });
    }
  }, [clonedScene, lidRef]);

  return (
    <group ref={groupRef} position={[2.4, -0.6, 0]} rotation={[0.2, -0.3, 0]} scale={[0.9, 0.9, 0.9]}>
      <primitive object={clonedScene} />
      {/* Screen glow PointLight inside the lid hinge group */}
      <pointLight
        ref={screenGlowRef}
        color="#ff3800"
        intensity={0.0}
        distance={6}
        position={[0, 0.8, 0.1]}
      />
    </group>
  );
}

// 2. Declarative SaduRibbon Sub-component
function SaduRibbon({ groupRef, targetScaleXRef }: any) {
  const { scene } = useGLTF("/sadu_ribbon.glb");
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (clonedScene) {
      if (clonedScene.userData.isScaled) return;
      clonedScene.userData.isScaled = true;

      // Reset all child nodes' local positions and rotations to center the model at [0,0,0]
      clonedScene.traverse((child) => {
        if (child !== clonedScene) {
          child.position.set(0, 0, 0);
          child.rotation.set(0, 0, 0);
        }
      });

      // Measure original bounds (now centered at [0,0,0])
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Sort axes to find length (longest) and height (second longest)
      const axes = [
        { name: "x" as const, val: size.x },
        { name: "y" as const, val: size.y },
        { name: "z" as const, val: size.z }
      ];
      axes.sort((a, b) => b.val - a.val);

      const lengthAxis = axes[0].name;
      const heightAxis = axes[1].name;

      // Scale ribbon height to exactly 0.55 units
      const targetHeight = 0.55;
      const scaleFactor = targetHeight / axes[1].val;
      clonedScene.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Offset starting hinge edge to local origin [0,0,0]
      const scaledBox = new THREE.Box3().setFromObject(clonedScene);
      const scaledSize = new THREE.Vector3();
      scaledBox.getSize(scaledSize);

      if (lengthAxis === "x") {
        clonedScene.position.x = -scaledBox.max.x;
      } else if (lengthAxis === "z") {
        clonedScene.rotation.y = Math.PI / 2;
        const rotatedBox = new THREE.Box3().setFromObject(clonedScene);
        clonedScene.position.x = -rotatedBox.max.x;
      } else if (lengthAxis === "y") {
        clonedScene.rotation.z = Math.PI / 2;
        const rotatedBox = new THREE.Box3().setFromObject(clonedScene);
        clonedScene.position.x = -rotatedBox.max.x;
      }

      // Calculate exact target horizontal scale factor for GSAP stretching
      const normalizedLength = lengthAxis === "x" ? scaledSize.x : (lengthAxis === "z" ? scaledSize.z : scaledSize.y);
      targetScaleXRef.current = 3.65 / normalizedLength;

      // Style materials
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = 0.4;
            child.material.metalness = 0.15;
          }
        }
      });
    }
  }, [clonedScene, targetScaleXRef]);

  return (
    <group ref={groupRef} position={[1.2, -0.2, 0.05]} scale={[0.001, 0.001, 0.001]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// 3. Declarative extruded Logo3D Sub-component
function Logo3D({ groupRef, uniforms }: any) {
  useEffect(() => {
    const loader = new SVGLoader();
    loader.load("/blayz_logo.svg", (data) => {
      const paths = data.paths;
      const group = new THREE.Group();

      const extrudeSettings = {
        depth: 12,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 1.5,
        bevelThickness: 1.5,
      };

      const customMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.35,
        metalness: 0.2,
      });

      customMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uProgress = uniforms.uProgress;
        shader.uniforms.uMinX = uniforms.uMinX;
        shader.uniforms.uMaxX = uniforms.uMaxX;
        shader.uniforms.uColorOrange = uniforms.uColorOrange;
        shader.uniforms.uColorWhite = uniforms.uColorWhite;

        shader.vertexShader = `
          varying vec3 vWorldPosition;
          ${shader.vertexShader}
        `.replace(
          "#include <begin_vertex>",
          `
          #include <begin_vertex>
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          `
        );

        shader.fragmentShader = `
          varying vec3 vWorldPosition;
          uniform float uProgress;
          uniform float uMinX;
          uniform float uMaxX;
          uniform vec3 uColorOrange;
          uniform vec3 uColorWhite;
          ${shader.fragmentShader}
        `.replace(
          "#include <color_fragment>",
          `
          #include <color_fragment>
          float progressX = (vWorldPosition.x - uMinX) / (uMaxX - uMinX);
          float cutoff = 1.0 - uProgress;
          float edgeWidth = 0.045;
          float mask = smoothstep(cutoff - edgeWidth, cutoff + edgeWidth, progressX);
          diffuseColor.rgb = mix(uColorOrange, uColorWhite, mask);
          `
        );
      };

      const geometries: THREE.ExtrudeGeometry[] = [];
      paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          geometries.push(geometry);
        });
      });

      if (geometries.length > 0) {
        geometries.forEach((geo) => {
          const mesh = new THREE.Mesh(geo, customMaterial);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

        // Center group vertices
        const bbox = new THREE.Box3().setFromObject(group);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        group.children.forEach((child) => {
          child.position.sub(center);
        });

        const scaleFactor = 0.0038;
        group.scale.set(scaleFactor, scaleFactor, scaleFactor);
        group.rotation.x = Math.PI;

        if (groupRef.current) {
          while (groupRef.current.children.length > 0) {
            groupRef.current.remove(groupRef.current.children[0]);
          }
          groupRef.current.add(group);

          // Compute world bounds to set shader uniforms
          groupRef.current.updateMatrixWorld(true);
          const worldBbox = new THREE.Box3().setFromObject(groupRef.current);
          uniforms.uMinX.value = worldBbox.min.x;
          uniforms.uMaxX.value = worldBbox.max.x;
        }
      }
    });
  }, [groupRef, uniforms]);

  return <group ref={groupRef} position={[-2.4, 0.4, 0]} />;
}

// Helper to handle responsive resize coordinate updates
function ResponsiveSetup({ laptopGroupRef, logoGroupRef, saduGroupRef, uniforms }: any) {
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        laptopGroupRef.current?.position.set(0, -0.6, 0);
        logoGroupRef.current?.position.set(0, 0.8, 0);
        saduGroupRef.current?.position.set(0, -0.2, 0.05);
      } else {
        laptopGroupRef.current?.position.set(2.4, -0.6, 0);
        logoGroupRef.current?.position.set(-2.4, 0.4, 0);
        saduGroupRef.current?.position.set(1.2, -0.2, 0.05);
      }

      // Refresh logo uniforms on resize repositioning
      if (logoGroupRef.current) {
        logoGroupRef.current.updateMatrixWorld(true);
        const worldBbox = new THREE.Box3().setFromObject(logoGroupRef.current);
        uniforms.uMinX.value = worldBbox.min.x;
        uniforms.uMaxX.value = worldBbox.max.x;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [laptopGroupRef, logoGroupRef, saduGroupRef, uniforms]);

  return null;
}

// Ready Notifier to coordinate parent state once Suspense completes asset loading
function ReadyNotifier({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

// Main R3F Canvas Container
export const HeroCanvasR3F = forwardRef<HeroCanvas3DHandle, HeroCanvas3DProps>((props, ref) => {
  const laptopGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Object3D>(null);
  const saduGroupRef = useRef<THREE.Group>(null);
  const logoGroupRef = useRef<THREE.Group>(null);
  const screenGlowLightRef = useRef<THREE.PointLight>(null);
  const saduTargetScaleXRef = useRef<number>(1.0);

  const logoUniforms = useRef({
    uProgress: { value: 0.0 },
    uMinX: { value: -5.0 },
    uMaxX: { value: 0.0 },
    uColorOrange: { value: new THREE.Color("#FA3602") },
    uColorWhite: { value: new THREE.Color("#FFFFFF") },
  });

  useImperativeHandle(ref, () => ({
    get laptopGroup() { return laptopGroupRef.current; },
    get lidGroup() { return lidGroupRef.current; },
    get saduGroup() { return saduGroupRef.current; },
    get logoGroup() { return logoGroupRef.current; },
    logoUniforms: logoUniforms.current,
    get screenGlowLight() { return screenGlowLightRef.current; },
    get saduTargetScaleX() { return saduTargetScaleXRef.current; },
  }));

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.5, 9.5], fov: 45 }}
      >
        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight castShadow position={[5, 8, 4]} intensity={1.5} />
        <directionalLight position={[-3.5, 2.0, 5.0]} intensity={1.6} />

        <Suspense fallback={null}>
          <Macbook
            groupRef={laptopGroupRef}
            lidRef={lidGroupRef}
            screenGlowRef={screenGlowLightRef}
          />
          <SaduRibbon
            groupRef={saduGroupRef}
            targetScaleXRef={saduTargetScaleXRef}
          />
          <Logo3D
            groupRef={logoGroupRef}
            uniforms={logoUniforms.current}
          />
          <ResponsiveSetup
            laptopGroupRef={laptopGroupRef}
            logoGroupRef={logoGroupRef}
            saduGroupRef={saduGroupRef}
            uniforms={logoUniforms.current}
          />
          <ReadyNotifier onReady={props.onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
});

HeroCanvasR3F.displayName = "HeroCanvasR3F";

// Preload GLTF models for speed
useGLTF.preload("/macbook.glb");
useGLTF.preload("/sadu_ribbon.glb");
