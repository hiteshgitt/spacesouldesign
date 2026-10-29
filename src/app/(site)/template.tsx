"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// The first page load has its own intro; only client navigations get the curtain.
let hasMounted = false;

/**
 * Page transition: a void panel lifts off the incoming page like a sheet
 * being pulled from a plan chest. Templates remount on every navigation, so
 * this runs once per route change. Skipped entirely for reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = curtain.current!;
    if (!hasMounted || prefersReducedMotion()) {
      hasMounted = true;
      gsap.set(el, { autoAlpha: 0 });
      return;
    }
    gsap
      .timeline({ onComplete: () => gsap.set(el, { autoAlpha: 0 }) })
      .set(el, { autoAlpha: 1, yPercent: 0 })
      .to(el.querySelector("[data-curtain-line]"), { scaleX: 1, duration: 0.45, ease: "power2.inOut" })
      .to(el, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "+=0.05");
  });

  return (
    <>
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none invisible fixed inset-0 z-[90] flex items-center bg-void"
      >
        <span data-curtain-line className="mx-[var(--gutter)] h-px w-full origin-left scale-x-0 bg-cobalt-glow" />
      </div>
      {children}
    </>
  );
}
