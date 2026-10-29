"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Fades + lifts children (or `[data-reveal-item]` descendants, staggered) when scrolled into view. */
export default function Reveal({
  as: Tag = "div",
  children,
  className,
  y = 28,
  stagger = 0.08,
  delay = 0,
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  delay?: number;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const items = el.querySelectorAll("[data-reveal-item]");
      const targets = items.length ? items : [el];
      if (items.length) gsap.set(el, { autoAlpha: 1 });
      if (prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          stagger,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} data-reveal="fade" {...rest}>
      {children}
    </Tag>
  );
}
