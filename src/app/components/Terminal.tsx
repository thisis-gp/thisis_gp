"use client";
import { useState } from "react";
import type { TermLine } from "@/lib/caseStudies";

const COPIED_MS = 1600;

export function Terminal({ title, lines }: { title: string; lines: TermLine[] }) {
  const [copied, setCopied] = useState(false);
  const commands = lines.filter((l) => l.k === "cmd").map((l) => l.s);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commands.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_MS);
    } catch { /* clipboard blocked: the text is selectable anyway */ }
  };

  return (
    <figure className="term">
      <figcaption>
        <span>{title}</span>
        {commands.length > 0 && <button type="button" onClick={copy}>{copied ? "Copied" : "Copy commands"}</button>}
      </figcaption>
      <pre>
        {lines.map((l, i) => <code key={i} className={`t-${l.k}`}>{l.s}{"\n"}</code>)}
      </pre>
    </figure>
  );
}
