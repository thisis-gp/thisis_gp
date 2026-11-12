import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "../../components/JsonLd";
import { LiveProof } from "../../components/LiveProof";
import { Terminal } from "../../components/Terminal";
import { SiteFooter } from "../../components/SiteFooter";
import { caseStudies } from "@/lib/caseStudies";
import { projectBySlug, projects, type Slug } from "@/lib/projects";
import { breadcrumbs, graph, person, website } from "@/lib/schema";
import { abs, withBase } from "@/lib/site";
import { getStats } from "@/lib/stats";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug as Slug;
  const project = projectBySlug[slug];
  return project ? { title: `${project.title} case study`, description: caseStudies[slug].intro, alternates: { canonical: `/projects/${slug}` }, openGraph: { title: `${project.title} case study | D A Gurupriyan`, description: caseStudies[slug].intro, type: "article", url: `/projects/${slug}` } } : {};
}

export default async function ProjectPage({ params }: Props) {
  const slug = (await params).slug as Slug;
  const project = projectBySlug[slug];
  if (!project) notFound();
  const study = caseStudies[slug];
  const stats = (await getStats())[slug];
  const next = projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length];
  const hasDownloads = stats.some((s) => /download/.test(s));
  return (
    <main id="case-study">
      <JsonLd data={graph(person, website, breadcrumbs([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, { name: project.title, path: `/projects/${slug}` }]), {
        "@type": "SoftwareSourceCode", name: project.title, description: study.intro, url: abs(`/projects/${slug}`), programmingLanguage: project.stack.split(",")[0].trim(),
        codeRepository: project.links.find((l) => l.label === "GitHub")?.href, author: { "@id": person["@id"] },
      })} />
      <a className="skipLink" href="#details">Skip to details</a>
      <section className="caseHero">
        <div className="container">
          <Link className="caseBack" href="/#work">Back to work</Link>
          <h1>{project.title}</h1>
          <p className="casePitch">{study.pitch}</p>
          <p className="lead">{study.intro}</p>
          <p className="meta caseMeta">{study.role}. Started {study.started}. {study.status}</p>
        </div>
      </section>

      <section className="caseTry" id="details">
        <div className="container caseTryGrid">
          <Terminal title={study.terminal.title} lines={study.terminal.lines} />
          <div className="caseTryAside">
            <LiveProof slug={slug} initial={stats} />
            {hasDownloads && <p className="meta">Download counts include bots and mirrors.</p>}
            <div className="links">
              {project.links.map((l) => <a className="link" key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}
            </div>
          </div>
        </div>
      </section>

      <section className="caseFacts">
        <div className="container">
          {study.facts.map((f) => (
            <div key={f.label}><p className="figure num">{f.value}</p><p className="meta">{f.label}</p></div>
          ))}
        </div>
      </section>

      {study.shot && (
        <section className="caseShot">
          <div className="container">
            <div className={`sheetArt ${study.shot.fit === "contain" ? "contain" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, local asset */}
              <img src={withBase(study.shot.src)} alt={study.shot.alt} />
            </div>
          </div>
        </section>
      )}

      <section className="caseBlock">
        <div className="container caseCols">
          <h2>How it works.</h2>
          <ol className="steps">{study.how.map((s) => <li key={s}><p>{s}</p></li>)}</ol>
        </div>
      </section>

      <section className="caseBlock">
        <div className="container caseCols">
          <h2>Decisions I would defend.</h2>
          <div className="decisions">{study.decisions.map((d) => <div key={d.title}><h3>{d.title}</h3><p>{d.text}</p></div>)}</div>
        </div>
      </section>

      <section className="caseBlock">
        <div className="container caseCols">
          <h2>What it does not do yet.</h2>
          <ul className="limits">{study.limits.map((l) => <li key={l}><p>{l}</p></li>)}</ul>
        </div>
      </section>

      <section className="caseEnd">
        <div className="container">
          <Link className="nextCase" href={`/projects/${next.slug}`}>Next: {next.title}</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
