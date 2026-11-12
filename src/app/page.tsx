import Link from "next/link";
import { Gp } from "./components/Gp";
import { JsonLd } from "./components/JsonLd";
import { Logo } from "./components/Logo";
import { NavLinks } from "./components/NavLinks";
import { SiteFooter } from "./components/SiteFooter";
import { WorkIndex } from "./components/WorkIndex";
import { allProjects } from "@/lib/allProjects";
import { graph, person, pieceNode, website } from "@/lib/schema";
import { EMAIL, ENGINE_LIVE } from "@/lib/site";
import { getStats } from "@/lib/stats";
import { formatDate, getWriting } from "@/lib/writing";



export default async function Home() {
  const stats = await getStats();
  const writing = await getWriting();
  return (
    <main id="content">
      <JsonLd data={graph(person, website, ...writing.map(pieceNode))} />
      <a className="skipLink" href="#work">Skip to projects</a>
      <section className="hero">
        <header className="nav">
          <Link href="/" className="wordmark" aria-label="D A Gurupriyan, home"><Logo /><span><b>D A</b><br />Gurupriyan</span></Link>
          <NavLinks />
        </header>
        <h1 className="poster"><span>Find the problem.</span><span>Then fix it.</span></h1>
        <div className="container heroCopy">
          <p className="lead"><b>I&apos;m Gurupriyan.</b> A software engineer solving real-world problems in AI, data and Android.</p>
          <div className="links"><a className="button" href="#work">See the work</a><a className="link" href="https://www.linkedin.com/in/thisis-gp/" target="_blank" rel="noreferrer">LinkedIn</a></div>
        </div>
        <div className="heroField"><Gp /></div>
      </section>

      <section className="work" id="work"><WorkIndex stats={stats} /></section>

      <section className="teaser" id="more">
        <div className="container">
          <p className="figure num" aria-label={`${allProjects.length} projects`}>{allProjects.length}</p>
          <div className="copy">
            <p className="lead">projects since 2022. AI agents, Android, data, web apps and a few games. Every one, with live links where they still work.</p>
            <div className="links"><Link className="button" href="/projects/">See every project</Link><Link className="link" href="/play/">{ENGINE_LIVE ? "Play my game engine" : "Make a pixel character"}</Link></div>
          </div>
        </div>
      </section>

      <section className="writingHome" id="writing">
        <div className="container">
          <h2>Writing and research.</h2>
          <ul className="rows">
            {writing.slice(0, 3).map((w) => (
              <li key={w.url}>
                <div className="rowName"><h3>{w.title}</h3><span className="meta num">{formatDate(w.date)}</span></div>
                <div className="rowLine"><p>{w.summary}</p></div>
                <p className="meta rowStack">{w.kind === "paper" ? "Research paper" : "Article"}, {w.venue.split(",")[0]}</p>
                <div className="rowLinks"><a className="link" href={w.url} target="_blank" rel="noreferrer">{w.kind === "paper" ? "Read the paper" : "Read"}</a></div>
              </li>
            ))}
          </ul>
          <div className="links"><Link className="link" href="/writing/">All writing and research</Link><Link className="link" href="/about/">About me</Link></div>
        </div>
      </section>

      <section className="statement">
        <div className="container">
          <p>I&apos;m an SDE I at Nova Benefits in Bangalore, with an integrated MSc from Pondicherry University. I co-authored an <a href="https://ieeexplore.ieee.org/document/11407722" target="_blank" rel="noreferrer">IEEE paper</a> on the legal search engine I built, and my <a href="https://github.com/thisis-gp/MindSpace" target="_blank" rel="noreferrer">MindSpace</a> chatbot won a mental-health award in 2024.</p>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <h2>Got a hard problem?</h2>
          <a className="mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <div className="links"><a className="button" href={`mailto:${EMAIL}`}>Email me</a><a className="link" href="https://github.com/thisis-gp" target="_blank" rel="noreferrer">GitHub</a><a className="link" href="https://www.linkedin.com/in/thisis-gp/" target="_blank" rel="noreferrer">LinkedIn</a></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
