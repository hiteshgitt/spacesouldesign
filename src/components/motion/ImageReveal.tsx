"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Architectural wipe: the frame opens with a clip-path while the image inside
 * settles from a slight zoom. Optional scroll parallax on the inner layer.
 */
export default function ImageReveal({
  children,
  className = "",
  from = "bottom",
  parallax = 0,
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  from?: "bottom" | "left" | "right" | "top";
  parallax?: number;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const inner = el.querySelector<HTMLElement>("[data-inner]")!;
      if (prefersReducedMotion()) return;
      const clip = {
        bottom: "inset(100% 0% 0% 0%)",
        top: "inset(0% 0% 100% 0%)",
        left: "inset(0% 100% 0% 0%)",
        right: "inset(0% 0% 0% 100%)",
      }[from];
      gsap
        .timeline({
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
        })
        .fromTo(el, { clipPath: clip }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" })
        .fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
      if (parallax) {
        gsap.fromTo(
          inner.firstElementChild,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`img-frame ${className}`} data-reveal="clip">
      <div data-inner className="absolute inset-0">
        <div className={parallax ? "absolute inset-x-0 -inset-y-[10%]" : "absolute inset-0"}>{children}</div>
      </div>
    </div>
  );
}
