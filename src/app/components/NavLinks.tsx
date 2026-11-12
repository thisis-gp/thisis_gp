"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "All projects", href: "/projects/" },
  { label: "Writing", href: "/writing/" },
  { label: "Play", href: "/play/" },
  { label: "Contact", href: "#contact" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thisis-gp/", external: true },
] as const;

// Desktop: the links sit in a row over the blue field. Phone: they fold into a full-screen menu behind one button.
export function NavLinks() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <>
      <nav aria-label="Main" id="site-menu" className="navLinks" data-open={open || undefined}>
        {LINKS.map((l) =>
          "external" in l
            ? <a key={l.label} href={l.href} target="_blank" rel="noreferrer" onClick={close}>{l.label}</a>
            : l.href.startsWith("#")
              ? <a key={l.label} href={l.href} onClick={close}>{l.label}</a>
              : <Link key={l.label} href={l.href} onClick={close}>{l.label}</Link>,
        )}
      </nav>
      <button type="button" className="menuBtn" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
    </>
  );
}
