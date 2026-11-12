import type { Metadata } from "next";
import Link from "next/link";
import { ProjectIndex } from "../components/ProjectIndex";
import { JsonLd } from "../components/JsonLd";
import { SiteFooter } from "../components/SiteFooter";
import { breadcrumbs, graph, person, website } from "@/lib/schema";
import { withBase } from "@/lib/site";
import { allProjects } from "@/lib/allProjects";

export const metadata: Metadata = {
  title: "All projects",
  description: `Every project D A Gurupriyan has built since 2022: AI agents, data and ML, web apps, Android, tools and games. ${allProjects.length} in total.`,
  alternates: { canonical: "/projects" },
};

const featured = allProjects.filter((p) => p.featured);

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return href.startsWith("/")
    ? <Link className="link" href={href}>{children}</Link>
    : <a className="link" href={href} target="_blank" rel="noreferrer">{children}</a>;
}

export default function Projects() {
  return (
    <main id="content">
      <JsonLd data={graph(person, website, breadcrumbs([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }]), {
        "@type": "ItemList", name: "Projects by D A Gurupriyan", numberOfItems: allProjects.length,
        itemListElement: allProjects.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, description: p.line, ...(p.repo ? { url: p.repo } : {}) })),
      })} />
      <a className="skipLink" href="#index">Skip to the full list</a>
      <section className="caseHero">
        <div className="container">
          <Link className="caseBack" href="/">Back to portfolio</Link>
          <h1>Everything I&apos;ve built.</h1>
          <p className="lead">{allProjects.length} projects since 2022, from a first personal site to an Android launcher that runs models on the phone.</p>
        </div>
      </section>

      <section className="sheets">
        <div className="container">
          <h2>Seen live.</h2>
          <div className="sheetGrid">
            {featured.map((p) => (
              <article className="sheet" key={p.name}>
                {p.shot && (
                  <div className={`sheetArt ${p.shot.fit === "contain" ? "contain" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export, local asset */}
                    <img src={withBase(p.shot.src)} alt={p.shot.alt} loading="lazy" />
                  </div>
                )}
                <div className="sheetHead"><h3>{p.name}</h3><span className="meta num">{p.year}</span></div>
                <p>{p.line}</p>
                <p className="meta">{p.stack}</p>
                <div className="links">
                  {p.demo && <Out href={p.demo.href}>{p.demo.label}</Out>}
                  {p.repo && <Out href={p.repo}>Code</Out>}
                  {p.extra && <Out href={p.extra.href}>{p.extra.label}</Out>}
                </div>
                {p.note && <p className="meta">{p.note}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="indexSection" id="index">
        <div className="container">
          <h2>The full list.</h2>
          <ProjectIndex />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
