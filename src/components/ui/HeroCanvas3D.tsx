"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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

export const HeroCanvas3D = forwardRef<HeroCanvas3DHandle, HeroCanvas3DProps>((props, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to pass to parent
  const laptopGroupRef = useRef<THREE.Group | null>(null);
  const lidGroupRef = useRef<THREE.Object3D | null>(null);
  const saduGroupRef = useRef<THREE.Group | null>(null);
  const logoGroupRef = useRef<THREE.Group | null>(null);
  const screenGlowLightRef = useRef<THREE.PointLight | null>(null);
  const saduTargetScaleXRef = useRef<number>(1.0);

  // Logo material uniforms
  const logoUniforms = useRef({
    uProgress: { value: 0.0 },
    uMinX: { value: -5.0 }, // default bounds
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Perspective Camera: standard framing looking at center
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Create container groups for the objects
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(2.4, -0.6, 0); // laptop starts on the right
    laptopGroup.rotation.set(0.2, -0.3, 0); // initial slight angle
    scene.add(laptopGroup);
    laptopGroupRef.current = laptopGroup;

    const saduGroup = new THREE.Group();
    saduGroup.position.set(1.2, -0.2, 0.05); // positioned near screen plane of sideways laptop
    scene.add(saduGroup);
    saduGroupRef.current = saduGroup;

    const logoGroup = new THREE.Group();
    logoGroup.position.set(-2.4, 0.4, 0); // brand logo starts on the left
    scene.add(logoGroup);
    logoGroupRef.current = logoGroup;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.0); // bright ambient
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffffff", 1.5); // key light from top right
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Dedicated directional light directly in front of the logo to keep colors bright
    const logoLight = new THREE.DirectionalLight("#ffffff", 1.6);
    logoLight.position.set(-3.5, 2.0, 5.0);
    scene.add(logoLight);

    // Warm red/orange point light inside the laptop screen to simulate screen glow
    const screenGlowLight = new THREE.PointLight("#ff3800", 0.0, 6); // starts off
    screenGlowLight.position.set(0, 0.8, 0.1);
    laptopGroup.add(screenGlowLight);
    screenGlowLightRef.current = screenGlowLight;

    // 3. Load MacBook Pro Model (with Draco decompressor)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
      "/macbook.glb",
      (gltf) => {
        const model = gltf.scene;
        
        // Scale and position base model
        model.scale.set(0.9, 0.9, 0.9);
        model.position.set(0, 0, 0);
        
        // Enable shadows and style standard materials
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.roughness = 0.25;
              child.material.metalness = 0.8;
            }
          }
        });

        laptopGroup.add(model);

        // Find the lid hinge node ("screenflip")
        const screenFlipNode = model.getObjectByName("screenflip");
        if (screenFlipNode) {
          lidGroupRef.current = screenFlipNode;
          // Start closed flat on chassis (X rotation near 1.6 rad)
          screenFlipNode.rotation.x = 1.6;
        } else {
          console.warn("Could not find 'screenflip' node in MacBook model");
        }
      },
      undefined,
      (err) => console.error("Error loading MacBook model:", err)
    );

    // 4. Load Sadu Ribbon Model
    gltfLoader.load(
      "/sadu_ribbon.glb",
      (gltf) => {
        const ribbon = gltf.scene;
        
        // Measure model dimensions
        const box = new THREE.Box3().setFromObject(ribbon);
        const size = new THREE.Vector3();
        box.getSize(size);
        console.log("Original Sadu ribbon size:", size);

        // Sort axes to find length (longest) and height (second longest)
        const axes = [
          { name: "x" as const, val: size.x },
          { name: "y" as const, val: size.y },
          { name: "z" as const, val: size.z }
        ];
        axes.sort((a, b) => b.val - a.val);

        const lengthAxis = axes[0].name;
        const heightAxis = axes[1].name;

        // Scale so height is exactly 0.55 units in our scene
        const targetHeight = 0.55;
        const scaleFactor = targetHeight / axes[1].val;
        ribbon.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Compute local box after scaling to offset hinge to origin
        const scaledBox = new THREE.Box3().setFromObject(ribbon);
        const scaledSize = new THREE.Vector3();
        scaledBox.getSize(scaledSize);
        
        // The Sadu ribbon starts at the laptop (on the right) and grows leftwards (negative direction).
        // Align ribbon start edge (max length value) to origin [0,0,0] so it extends leftwards when scaled.
        if (lengthAxis === "x") {
          ribbon.position.x = -scaledBox.max.x;
        } else if (lengthAxis === "z") {
          // Rotate 90 deg around Y to align Z length axis with scene X axis
          ribbon.rotation.y = Math.PI / 2;
          const rotatedBox = new THREE.Box3().setFromObject(ribbon);
          ribbon.position.x = -rotatedBox.max.x;
        } else if (lengthAxis === "y") {
          // Rotate 90 deg around Z to align Y length axis with scene X axis
          ribbon.rotation.z = Math.PI / 2;
          const rotatedBox = new THREE.Box3().setFromObject(ribbon);
          ribbon.position.x = -rotatedBox.max.x;
        }

        // Target distance from laptop screen (x = 1.2) to logo center (x = -2.4) is 3.6 units.
        // The normalized length is scaledSize[lengthAxis]
        const normalizedLength = lengthAxis === "x" ? scaledSize.x : (lengthAxis === "z" ? scaledSize.z : scaledSize.y);
        saduTargetScaleXRef.current = 3.65 / normalizedLength;

        // Traverse to style material
        ribbon.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.roughness = 0.4;
              child.material.metalness = 0.15;
            }
          }
        });

        saduGroup.add(ribbon);
      },
      undefined,
      (err) => console.error("Error loading Sadu ribbon model:", err)
    );

    // 5. Load and Extrude Brand SVG Logo
    const svgLoader = new SVGLoader();
    svgLoader.load(
      "/blayz_logo.svg",
      (data) => {
        const paths = data.paths;
        const group = new THREE.Group();

        // Extrusion settings for premium 3D look
        const extrudeSettings = {
          depth: 12,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: 1.5,
          bevelThickness: 1.5,
        };

        // Standard material with injected custom shader code for color wipe
        const customMaterial = new THREE.MeshStandardMaterial({
          roughness: 0.35,
          metalness: 0.2,
        });

        // Modify standard shader with onBeforeCompile
        customMaterial.onBeforeCompile = (shader) => {
          shader.uniforms.uProgress = logoUniforms.current.uProgress;
          shader.uniforms.uMinX = logoUniforms.current.uMinX;
          shader.uniforms.uMaxX = logoUniforms.current.uMaxX;
          shader.uniforms.uColorOrange = logoUniforms.current.uColorOrange;
          shader.uniforms.uColorWhite = logoUniforms.current.uColorWhite;

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
            
            // Normalize current fragment X position in world space
            float progressX = (vWorldPosition.x - uMinX) / (uMaxX - uMinX);
            
            // Cutoff moves from right (1.0) to left (0.0) as uProgress goes from 0.0 to 1.0
            float cutoff = 1.0 - uProgress;
            
            // Soft gradient boundary width in world space coordinates
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

          // Center the entire group
          const bbox = new THREE.Box3().setFromObject(group);
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          
          group.children.forEach((child) => {
            child.position.sub(center);
          });

          // Scale the logo to fit scene dimension (SVG units are very large ~1300 width)
          const scaleFactor = 0.0038;
          group.scale.set(scaleFactor, scaleFactor, scaleFactor);
          group.position.set(0, 0, 0); // locally centered in logoGroup

          // Flip Y/Z rotation to face camera (SVG coordinates are flipped vertically)
          group.rotation.x = Math.PI;

          logoGroup.add(group);

          // Compute global world bounds of logoGroup to set uniforms accurately
          logoGroup.updateMatrixWorld(true);
          const worldBbox = new THREE.Box3().setFromObject(logoGroup);
          logoUniforms.current.uMinX.value = worldBbox.min.x;
          logoUniforms.current.uMaxX.value = worldBbox.max.x;
        }
      },
      undefined,
      (err) => console.error("Error loading SVG logo:", err)
    );

    // 6. Render Animation Loop
    let animId = 0;
    const tick = () => {
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // 7. Responsive Resize Listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      
      // Update responsive coordinates
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        laptopGroup.position.set(0, -0.6, 0);
        logoGroup.position.set(0, 0.8, 0);
        saduGroup.position.set(0, -0.2, 0.05);
      } else {
        laptopGroup.position.set(2.4, -0.6, 0);
        logoGroup.position.set(-2.4, 0.4, 0);
        saduGroup.position.set(1.2, -0.2, 0.05); // aligned near vertical screen of rotated laptop
      }

      // Re-calculate world bounds of logoGroup on resize/re-render to maintain shader integrity
      if (logoGroup.children.length > 0) {
        logoGroup.updateMatrixWorld(true);
        const worldBbox = new THREE.Box3().setFromObject(logoGroup);
        logoUniforms.current.uMinX.value = worldBbox.min.x;
        logoUniforms.current.uMaxX.value = worldBbox.max.x;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // trigger initially

    // Trigger onReady to let the parent know the WebGL canvas is mounted and refs are populated
    props.onReady?.();

    // 8. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" />;
});

HeroCanvas3D.displayName = "HeroCanvas3D";
