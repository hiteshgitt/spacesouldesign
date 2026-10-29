"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Draws every stroked SVG path/line inside on scroll, like a pen plotting a technical drawing. */
export default function DrawLines({
  children,
  className,
  scrub = false,
  duration = 1.8,
}: {
  children: ReactNode;
  className?: string;
  scrub?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const paths = ref.current!.querySelectorAll("path, line, polyline, rect, circle");
      gsap.fromTo(
        paths,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration,
          ease: "power3.inOut",
          stagger: 0.05,
          scrollTrigger: scrub
            ? { trigger: ref.current, start: "top 80%", end: "bottom 40%", scrub: 0.6 }
            : { trigger: ref.current, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
