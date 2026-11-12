"use client";
import { useEffect, useState } from "react";
import { fetchLive } from "@/lib/liveStats";
import type { Slug } from "@/lib/projects";

// Shows the build-time numbers first, then swaps in fresh ones from the live sources when they answer.
export function LiveProof({ slug, initial, className = "proof" }: { slug: Slug; initial: string[]; className?: string }) {
  const [lines, setLines] = useState(initial);
  useEffect(() => {
    let alive = true;
    fetchLive(slug).then((fresh) => { if (alive && fresh.length) setLines(fresh); }).catch(() => undefined);
    return () => { alive = false; };
  }, [slug]);
  return <ul className={className}>{lines.map((s) => <li key={s}>{s}</li>)}</ul>;
}
