import Link from "next/link";

const LINKS = [
  { label: "GitHub", href: "https://github.com/thisis-gp" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thisis-gp/" },
  { label: "Instagram", href: "https://instagram.com/_this.is_gp" },
  { label: "X", href: "https://x.com/this_isGP" },
  { label: "Medium", href: "https://medium.com/@am400718" },
] as const;

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <span>© 2026 D A Gurupriyan</span>
        <span className="flinks">
          <Link href="/projects/">All projects</Link>
          <Link href="/writing/">Writing</Link>
          <Link href="/about/">About</Link>
          {LINKS.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}
        </span>
      </div>
    </footer>
  );
}
