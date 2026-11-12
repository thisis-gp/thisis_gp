"use client";
import { useEffect, useRef, useState } from "react";
import { GpTrace } from "./GpTrace";

// The thought bubble plays the headline: a problem I found, and what I built for it.
const THOUGHTS = [
  { found: "Agents guess at database schemas.", fix: "Fixed with ctxd." },
  { found: "Compressing a PDF means uploading it.", fix: "Fixed with slimpdf." },
  { found: "Legal answers need sources.", fix: "Fixed with Kanoon." },
  { found: "Assistants act without asking.", fix: "Fixed with NILA." },
] as const;
const BUBBLE_MS = 3400;

export function Gp() {
  const root = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const y = (e.clientY - (r.top + r.height * 0.35)) / window.innerHeight;
        el.style.setProperty("--px", String(Math.max(-1, Math.min(1, x * 2.2))));
        el.style.setProperty("--py", String(Math.max(-1, Math.min(1, y * 2.2))));
      });
    };
    const tick = window.setInterval(() => setLine((n) => (n + 1) % THOUGHTS.length), BUBBLE_MS);
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); window.clearInterval(tick); cancelAnimationFrame(frame); };
  }, []);

  return (
    <div className="gp" ref={root}>
      <p className="gp-bubble" aria-hidden="true" key={line}><span>{THOUGHTS[line].found}</span><b>{THOUGHTS[line].fix}</b></p>
      <div className="gp-tilt">
        <svg viewBox="0 0 560 542" role="img" aria-label="Flat vector portrait of Gurupriyan">
          <g className="gp-head">
            <GpTrace />
          </g>
        </svg>
      </div>
    </div>
  );
}
