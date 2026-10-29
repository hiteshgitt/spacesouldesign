"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { nav } from "@/content/site";
import Wordmark from "./Wordmark";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import { useLenis } from "@/components/motion/SmoothScroll";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lenis = useLenis();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Close the overlay when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  return (
    <>
      <header
        className={`palette-base fixed inset-x-0 top-0 z-50 text-paper mix-blend-difference transition-transform duration-500 ease-[var(--ease-arch)] ${
          hidden && !open ? "-translate-y-full" : ""
        }`}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Link href="/" className="text-[clamp(0.9375rem,0.75rem+0.4vw,1.0625rem)]" aria-label="Space & Soul Design — home">
            <Wordmark />
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-u t-mono"
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span className="opacity-50">{item.index}</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-6">
            <ThemeToggle className="hidden md:inline-flex" />
            <SoundToggle className="hidden md:inline-flex" />
            <Link href="/contact" className="t-mono hidden border border-current px-4 py-2.5 transition-colors hover:bg-paper hover:text-ink lg:inline-block">
              Start a project ↗
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="t-mono flex items-center gap-3 lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden className="relative block h-[9px] w-6">
                <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id={menuId}
        className={`on-dark fixed inset-0 z-40 flex flex-col justify-between pt-[calc(var(--nav-h)+2rem)] pb-8 transition-[clip-path] duration-700 ease-[var(--ease-arch)] lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <nav aria-label="Mobile" className="shell relative">
          <ul className="flex flex-col">
            {[{ href: "/", label: "Home", index: "00" }, ...nav].map((item, i) => (
              <li key={item.href} className="rule-b border-ivory/15">
                <Link
                  href={item.href}
                  className="flex items-baseline gap-4 py-3"
                  aria-current={pathname === item.href ? "page" : undefined}
                  style={{
                    transition: "transform .8s var(--ease-arch), opacity .8s",
                    transitionDelay: open ? `${0.15 + i * 0.05}s` : "0s",
                    transform: open ? "none" : "translateY(40%)",
                    opacity: open ? 1 : 0,
                  }}
                >
                  <span className="t-mono text-fog">{item.index}</span>
                  <span className="t-display-sm text-[clamp(2.4rem,11vw,4.5rem)]">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="shell relative flex items-center justify-between">
          <div className="flex items-center gap-6 md:invisible">
            <ThemeToggle />
            <SoundToggle />
          </div>
          <Link href="/contact" className="btn btn-accent">
            Start a project <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
