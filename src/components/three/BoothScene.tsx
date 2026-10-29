"use client";
/* eslint-disable react-hooks/immutability -- R3F: the three.js scene, camera and
   materials from useThree/useMemo are mutable by design and updated per frame. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { backgroundFor, buildBooth, createRig, frameShot, type Shot } from "@/three/booth";

/**
 * Mutable values the DOM side (GSAP, pointer, scroll) writes into and the
 * render loop reads every frame. Kept outside React state so animation never
 * triggers re-renders.
 */
export interface SceneDrive {
  /** 0 blueprint → 1 concept → 2 reality */
  state: number;
  /** 0 = parts floating apart, 1 = assembled */
  assembly: number;
  /** Extra yaw around the booth, radians */
  orbit: number;
  /** 0..1 dolly towards the booth */
  push: number;
  /** Smoothed pointer, -1..1 */
  px: number;
  py: number;
}

export const createDrive = (d: Partial<SceneDrive> = {}): SceneDrive => ({
  state: 2,
  assembly: 1,
  orbit: 0,
  push: 0,
  px: 0,
  py: 0,
  ...d,
});

/** Small seeded PRNG so the dust field is identical on every render. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function BoothScene({
  slug,
  drive,
  shot = "hero",
  shadows = true,
  dust = true,
  idleSpin = 0.035,
}: {
  slug: string;
  drive: SceneDrive;
  shot?: Shot;
  shadows?: boolean;
  dust?: boolean;
  /** Slow automatic drift, radians per second */
  idleSpin?: number;
}) {
  const { gl, scene, camera, size } = useThree();
  const model = useMemo(() => buildBooth(slug), [slug]);
  const rig = useMemo(() => createRig(model, shadows), [model, shadows]);

  // Image-based lighting, shared by all materials.
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  useEffect(() => () => model.dispose(), [model]);

  // Base framing, computed once per model / aspect.
  const frame = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(30, size.width / Math.max(1, size.height));
    const target = frameShot(cam, model, slug, shot);
    // Portrait screens: step back so the booth stays in frame.
    const aspect = size.width / Math.max(1, size.height);
    const offset = cam.position.clone().sub(target);
    if (aspect < 1) offset.multiplyScalar(1 + (1 - aspect) * 0.9);
    return { target: target.clone(), offset, fov: cam.fov };
  }, [model, slug, shot, size.width, size.height]);

  const dustPoints = useMemo(() => {
    if (!dust) return null;
    const n = 700;
    const s = Math.max(model.size.x, model.size.z);
    const pos = new Float32Array(n * 3);
    const rand = mulberry32(7);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = model.center.x + (rand() - 0.5) * s * 2.2;
      pos[i * 3 + 1] = rand() * model.size.y * 2.2;
      pos[i * 3 + 2] = model.center.z + (rand() - 0.5) * s * 2.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.035,
      color: "#e8e6ff",
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }, [dust, model]);

  useEffect(
    () => () => {
      dustPoints?.geometry.dispose();
      (dustPoints?.material as THREE.Material | undefined)?.dispose();
    },
    [dustPoints],
  );

  const last = useRef({ state: -1, assembly: -1 });
  const bg = useMemo(() => new THREE.Color(), []);
  const fog = useMemo(() => new THREE.Fog("#000", 1, 2), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const spin = useRef(0);

  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useFrame((_, dt) => {
    const d = drive;
    if (Math.abs(d.state - last.current.state) > 1e-4) {
      model.setState(d.state);
      rig.setState(d.state);
      backgroundFor(d.state, bg);
      scene.background = bg;
      fog.color.copy(bg);
      const s = Math.max(model.size.x, model.size.z);
      fog.near = s * 2.2;
      fog.far = s * 6;
      scene.environmentIntensity = d.state > 1.5 ? 0.55 : 0.8;
      last.current.state = d.state;
    }
    if (Math.abs(d.assembly - last.current.assembly) > 1e-4) {
      model.setAssembly(d.assembly);
      last.current.assembly = d.assembly;
    }

    spin.current += Math.min(dt, 0.05) * idleSpin;
    const yaw = Math.sin(spin.current) * 0.22 + d.orbit + d.px * 0.07;
    tmp.copy(frame.offset).applyAxisAngle(THREE.Object3D.DEFAULT_UP, yaw);
    tmp.multiplyScalar(1 - d.push * 0.28);
    tmp.y += d.py * 0.6;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.copy(frame.target).add(tmp);
    if (cam.fov !== frame.fov) {
      cam.fov = frame.fov;
      cam.near = 0.1;
      cam.far = 600;
      cam.updateProjectionMatrix();
    }
    cam.lookAt(frame.target);

    if (dustPoints) {
      dustPoints.rotation.y += dt * 0.01;
      (dustPoints.material as THREE.PointsMaterial).opacity = d.state > 1 ? 0.18 + (d.state - 1) * 0.3 : 0.35;
    }
  });

  return (
    <>
      <primitive object={model.group} />
      <primitive object={rig.group} />
      {dustPoints ? <primitive object={dustPoints} /> : null}
    </>
  );
}
