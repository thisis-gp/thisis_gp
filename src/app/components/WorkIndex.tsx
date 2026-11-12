"use client";
import Link from "next/link";
import { useState } from "react";
import { caseStudies } from "@/lib/caseStudies";
import { projectBySlug, projects, type Slug } from "@/lib/projects";
import { Terminal } from "./Terminal";

export function WorkIndex({ stats }: { stats: Record<Slug, string[]> }) {
  const [chosen, setChosen] = useState<Slug>("ctxd");
  return (
    <div className="container workGrid">
      <h2 className="visually-hidden">Selected work</h2>
      <div className="workText">
        <div className="picker" role="group" aria-label="Choose a project">
          {projects.map(({ slug, title }) => (
            <button key={slug} type="button" className="pick" aria-pressed={chosen === slug} onClick={() => setChosen(slug)}>{title}</button>
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
              <ul className="proof">{stats[slug].map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
