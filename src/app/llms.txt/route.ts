import { allProjects } from "@/lib/allProjects";
import { FAQ } from "@/lib/faq";
import { EMAIL, NAME, PROFILES, TAGLINE, abs } from "@/lib/site";
import { projects } from "@/lib/projects";
import { caseStudies } from "@/lib/caseStudies";
import { WORK } from "@/lib/work";
import { formatDate, getWriting } from "@/lib/writing";

export const dynamic = "force-static";

// llms.txt: a plain Markdown map of the site for AI assistants and answer engines. Built from the site's own data.
export async function GET() {
  const writing = await getWriting();
  const lead = projects.map((p) => `- [${p.title}](${abs(`/projects/${p.slug}`)}): ${caseStudies[p.slug].intro}`);
  const rest = allProjects.filter((p) => !projects.some((l) => l.title.toLowerCase() === p.name.toLowerCase())).map((p) => `- ${p.name} (${p.year}): ${p.line}${p.repo ? ` ${p.repo}` : ""}`);
  const text = [
    `# ${NAME}`,
    "",
    `> ${TAGLINE}`,
    "",
    "## Start here",
    `- [Home](${abs("/")}): who he is and his four lead projects`,
    `- [About, with quick answers](${abs("/about")}): the questions people ask`,
    `- [All projects](${abs("/projects")}): ${allProjects.length} projects since 2022`,
    `- [Writing and research](${abs("/writing")}): articles and a published paper`,
    `- [Full text for AI assistants](${abs("/llms-full.txt")})`,
    "",
    "## Lead projects",
    ...lead,
    "",
    "## Writing and research",
    ...writing.map((w) => `- [${w.title}](${w.url}) (${formatDate(w.date)}, ${w.venue}): ${w.summary}`),
    "",
    "## Other projects",
    ...rest,
    "",
    `## Work at ${WORK.company}`,
    ...WORK.items.map((w) => `- ${w.title}: ${w.text}`),
    "",
    "## Quick answers",
    ...FAQ.map((f) => `- ${f.q} ${f.a}`),
    "",
    "## Contact and profiles",
    `- Email: ${EMAIL}`,
    ...Object.entries(PROFILES).map(([k, v]) => `- ${k}: ${v}`),
    "",
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
