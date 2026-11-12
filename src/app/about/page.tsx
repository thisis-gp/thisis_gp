import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../components/JsonLd";
import { SiteFooter } from "../components/SiteFooter";
import { FAQ } from "@/lib/faq";
import { breadcrumbs, faqPage, graph, person, website } from "@/lib/schema";
import { EMAIL } from "@/lib/site";
import { WORK } from "@/lib/work";

export const metadata: Metadata = {
  title: "About D A Gurupriyan",
  description: "Who D A Gurupriyan is, where he works, what he has built and published, and how to reach him. Short answers to the questions people ask.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <main id="content">
      <JsonLd data={graph(person, website, faqPage, { "@type": "ProfilePage", mainEntity: { "@id": person["@id"] } }, breadcrumbs([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]))} />
      <section className="caseHero">
        <div className="container">
          <Link className="caseBack" href="/">Back to portfolio</Link>
          <h1>About.</h1>
          <p className="lead">I am a software engineer in Bangalore. I look for real problems, then build the software that fixes them.</p>
        </div>
      </section>
      <section className="indexSection">
        <div className="container caseCols">
          <h2>Quick answers.</h2>
          <div className="faq">
            {FAQ.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
          </div>
        </div>
      </section>
      <section className="indexSection">
        <div className="container caseCols">
          <h2>At work.</h2>
          <div className="faq">
            <p className="lead">{WORK.role}, {WORK.company}. {WORK.note}</p>
            {WORK.items.map((w) => <div key={w.title}><h3>{w.title}</h3><p>{w.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="caseEnd">
        <div className="container">
          <div className="links"><a className="button" href={`mailto:${EMAIL}`}>Email me</a><Link className="link" href="/projects/">All projects</Link><Link className="link" href="/writing/">Writing and research</Link></div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
