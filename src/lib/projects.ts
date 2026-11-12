// The lead projects on the home page and the case-study routes. Everything else lives in allProjects.ts.
export type Slug = "ctxd" | "kanoon" | "nila" | "slimpdf";

export type Project = {
  slug: Slug;
  title: string;
  summary: string;
  problem: string;
  stack: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  { slug: "ctxd", title: "ctxd", summary: "A public MCP server that gives agents reviewed schema context and read-only SQL that fails closed.", problem: "Agents need database context without database control.", stack: "TypeScript, MCP, SQLite, SQL AST parsing", links: [{ label: "Project site", href: "https://thisis-gp.github.io/ctxd/" }, { label: "GitHub", href: "https://github.com/thisis-gp/ctxd" }, { label: "npm", href: "https://www.npmjs.com/package/@dagurupriyan/ctxd" }] },
  { slug: "kanoon", title: "Kanoon", summary: "Search and Q&A over 924 Supreme Court judgments, with cited answers or an honest \"not available\".", problem: "Legal answers need evidence, not just fluent text.", stack: "Python, FastAPI, PostgreSQL, ParadeDB, React", links: [{ label: "IEEE paper", href: "https://ieeexplore.ieee.org/document/11407722" }, { label: "GitHub", href: "https://github.com/thisis-gp/kanoon" }] },
  { slug: "nila", title: "NILA", summary: "An Android launcher where on-device models pick the action and nothing consequential runs without your confirmation.", problem: "Personal AI should not automatically mean sending personal context away.", stack: "Kotlin, Jetpack Compose, LiteRT, ONNX Runtime", links: [{ label: "Project site", href: "https://nila-vercel-site.vercel.app" }, { label: "GitHub", href: "https://github.com/thisis-gp/nila" }] },
  { slug: "slimpdf", title: "slimpdf", summary: "Shrinks a PDF under a size limit entirely on your machine. No upload, no account.", problem: "The usual fix for a 3 MB upload limit is an online compressor that sends private files to a stranger's server.", stack: "Python, pikepdf, pypdfium2, PyPI", links: [{ label: "Project site", href: "https://thisis-gp.github.io/slimpdf/" }, { label: "GitHub", href: "https://github.com/thisis-gp/slimpdf" }, { label: "PyPI", href: "https://pypi.org/project/slimpdf/" }] },
];

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<Slug, Project>;
