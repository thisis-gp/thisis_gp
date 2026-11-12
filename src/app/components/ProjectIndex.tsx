"use client";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, allProjects, type Category } from "@/lib/allProjects";

type Filter = "All" | Category;
const FILTERS: Filter[] = ["All", ...CATEGORIES];

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return href.startsWith("/")
    ? <Link className="link" href={href}>{children}</Link>
    : <a className="link" href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export function ProjectIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const count = (f: Filter) => (f === "All" ? allProjects.length : allProjects.filter((p) => p.category === f).length);
  return (
    <div>
      <div className="filters" role="group" aria-label="Filter by kind">
        {FILTERS.map((f) => (
          <button key={f} type="button" className="filter" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f} <span className="num">{count(f)}</span>
          </button>
        ))}
      </div>
      <ul className="rows">
        {allProjects.map((p) => (
          <li key={p.name} hidden={filter !== "All" && p.category !== filter}>
            <div className="rowName"><h3>{p.name}</h3><span className="meta num">{p.year}</span></div>
            <div className="rowLine"><p>{p.line}</p>{p.note && <p className="meta">{p.note}</p>}</div>
            <p className="meta rowStack">{p.stack}</p>
            <div className="rowLinks">
              {p.demo && <Out href={p.demo.href}>{p.demo.label}</Out>}
              {p.repo && <Out href={p.repo}>Code</Out>}
              {p.extra && <Out href={p.extra.href}>{p.extra.label}</Out>}
              {!p.demo && !p.repo && !p.extra && <span className="meta">No public link</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
