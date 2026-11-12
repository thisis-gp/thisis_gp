# D A Gurupriyan

My portfolio: https://thisis-gp.github.io/thisis_gp/

A static site built with Next.js. It shows my projects, case studies, writing and research, a pixel-character maker, and my Java 2D game engine ported to run in the browser (the engine is in the public/engine folder).

## Run it

```bash
npm ci
npm run dev
```

## Add to it

The pages are generated from a few data files, so growing the site means editing data, not pages.

- `src/lib/allProjects.ts`: every project
- `src/lib/projects.ts` and `src/lib/caseStudies.ts`: the lead projects and their case studies
- `src/lib/writing.ts`: papers and articles (new Hashnode posts are picked up at build time)
- `src/lib/faq.ts`: the quick answers on the About page

The sitemap, `llms.txt`, the RSS feed and the structured data all update from those files.

## Deploy

A GitHub Actions workflow builds the site and publishes it to GitHub Pages on every push to `master` and once a day.
