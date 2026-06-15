"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Interface for Particle trajectories
interface Particle3D {
  mesh: THREE.Mesh;
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  scaleStart: number;
  scaleEnd: number;
}

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
  particleProxy: { progress: number };
}

export const HeroCanvas3D = forwardRef<HeroCanvas3DHandle, {}>((_, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to pass to parent
  const laptopGroupRef = useRef<THREE.Group | null>(null);
  const lidGroupRef = useRef<THREE.Object3D | null>(null);
  const saduGroupRef = useRef<THREE.Group | null>(null);
  const logoGroupRef = useRef<THREE.Group | null>(null);
  const screenGlowLightRef = useRef<THREE.PointLight | null>(null);

  // Logo material uniforms
  const logoUniforms = useRef({
    uProgress: { value: 0.0 },
    uMinX: { value: 0.0 },
    uMaxX: { value: 0.0 },
    uColorOrange: { value: new THREE.Color("#FA3602") },
    uColorWhite: { value: new THREE.Color("#FFFFFF") },
  });

  // Particle tracking
  const particleProxy = useRef({ progress: 0.0 });
  const particlesList = useRef<Particle3D[]>([]);

  useImperativeHandle(ref, () => ({
    get laptopGroup() { return laptopGroupRef.current; },
    get lidGroup() { return lidGroupRef.current; },
    get saduGroup() { return saduGroupRef.current; },
    get logoGroup() { return logoGroupRef.current; },
    logoUniforms: logoUniforms.current,
    get screenGlowLight() { return screenGlowLightRef.current; },
    get particleProxy() { return particleProxy.current; },
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
    saduGroup.position.set(2.4, -0.2, 0.05); // positioned near screen plane
    scene.add(saduGroup);
    saduGroupRef.current = saduGroup;

    const logoGroup = new THREE.Group();
    logoGroup.position.set(-2.4, 0.4, 0); // brand logo starts on the left
    scene.add(logoGroup);
    logoGroupRef.current = logoGroup;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight("#fff3eb", 0.75); // warm soft ambient
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffffff", 1.8); // crisp key light
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    scene.add(dirLight);

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
        
        // Enable shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // enhance material premium feel
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
        
        // Adjust the ribbon's orientation and scale
        // Ribbon starts flat-scaled along its main extension direction (Z or X)
        // Let's position it to emerge directly from the laptop screen screenflip plane
        ribbon.scale.set(0.001, 0.001, 0.001); // starts hidden
        
        // Traverse to style material
        ribbon.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.roughness = 0.5;
              child.material.metalness = 0.1;
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
          roughness: 0.3,
          metalness: 0.25,
        });

        // Modify standard shader with onBeforeCompile
        customMaterial.onBeforeCompile = (shader) => {
          shader.uniforms.uProgress = logoUniforms.current.uProgress;
          shader.uniforms.uMinX = logoUniforms.current.uMinX;
          shader.uniforms.uMaxX = logoUniforms.current.uMaxX;
          shader.uniforms.uColorOrange = logoUniforms.current.uColorOrange;
          shader.uniforms.uColorWhite = logoUniforms.current.uColorWhite;

          shader.vertexShader = `
            varying vec3 vLocalPosition;
            ${shader.vertexShader}
          `.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>
            vLocalPosition = position;
            `
          );

          shader.fragmentShader = `
            varying vec3 vLocalPosition;
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
            
            // Normalize current local position X
            float progressX = (vLocalPosition.x - uMinX) / (uMaxX - uMinX);
            
            // Cutoff moves from right (1.0) to left (0.0) as uProgress goes from 0.0 to 1.0
            float cutoff = 1.0 - uProgress;
            
            // Soft gradient boundary width
            float edgeWidth = 0.03;
            float mask = smoothstep(cutoff - edgeWidth, cutoff + edgeWidth, progressX);
            
            diffuseColor.rgb = mix(uColorOrange, uColorWhite, mask);
            `
          );
        };

        let mergedGeometry: THREE.BufferGeometry | null = null;
        const geometries: THREE.ExtrudeGeometry[] = [];

        paths.forEach((path) => {
          const shapes = SVGLoader.createShapes(path);
          shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geometries.push(geometry);
          });
        });

        if (geometries.length > 0) {
          // Merge geometries manually or group meshes
          // To compute simple bounding box across the logo, grouping is clean. We calculate global bounding box:
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

          // Re-compute bounding box of the centered group to set uniforms
          const reBbox = new THREE.Box3().setFromObject(group);
          logoUniforms.current.uMinX.value = reBbox.min.x;
          logoUniforms.current.uMaxX.value = reBbox.max.x;

          // Scale the logo to fit scene dimension (SVG units are very large ~1300 width)
          const scaleFactor = 0.0038;
          group.scale.set(scaleFactor, scaleFactor, scaleFactor);
          group.position.set(0, 0, 0); // locally centered in logoGroup

          // Flip Y/Z rotation to face camera (SVG coordinates are flipped vertically)
          group.rotation.x = Math.PI;

          logoGroup.add(group);
        }
      },
      undefined,
      (err) => console.error("Error loading SVG logo:", err)
    );

    // 6. Build Particle System (24 items, flying towards camera)
    const particleColors = ["#FA3602", "#ffa37a", "#ffc83b", "#ffffff"];
    const asciiChars = ["< />", "{ }", "[ ]", "◇", "+", "x", "01", "10", "/", "*", "&&", "||"];

    // Sadu diamond geometry
    const saduGeo = new THREE.BoxGeometry(0.18, 0.18, 0.04);
    saduGeo.rotateZ(Math.PI / 4); // rotate to look like a Sadu diamond shape

    const createTextTexture = (text: string, color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, 64, 64);
        ctx.font = "bold 24px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.fillText(text, 32, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const count = 24;
    for (let i = 0; i < count; i++) {
      const isSadu = i % 2 === 0;
      const color = particleColors[i % particleColors.length];
      let mesh: THREE.Mesh;

      if (isSadu) {
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
        });
        mesh = new THREE.Mesh(saduGeo, mat);
      } else {
        const txt = asciiChars[Math.floor(i / 2) % asciiChars.length];
        const texture = createTextTexture(txt, color);
        const mat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), mat);
      }

      // Hide initially
      (mesh.material as any).opacity = 0;
      scene.add(mesh);

      // Trajectories (starting near screen, flying out past screen)
      const startX = laptopGroup.position.x + (Math.random() - 0.5) * 0.8;
      const startY = laptopGroup.position.y + 0.3 + (Math.random() - 0.5) * 0.5;
      const startZ = laptopGroup.position.z + 0.1;

      const angle = Math.random() * Math.PI * 2;
      const spread = 2.0 + Math.random() * 3.5;
      const endX = startX + Math.cos(angle) * spread - 1.5;
      const endY = startY + Math.sin(angle) * spread + 0.5;
      const endZ = startZ + 6.0 + Math.random() * 3.0; // flies way forward

      particlesList.current.push({
        mesh,
        startX,
        startY,
        startZ,
        endX,
        endY,
        endZ,
        rotSpeedX: (Math.random() - 0.5) * 4,
        rotSpeedY: (Math.random() - 0.5) * 4,
        rotSpeedZ: (Math.random() - 0.5) * 4,
        scaleStart: 0.1,
        scaleEnd: 1.5 + Math.random() * 1.5,
      });
    }

    // 7. Render Animation Loop
    let animId = 0;
    const tick = () => {
      // Update particles position in coordinate space based on scroll progress
      const pProgress = particleProxy.current.progress;
      particlesList.current.forEach((p) => {
        p.mesh.position.x = THREE.MathUtils.lerp(p.startX, p.endX, pProgress);
        p.mesh.position.y = THREE.MathUtils.lerp(p.startY, p.endY, pProgress);
        p.mesh.position.z = THREE.MathUtils.lerp(p.startZ, p.endZ, pProgress);

        p.mesh.rotation.x = p.rotSpeedX * pProgress;
        p.mesh.rotation.y = p.rotSpeedY * pProgress;
        p.mesh.rotation.z = p.rotSpeedZ * pProgress;

        const currentScale = THREE.MathUtils.lerp(p.scaleStart, p.scaleEnd, pProgress);
        p.mesh.scale.setScalar(currentScale);

        // Opacity fade in/out
        if (pProgress <= 0.05) {
          (p.mesh.material as any).opacity = 0;
        } else if (pProgress > 0.05 && pProgress <= 0.2) {
          (p.mesh.material as any).opacity = (pProgress - 0.05) / 0.15;
        } else if (pProgress > 0.2 && pProgress <= 0.6) {
          (p.mesh.material as any).opacity = 1.0;
        } else if (pProgress > 0.6 && pProgress <= 0.95) {
          (p.mesh.material as any).opacity = Math.max(0, 1.0 - (pProgress - 0.6) / 0.35);
        } else {
          (p.mesh.material as any).opacity = 0;
        }
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // 8. Responsive Resize Listener
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
        saduGroup.position.set(2.4, -0.2, 0.05);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // trigger initially

    // 9. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose geometries & materials
      saduGeo.dispose();
      particlesList.current.forEach((p) => {
        if (p.mesh instanceof THREE.Mesh) {
          p.mesh.geometry.dispose();
          if (Array.isArray(p.mesh.material)) {
            p.mesh.material.forEach((m) => m.dispose());
          } else {
            p.mesh.material.dispose();
          }
        }
      });
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" />;
});

HeroCanvas3D.displayName = "HeroCanvas3D";
