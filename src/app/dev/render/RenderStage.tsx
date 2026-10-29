"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { backgroundFor, buildBooth, createRig, frameShot, SHOT_SIZE, type Shot } from "@/three/booth";

declare global {
  interface Window {
    __ready?: boolean;
    __shot?: string;
  }
}

export default function RenderStage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const slug = q.get("v") ?? "monolith-pavilion";
    const shot = (q.get("shot") ?? "cover") as Exclude<Shot, "hero">;
    const scale = Number(q.get("scale") ?? 1);
    const [w, h] = SHOT_SIZE[shot] ?? SHOT_SIZE.cover;
    const state = shot === "blueprint" ? 0 : shot === "concept" ? 1 : 2;

    const canvas = ref.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(w * scale, h * scale, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = state === 2 ? 0.55 : 0.8;

    const model = buildBooth(slug);
    const rig = createRig(model);
    scene.add(model.group, rig.group);
    model.setState(state);
    rig.setState(state);
    scene.background = backgroundFor(state);
    const fogDist = Math.max(model.size.x, model.size.z);
    scene.fog = new THREE.Fog(backgroundFor(state).getHex(), fogDist * 2.2, fogDist * 6);

    const cam = new THREE.PerspectiveCamera(30, w / h, 0.1, 600);
    frameShot(cam, model, slug, shot === "blueprint" || shot === "concept" ? "cover" : shot);

    renderer.render(scene, cam);
    requestAnimationFrame(() => {
      renderer.render(scene, cam);
      window.__shot = canvas.toDataURL("image/png");
      window.__ready = true;
    });

    return () => {
      model.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} style={{ display: "block", maxWidth: "100vw", height: "auto" }} />;
}
