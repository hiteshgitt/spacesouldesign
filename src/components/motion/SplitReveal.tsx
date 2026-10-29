"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** `scroll` waits for the element to enter the viewport; `load` plays immediately. */
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  by?: "lines" | "words" | "chars";
  id?: string;
};

/** Masked line/word reveal built on GSAP SplitText. Text stays real, selectable and readable without JS. */
export default function SplitReveal({
  as: Tag = "div",
  children,
  className,
  trigger = "scroll",
  delay = 0,
  stagger = 0.09,
  by = "lines",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      let played = false;
      const split = SplitText.create(el, {
        type: by === "lines" ? "lines" : `lines,${by}`,
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          const targets = by === "lines" ? self.lines : by === "words" ? self.words : self.chars;
          gsap.set(el, { autoAlpha: 1 });
          if (played) return;
          return gsap.from(targets, {
            yPercent: 115,
            rotate: by === "chars" ? 0 : 2,
            transformOrigin: "0% 0%",
            duration: 1.25,
            ease: "expo.out",
            stagger,
            delay,
            onComplete: () => void (played = true),
            scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal="split" id={id}>
      {children}
    </Tag>
  );
}
