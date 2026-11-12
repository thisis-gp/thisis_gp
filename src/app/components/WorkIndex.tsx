"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { caseStudies } from "@/lib/caseStudies";
import { projectBySlug, projects, type Slug } from "@/lib/projects";
import { LiveProof } from "./LiveProof";
import { Terminal } from "./Terminal";

const ROTATE_MS = 30_000;

export function WorkIndex({ stats }: { stats: Record<Slug, string[]> }) {
  const [chosen, setChosen] = useState<Slug>("ctxd");
  const [paused, setPaused] = useState(false);
  const [userPicked, setUserPicked] = useState(false);

  // Move to the next project every 30 seconds. Stops while the visitor hovers or focuses here,
  // for good once they pick a project themselves, and never runs for reduced-motion visitors.
  useEffect(() => {
    if (paused || userPicked || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setChosen((cur) => projects[(projects.findIndex((p) => p.slug === cur) + 1) % projects.length].slug), ROTATE_MS);
    return () => window.clearInterval(t);
  }, [paused, userPicked]);
  return (
    <div className="container workGrid" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <h2 className="visually-hidden">Selected work</h2>
      <div className="workText">
        <div className="picker" role="group" aria-label="Choose a project">
          {projects.map(({ slug, title }) => (
            <button key={slug} type="button" className="pick" aria-pressed={chosen === slug} onClick={() => { setChosen(slug); setUserPicked(true); }}>{title}</button>
          ))}
        </div>
        {projects.map(({ slug }) => {
          const p = projectBySlug[slug];
          return (
            <div className="descr" key={slug} data-on={chosen === slug || undefined}>
              <p className="lead">{caseStudies[slug].intro}</p>
              <p className="meta">{p.stack}</p>
              <div className="links">
                <Link className="button" href={`/projects/${slug}`}>Read the case study</Link>
                <a className="link" href={p.links.find((l) => l.label !== "GitHub")?.href} target="_blank" rel="noreferrer">{p.links.find((l) => l.label !== "GitHub")?.label}</a>
                <a className="link" href={p.links.find((l) => l.label === "GitHub")?.href} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          );
        })}
      </div>
      <div className="workField">
        {projects.map(({ slug }) => {
          const c = caseStudies[slug];
          return (
            <div className="fig" key={slug} data-on={chosen === slug || undefined}>
              <p className="pitch">{c.pitch}</p>
              <Terminal title={c.terminal.title} lines={c.terminal.lines} />
              <LiveProof slug={slug} initial={stats[slug]} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
