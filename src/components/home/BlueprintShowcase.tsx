"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { createDrive } from "@/components/three/BoothScene";
import { useCanUse3D } from "@/lib/webgl";
import { getProject } from "@/content/projects";
import SplitReveal from "@/components/motion/SplitReveal";
import Placeholder from "@/components/ui/Placeholder";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), { ssr: false });

const SLUG = "folded-light";
const project = getProject(SLUG)!;

const STATES = [
  {
    key: "blueprint",
    label: "Blueprint",
    title: "Lines before light.",
    body: "Plans, elevations and sightlines are resolved first — the drawing every later decision is checked against.",
    image: project.stages.blueprint,
  },
  {
    key: "concept",
    label: "Concept",
    title: "Massing, then material.",
    body: "Volumes are tested at true scale for flow, visibility and brand presence before a finish is chosen.",
    image: project.stages.concept,
  },
  {
    key: "reality",
    label: "Reality",
    title: "Built as drawn.",
    body: "Materials, lighting and graphics are engineered for fabrication, so the stand on site matches the render.",
    image: project.stages.reality,
  },
] as const;

/**
 * "From Blueprint to Reality": one booth, three states. Desktop gets the live
 * WebGL model (GSAP tweens the state); touch devices get the same three views
 * as rendered stills with swipe navigation.
 */
export default function BlueprintShowcase() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [drive] = useState(() => createDrive({ state: 0, assembly: 1 }));
  const [current, setCurrent] = useState(0);
  const webgl = useCanUse3D();
  const [mount3D, setMount3D] = useState(false);
  const [ready, setReady] = useState(false);
  const touched = useRef(false);

  // Only load three.js when the section approaches the viewport.
  useEffect(() => {
    if (!webgl) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount3D(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(root.current!);
    return () => io.disconnect();
  }, [webgl]);

  const go = (i: number, user = true) => {
    if (user) touched.current = true;
    setCurrent(Math.max(0, Math.min(STATES.length - 1, i)));
  };

  // Tween the 3D state + a slow orbit to give each change a camera move.
  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      gsap.to(drive, {
        state: current,
        orbit: (current - 1) * 0.35,
        duration: reduce ? 0 : 1.6,
        ease: "power3.inOut",
        overwrite: true,
      });
    },
    { dependencies: [current] },
  );

  // Walk through the three states once on first view, unless the visitor takes over.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      gsap.timeline({
        scrollTrigger: {
          trigger: el.querySelector("[data-stage]"),
          start: "top 55%",
          once: true,
          onEnter: () => {
            gsap.delayedCall(1.4, () => !touched.current && go(1, false));
            gsap.delayedCall(4.2, () => !touched.current && go(2, false));
          },
        },
      });
    },
    { scope: root },
  );

  // Swipe between states (Hammer is loaded lazily — it touches `window` at import).
  useEffect(() => {
    let mc: HammerManager | undefined;
    let cancelled = false;
    import("hammerjs").then(({ default: Hammer }) => {
      if (cancelled || !stage.current) return;
      mc = new Hammer.Manager(stage.current, { touchAction: "pan-y" });
      mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 20, velocity: 0.25 }));
      mc.on("swipeleft", () => setCurrent((c) => ((touched.current = true), Math.min(2, c + 1))));
      mc.on("swiperight", () => setCurrent((c) => ((touched.current = true), Math.max(0, c - 1))));
    });
    return () => {
      cancelled = true;
      mc?.destroy();
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(current + 1);
    else if (e.key === "ArrowLeft") go(current - 1);
    else return;
    e.preventDefault();
    (e.currentTarget.parentElement?.children[Math.max(0, Math.min(2, current + (e.key === "ArrowRight" ? 1 : -1)))] as HTMLElement)?.focus();
  };

  const s = STATES[current];

  return (
    <section ref={root} className="on-dark relative overflow-hidden py-[var(--section-y)]" aria-labelledby="b2r-title">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="shell relative">
        <div className="grid-12 items-end gap-y-8 pb-12">
          <p className="t-mono col-span-12 text-fog md:col-span-3">(04) — Process, visualised</p>
          <SplitReveal as="h2" id="b2r-title" className="t-h2 col-span-12 text-ivory md:col-span-9">
            From blueprint <span className="t-serif normal-case text-cobalt-glow">to</span> reality.
          </SplitReveal>
        </div>

        <div
          ref={stage}
          data-stage
          className="relative aspect-[4/5] w-full touch-pan-y select-none overflow-hidden bg-void sm:aspect-[16/10] lg:aspect-[21/10]"
          role="group"
          aria-roledescription="carousel"
          aria-label={`${project.title} sample stand shown as ${s.label.toLowerCase()}`}
        >
          {/* Stills: the whole experience on touch / reduced motion, and the poster while WebGL loads */}
          {STATES.map((st, i) => (
            <Image
              key={st.key}
              src={st.image.src}
              alt={i === current && !ready ? st.image.alt : ""}
              fill
              sizes="(min-width: 1024px) 90vw, 100vw"
              className={`object-cover transition-opacity duration-1000 ease-[var(--ease-arch)] ${
                i === current && !ready ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {mount3D ? (
            <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
              <SceneCanvas drive={drive} slug={SLUG} shot="cover" dust={false} idleSpin={0.05} onReady={() => setReady(true)} />
            </div>
          ) : null}

          {/* Drawing furniture */}
          <div className="pointer-events-none absolute inset-4 flex flex-col justify-between text-ivory/60 md:inset-6" aria-hidden>
            <div className="flex justify-between">
              <span className="reg-mark" />
              <span className="t-mono">
                SHT {String(current + 1).padStart(2, "0")} / 03 — {s.label}
              </span>
              <span className="reg-mark" />
            </div>
            <div className="flex items-end justify-between">
              <span className="reg-mark" />
              <span className="t-mono hidden sm:block">{project.footprint} · Scale 1:50</span>
              <span className="reg-mark" />
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6">
            <Placeholder title="Sample project rendered by the site's 3D generator, not a completed build">Sample render</Placeholder>
          </div>
        </div>

        <div className="mt-10 grid-12 gap-y-10">
          <div className="col-span-12 flex gap-2 md:col-span-6" role="group" aria-label="View state">
            {STATES.map((st, i) => (
              <button
                key={st.key}
                type="button"
                aria-pressed={i === current}
                onClick={() => go(i)}
                onKeyDown={onKey}
                className="chip min-w-0 flex-1 justify-between gap-2 px-2.5 text-ivory sm:flex-none sm:gap-3 sm:px-4"
              >
                <span>0{i + 1}</span> {st.label}
              </button>
            ))}
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8" aria-live="polite">
            <h3 key={s.key} className="t-h3 text-ivory motion-safe:animate-[fade-up_0.8s_var(--ease-out-expo)_both]">
              {s.title}
            </h3>
            <p key={`${s.key}-b`} className="t-body mt-3 text-ivory/70 motion-safe:animate-[fade-up_0.8s_0.08s_var(--ease-out-expo)_both]">
              {s.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
