import { NAME, TAGLINE, abs } from "@/lib/site";
import { getWriting } from "@/lib/writing";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS for the writing and research list. It grows whenever a new Hashnode post is picked up at build time.
export async function GET() {
  const items = (await getWriting())
    .map((p) => `<item><title>${esc(p.title)}</title><link>${esc(p.url)}</link><guid isPermaLink="true">${esc(p.url)}</guid><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(NAME)}: writing and research</title><link>${abs("/writing")}</link><description>${esc(TAGLINE)}</description><language>en</language><atom:link href="${abs("/feed.xml")}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
