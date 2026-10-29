"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ImageAsset } from "@/content/types";

/** Drawing ↔ render wipe. Pointer drag anywhere on the frame, or arrow keys on the handle. */
export default function CompareSlider({ before, after, label }: { before: ImageAsset; after: ImageAsset; label: string }) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (x: number) => {
    const r = frame.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={frame}
      className="relative aspect-[16/10] touch-pan-y select-none overflow-hidden bg-void"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 85vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 85vw, 100vw" className="object-cover" />
      </div>
      <span className="t-mono pointer-events-none absolute left-4 top-4 text-ivory/80">Drawing</span>
      <span className="t-mono pointer-events-none absolute right-4 top-4 text-ivory/80">Render</span>
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% drawing`}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 2;
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
          else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
          else if (e.key === "Home") setPos(0);
          else if (e.key === "End") setPos(100);
          else return;
          e.preventDefault();
        }}
        className="absolute inset-y-0 -ml-px w-0.5 cursor-ew-resize bg-ivory"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory text-ink t-mono">
          ↔
        </span>
      </div>
    </div>
  );
}
