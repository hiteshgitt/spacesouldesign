"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import BoothScene, { type SceneDrive } from "./BoothScene";
import type { Shot } from "@/three/booth";

/**
 * WebGL booth stage. Always loaded with `next/dynamic({ ssr:false })` so three.js
 * never touches the server bundle or blocks first paint. Pauses rendering when
 * scrolled out of view and steps quality down on slow GPUs.
 */
export default function SceneCanvas({
  drive,
  slug,
  shot = "hero",
  dust = true,
  idleSpin,
  onReady,
}: {
  drive: SceneDrive;
  slug: string;
  shot?: Shot;
  dust?: boolean;
  idleSpin?: number;
  onReady?: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const [shadows, setShadows] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(wrap.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, dpr]}
        shadows={shadows ? "percentage" : false}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 34, near: 0.1, far: 600, position: [0, 4, 20] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          // Give the first frames a moment to compile shaders before fading in.
          requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
        }}
        aria-hidden
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setShadows(false);
          }}
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
        />
        <BoothScene slug={slug} drive={drive} shot={shot} shadows={shadows} dust={dust} idleSpin={idleSpin} />
      </Canvas>
    </div>
  );
}
