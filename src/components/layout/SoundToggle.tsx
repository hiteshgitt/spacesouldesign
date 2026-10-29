"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Optional ambient sound. Off by default, never autoplays, never restored to
 * "on" across visits. The tone is synthesised with WebAudio (no audio files):
 * a low filtered drone that breathes slowly — like a quiet exhibition hall at night.
 */
export default function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);
  const ctx = useRef<{ ac: AudioContext; master: GainNode } | null>(null);

  const start = () => {
    if (!ctx.current) {
      const ac = new AudioContext();
      const master = ac.createGain();
      master.gain.value = 0;
      const filter = ac.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 420;
      filter.Q.value = 0.6;
      filter.connect(master).connect(ac.destination);
      for (const [f, g] of [
        [55, 0.22],
        [82.4, 0.12],
        [110.3, 0.08],
        [164.8, 0.035],
      ] as const) {
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        o.detune.value = Math.random() * 8 - 4;
        const og = ac.createGain();
        og.gain.value = g;
        o.connect(og).connect(filter);
        o.start();
      }
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.07;
      const lfoGain = ac.createGain();
      lfoGain.gain.value = 160;
      lfo.connect(lfoGain).connect(filter.frequency);
      lfo.start();
      ctx.current = { ac, master };
    }
    const { ac, master } = ctx.current;
    void ac.resume();
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setTargetAtTime(0.32, ac.currentTime, 0.8);
  };

  const stop = () => {
    const c = ctx.current;
    if (!c) return;
    c.master.gain.cancelScheduledValues(c.ac.currentTime);
    c.master.gain.setTargetAtTime(0, c.ac.currentTime, 0.25);
    setTimeout(() => c.ac.state === "running" && c.master.gain.value < 0.01 && void c.ac.suspend(), 1500);
  };

  useEffect(() => {
    const onHide = () => document.hidden && ctx.current?.ac.suspend();
    const onShow = () => !document.hidden && on && ctx.current?.ac.resume();
    const h = () => (document.hidden ? onHide() : onShow());
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [on]);

  useEffect(() => () => void ctx.current?.ac.close(), []);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        const next = !on;
        setOn(next);
        if (next) start();
        else stop();
      }}
      className={`group items-center gap-2 t-mono ${className || "inline-flex"}`}
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-current transition-[height] duration-300"
            style={{
              height: on ? undefined : "2px",
              animation: on ? `eq 0.9s ${i * 0.13}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </span>
      <span>Sound {on ? "on" : "off"}</span>
    </button>
  );
}
