import { useSyncExternalStore } from "react";
import { prefersReducedMotion } from "./gsap";

let cached: boolean | undefined;

/**
 * WebGL only where it pays off: wide screens with a fine pointer, motion
 * allowed and a working GPU context. Phones and tablets get rendered stills.
 */
export function canUse3D() {
  if (cached !== undefined) return cached;
  if (prefersReducedMotion() || !window.matchMedia("(min-width: 768px) and (pointer: fine)").matches) {
    return (cached = false);
  }
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    cached = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

const noSubscribe = () => () => {};

/** `canUse3D()` as a hook: false during SSR/hydration, the real answer after. */
export function useCanUse3D() {
  return useSyncExternalStore(noSubscribe, canUse3D, () => false);
}
