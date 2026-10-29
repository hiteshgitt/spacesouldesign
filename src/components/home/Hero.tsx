"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { createDrive } from "@/components/three/BoothScene";
import { canUse3D } from "@/lib/webgl";
import Placeholder from "@/components/ui/Placeholder";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), { ssr: false });

const SLUG = "monolith-pavilion";


export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [drive] = useState(() => createDrive({ state: 0, assembly: 0 }));
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Deferred to idle time so the canvas never competes with LCP text.
    const enable = () => setWebgl(canUse3D());
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(enable, { timeout: 1200 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(enable, 300);
    return () => clearTimeout(t);
  }, []);

  // Text intro
  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) {
        gsap.set(el.querySelectorAll("[data-reveal]"), { autoAlpha: 1 });
        return;
      }
      // Headline and copy reveal in CSS (.hero-line, .hero-fade) so they paint before hydration.
      gsap.fromTo(el.querySelectorAll("[data-hero-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut", delay: 0.35 });

      // Scroll: the headline drifts and fades while the camera pushes in.
      gsap.to(el.querySelector("[data-hero-copy]"), {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (st) => (drive.push = st.progress),
      });
    },
    { scope: root },
  );

  // 3D intro: parts assemble as blueprint linework, then materialise.
  useGSAP(
    () => {
      if (!ready) return;
      gsap
        .timeline()
        .to(drive, { assembly: 1, duration: 2.4, ease: "power2.out" })
        .to(drive, { state: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.3")
        .to(drive, { state: 2, duration: 1.6, ease: "power2.inOut" }, "+=0.1");
    },
    { dependencies: [ready] },
  );

  // Pointer parallax (smoothed on the GSAP ticker)
  useEffect(() => {
    if (!webgl) return;
    const target = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      target.x = (e.clientX / innerWidth) * 2 - 1;
      target.y = (e.clientY / innerHeight) * 2 - 1;
    };
    const tick = () => {
      drive.px += (target.x - drive.px) * 0.04;
      drive.py += (target.y - drive.py) * 0.04;
    };
    window.addEventListener("pointermove", move, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      gsap.ticker.remove(tick);
    };
  }, [webgl, drive]);

  return (
    <section
      ref={root}
      className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Poster: always rendered (LCP + mobile + no-WebGL), faded out once the scene is live */}
      <div
        className={`absolute inset-0 -z-10 transition-opacity duration-[1600ms] ${ready ? "opacity-0" : "opacity-100"}`}
        aria-hidden
      >
        <Image
          src={`/images/projects/${SLUG}/cover.jpg`}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-[60%_50%] opacity-80 motion-safe:animate-[slow-zoom_14s_var(--ease-out-expo)_both]"
        />
      </div>
      {webgl ? (
        <div
          className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <SceneCanvas drive={drive} slug={SLUG} onReady={() => setReady(true)} />
        </div>
      ) : null}
      {/* Legibility gradients */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(4_5_26/0.6)_0%,rgb(4_5_26/0.15)_22%,rgb(4_5_26/0.35)_50%,rgb(4_5_26/0.95)_100%),linear-gradient(90deg,rgb(4_5_26/0.7)_0%,rgb(4_5_26/0.35)_45%,transparent_75%)]"
        aria-hidden
      />

      {/* Architectural frame */}
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[calc(var(--nav-h)+0.5rem)] flex justify-between text-ivory/50" aria-hidden>
        <span className="reg-mark" />
        <span className="reg-mark" />
      </div>

      <div className="shell relative mt-auto pb-10 pt-[calc(var(--nav-h)+clamp(2rem,6vw,4rem))] md:pb-14" data-hero-copy>
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 t-mono text-ivory/85 hero-fade [text-shadow:0_1px_8px_rgb(4_5_26/0.8)]" style={{ animationDelay: "0.55s" }}>
          <span>Exhibition stall design · Fabrication · Brand environments</span>
          <Placeholder title="Hero visual is a generated concept render, not a completed project">Concept render</Placeholder>
        </div>

        <h1 id="hero-title" className="t-display text-ivory [text-shadow:0_0.04em_0.25em_rgb(4_5_26/0.45)]">
          <span className="hero-line">
            <span style={{ animationDelay: "0.15s" }}>We build</span>
          </span>
          <span className="hero-line">
            <span style={{ animationDelay: "0.27s" }}>
              spaces <span className="t-serif lowercase text-cobalt-glow">that</span>
            </span>
          </span>
          <span className="hero-line">
            <span style={{ animationDelay: "0.39s" }}>move people.</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="t-lead max-w-[34ch] text-ivory/95 [text-shadow:0_1px_12px_rgb(4_5_26/0.9)] md:col-span-5 hero-fade" style={{ animationDelay: "0.63s" }}>
            Exhibition stalls, custom booths and brand environments — designed with intent, engineered for the
            build and delivered on site.
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-7 md:justify-end hero-fade" style={{ animationDelay: "0.71s" }}>
            <Link href="/work" className="btn btn-ghost">
              Explore our work <span className="btn-arrow">→</span>
            </Link>
            <Link href="/contact" className="btn btn-accent">
              Start a project <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 h-px origin-left bg-ivory/25" data-hero-rule aria-hidden />
        <div className="mt-4 flex items-center justify-between t-mono text-ivory/75 hero-fade" style={{ animationDelay: "0.79s" }}>
          <span>Blueprint → Concept → Reality</span>
          <span className="hidden items-center gap-3 sm:flex">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-ivory/15">
              <span className="absolute inset-0 bg-ivory motion-safe:animate-[scroll-cue_2.4s_var(--ease-arch)_infinite]" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
