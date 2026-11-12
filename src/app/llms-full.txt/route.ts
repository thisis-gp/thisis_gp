import { caseStudies } from "@/lib/caseStudies";
import { FAQ } from "@/lib/faq";
import { projects } from "@/lib/projects";
import { NAME, TAGLINE, abs } from "@/lib/site";
import { formatDate, getWriting } from "@/lib/writing";

export const dynamic = "force-static";

// llms-full.txt: the full case studies and writing as one Markdown document, for assistants that read a single file.
export async function GET() {
  const writing = await getWriting();
  const sections = projects.map((p) => {
    const c = caseStudies[p.slug];
    return [
      `## ${p.title}`,
      `${c.pitch} ${c.intro}`,
      `Role: ${c.role}. Started ${c.started}. Status: ${c.status}`,
      `Stack: ${p.stack}`,
      `Page: ${abs(`/projects/${p.slug}`)}`,
      "",
      "Try it:",
      ...c.terminal.lines.map((l) => `    ${l.s}`),
      "",
      "Facts:",
      ...c.facts.map((f) => `- ${f.value}: ${f.label}`),
      "",
      "How it works:",
      ...c.how.map((s, i) => `${i + 1}. ${s}`),
      "",
      "Decisions:",
      ...c.decisions.map((d) => `- ${d.title}: ${d.text}`),
      "",
      "Limits:",
      ...c.limits.map((l) => `- ${l}`),
      "",
      "Links:",
      ...p.links.map((l) => `- ${l.label}: ${l.href}`),
      "",
    ].join("\n");
  });
  const text = [
    `# ${NAME}: full text`,
    "",
    `> ${TAGLINE}`,
    "",
    ...sections,
    "## Writing and research",
    ...writing.map((w) => `- ${w.title} (${formatDate(w.date)}, ${w.venue})${w.authors ? `, authors: ${w.authors}` : ""}${w.doi ? `, DOI ${w.doi}` : ""}: ${w.summary} ${w.url}`),
    "",
    "## Quick answers",
    ...FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}\n`),
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
