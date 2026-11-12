import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { abs } from "@/lib/site";
import { getWriting } from "@/lib/writing";

export const dynamic = "force-static";

// Built from the data files: a new project or case study appears here on the next build, with no edit to this file.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writing = await getWriting();
  const newest = writing[0] ? new Date(`${writing[0].date}T00:00:00Z`) : new Date();
  const now = new Date();
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly"; lastModified: Date }[] = [
    { path: "", priority: 1, changeFrequency: "weekly", lastModified: now },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly", lastModified: now },
    { path: "/writing", priority: 0.8, changeFrequency: "weekly", lastModified: newest },
    { path: "/about", priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { path: "/play", priority: 0.6, changeFrequency: "monthly", lastModified: now },
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, priority: 0.8, changeFrequency: "monthly" as const, lastModified: now })),
  ];
  return pages.map((p) => ({ url: abs(p.path || "/"), lastModified: p.lastModified, changeFrequency: p.changeFrequency, priority: p.priority }));
}
