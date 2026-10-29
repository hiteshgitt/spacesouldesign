"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one clock. Disabled when the user prefers reduced motion; touch input
 * keeps native scrolling. Native anchors, history scroll restoration and
 * keyboard scrolling keep working because Lenis drives the real window scroll.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({
      autoRaf: false,
      anchors: { offset: -64 },
      lerp: 0.1,
      wheelMultiplier: 1,
      syncTouch: false,
      stopInertiaOnNavigate: true,
      prevent: (node) => node.closest("[data-lenis-prevent], dialog, [role='dialog']") !== null,
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expose the instance once created
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // After client navigations: re-measure page height and triggers.
  useEffect(() => {
    lenis?.resize();
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
