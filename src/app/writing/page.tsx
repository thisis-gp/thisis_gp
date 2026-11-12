import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../components/JsonLd";
import { SiteFooter } from "../components/SiteFooter";
import { breadcrumbs, graph, person, pieceNode, website } from "@/lib/schema";
import { formatDate, getWriting, type Piece } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing and research",
  description: "Articles and research papers by D A Gurupriyan: a legal search engine paper from ICCIDS 2026, building a retro game with Amazon Q CLI, and Bun 1.0.",
  alternates: { canonical: "/writing" },
};

function Rows({ items }: { items: Piece[] }) {
  return (
    <ul className="rows">
      {items.map((p) => (
        <li key={p.url}>
          <div className="rowName"><h3>{p.title}</h3><span className="meta num">{formatDate(p.date)}</span></div>
          <div className="rowLine"><p>{p.summary}</p>{p.role && <p className="meta">{p.role}</p>}{p.authors && <p className="meta">{p.authors}</p>}</div>
          <p className="meta rowStack">{p.venue}{p.doi ? `, DOI ${p.doi}` : ""}</p>
          <div className="rowLinks"><a className="link" href={p.url} target="_blank" rel="noreferrer">{p.kind === "paper" ? "Read the paper" : "Read the article"}</a></div>
        </li>
      ))}
    </ul>
  );
}

export default async function Writing() {
  const all = await getWriting();
  const papers = all.filter((p) => p.kind === "paper");
  const articles = all.filter((p) => p.kind === "article");
  return (
    <main id="content">
      <JsonLd data={graph(person, website, breadcrumbs([{ name: "Home", path: "/" }, { name: "Writing", path: "/writing" }]), ...all.map(pieceNode))} />
      <section className="caseHero">
        <div className="container">
          <Link className="caseBack" href="/">Back to portfolio</Link>
          <h1>Writing and research.</h1>
          <p className="lead">What I have published, and what I write when a project teaches me something.</p>
        </div>
      </section>
      <section className="indexSection">
        <div className="container">
          <h2>Research.</h2>
          <Rows items={papers} />
        </div>
      </section>
      <section className="indexSection">
        <div className="container">
          <h2>Articles.</h2>
          <Rows items={articles} />
          <p className="meta" style={{ marginTop: "var(--space-lg)" }}>New articles on Hashnode appear here the next time the site is built.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
