// Case-study content. Every number here was checked against the repo (audit of 12 Nov 2026) or is marked as self-reported.
// Update with PROFILE.md when a project changes. Never add a metric without saying how it was measured.
import type { Slug } from "./projects";

export type TermLine = { k: "cmd" | "out" | "q" | "a"; s: string };

export type CaseStudy = {
  pitch: string;
  intro: string;
  terminal: { title: string; lines: TermLine[] };
  role: string;
  started: string;
  status: string;
  facts: { value: string; label: string }[];
  how: string[];
  decisions: { title: string; text: string }[];
  limits: string[];
  shot?: { src: string; alt: string; fit?: "cover" | "contain" };
};

export const caseStudies: Record<Slug, CaseStudy> = {
  ctxd: {
    pitch: "Stop your agent guessing against your database.",
    intro: "Ask an agent about customer satisfaction and it finds three tables that look right, then picks one. ctxd gives it reviewed metrics and approved joins instead, and refuses any SQL it cannot verify.",
    terminal: {
      title: "Install and run",
      lines: [
        { k: "cmd", s: "npm install -g @dagurupriyan/ctxd@next" },
        { k: "cmd", s: "ctxd init" },
        { k: "cmd", s: "ctxd serve" },
        { k: "out", s: "# an MCP server over stdio, ready for Claude, Cursor or any MCP client" },
      ],
    },
    role: "Solo builder",
    started: "July 2026",
    status: "Beta on npm. Used at Nova Benefits.",
    facts: [
      { value: "2.70 vs 4.67", label: "the same question on a synthetic database: the raw schema against the reviewed metric" },
      { value: "14", label: "MCP tools, 12 on by default" },
      { value: "20 days", label: "from first commit to npm release, about 7,000 lines of TypeScript" },
    ],
    how: [
      "Index the Metabase schema into an immutable, versioned snapshot with full-text search.",
      "The agent searches or plans a query. ctxd answers with reviewed metrics and approved join paths.",
      "It compiles SQL from approved joins only.",
      "A validator checks the SQL. Anything it cannot parse or verify is rejected.",
      "The person runs the query in Metabase with their own access.",
    ],
    decisions: [
      { title: "Fail closed", text: "One SELECT or WITH statement only. SELECT INTO is blocked and an unparseable query is rejected, not guessed at. Nothing executes unless it is switched on, and executed queries go to an audit log." },
      { title: "Release, don't mutate", text: "Every answer carries its release and fingerprint. Rolling back restores the previous release, so an agent never reads a half-updated schema." },
      { title: "Approved joins only", text: "Inferred foreign keys help discovery but are never compiled. High-fanout joins fail closed." },
      { title: "PII by denylist", text: "Denied tables and columns stay indexed without descriptions or sample values, and any SQL that touches them is rejected. Wildcards like *.email work." },
    ],
    limits: [
      "The checks are parser-based, not a database read-only role.",
      "Metabase is the only live source so far. The dbt, Cube and MetricFlow adapters read metadata only.",
      "The headline example uses a synthetic database, and there is no measured accuracy benchmark yet, only a harness.",
      "One author, no outside users yet, and installing needs a C++ toolchain for the SQLite binding.",
    ],
    shot: { src: "/assets/shots/ctxd.png", alt: "The ctxd project site" },
  },

  kanoon: {
    pitch: "Ask a legal question. See the sources.",
    intro: "Indian case law is long PDFs, and keyword search misses meaning. Ask in plain language and Kanoon answers from 924 Supreme Court judgments, with numbered citations that open the passage, or tells you it does not know.",
    terminal: {
      title: "Ask it",
      lines: [
        { k: "q", s: "What did the Court say about reservation for persons with benchmark disabilities?" },
        { k: "a", s: "A short answer with numbered citations [1] [2]. Each one opens the source passage." },
        { k: "a", s: "Not enough evidence? It says: Not available in the sources." },
      ],
    },
    role: "Solo builder, co-author of the IEEE paper",
    started: "September 2025, rebuilt August 2026",
    status: "Runs on a 2-core VM. The live demo is offline while I fix its hosting.",
    facts: [
      { value: "924", label: "Supreme Court judgments from 2024, in 46,281 passages" },
      { value: "5.5 s", label: "for a cold search on a 2-core CPU-only VM, about 3 ms once warm" },
      { value: "93-96%", label: "top-1 on a known-item proxy of about 100 queries per type, with reranking" },
    ],
    how: [
      "Scrape and clean the judgments, then split them into passages of about 1,000 characters.",
      "Search two ways at once: vector similarity and BM25 keywords, 50 candidates each.",
      "Fuse the two lists with Reciprocal Rank Fusion and rerank with a cross-encoder.",
      "Answer only from the numbered sources, citing each as [n]. If they don't cover it, say \"Not available in the sources.\"",
      "Cache answers in Postgres and in memory.",
    ],
    decisions: [
      { title: "Abstain over guess", text: "The prompt allows only numbered sources and one exact refusal sentence. A legal answer with no evidence is worse than no answer." },
      { title: "Rerank is the real win", text: "Keyword search alone gets 88% top-1 on passage queries, and plain fusion only 50%. A cross-encoder over the fused candidates lifts it to 93%." },
      { title: "Failover gateway", text: "Requests fall through NVIDIA, then Groq, then OpenRouter, with a deadline, bounded concurrency, a daily cap and per-IP limits." },
      { title: "One database", text: "Vectors and BM25 both live in Postgres through ParadeDB, so there is one service to run, not three." },
    ],
    limits: [
      "The accuracy check is a proxy. Its queries are built from the indexed text, with no human labels, and answer quality and citation accuracy are untested.",
      "Abstention is prompt-based. There is no relevance-score threshold yet.",
      "Inference is serialised. Eight simultaneous cold searches took about 59 seconds at the median.",
      "The citation graph is built with regular expressions, and only 2024 judgments are covered.",
    ],
    shot: { src: "/assets/kanoon-logo.svg", alt: "Kanoon logo", fit: "contain" },
  },

  nila: {
    pitch: "Say what you want. Your phone asks before it acts.",
    intro: "A launcher prototype where on-device models turn a request into an action: set an alarm, compare food prices, plan a route. Anything that spends money or sends a message waits for your confirmation.",
    terminal: {
      title: "Build and install",
      lines: [
        { k: "cmd", s: "git clone https://github.com/thisis-gp/nila" },
        { k: "cmd", s: ".\\scripts\\build-install-test.ps1" },
        { k: "out", s: "# needs JDK 17, Android SDK 36 and a phone with USB debugging" },
      ],
    },
    role: "Team lead and architect, team of three",
    started: "October 2026",
    status: "Public prototype. No award.",
    facts: [
      { value: "On-device", label: "chat, voice transcription and routing run on the phone, with Gemma and a fine-tuned FunctionGemma" },
      { value: "3 classes", label: "Read, Prepare, Commit. Only Commit needs a confirmation card, and every MCP tool counts as Commit" },
      { value: "240", label: "commits and 81 pull requests in 20 days, by three people. About 21k lines of Kotlin and 400+ unit tests" },
    ],
    how: [
      "Speak or type. On-device transcription turns voice into text.",
      "Deterministic fast paths handle the obvious requests. A fine-tuned FunctionGemma router handles the rest, with Gemma as fallback.",
      "A capability registry checks the tool, its typed arguments and its permission class.",
      "Android actions, MCP providers or local stores do the work and return a card.",
      "Anything that commits (an order, a message) waits for an explicit confirmation.",
    ],
    decisions: [
      { title: "Models choose, code executes", text: "Model output never runs as code. Unknown tools and arguments are rejected, and numbers the model proposes are checked against the user's words." },
      { title: "Read, Prepare, Commit", text: "Every action has a permission class, so the app can say what it will do before it does it." },
      { title: "Router ships only if it wins", text: "The fine-tuning script exports a model only when held-out accuracy beats the base model and every tool is hit at least once." },
      { title: "Private by default", text: "An encrypted local database with a Keystore-wrapped key. Account tokens never go into prompts. No accessibility automation." },
    ],
    limits: [
      "No device benchmarks yet. Hindi and Malayalam voice accuracy is unmeasured.",
      "The shipped router has no recorded accuracy number.",
      "It is mostly unit-tested, with only a few instrumented tests.",
      "Built with AI coding assistants. I wrote 33 of the 81 pull requests, and the commit history mixes several author names.",
    ],
    shot: { src: "/assets/shots/nila.png", alt: "The NILA project site" },
  },

  slimpdf: {
    pitch: "Get under the upload limit without uploading the file.",
    intro: "A scanned hospital bill or ID is too big for a 3 MB upload form, and online compressors want your file. slimpdf shrinks it on your machine, to the size you choose.",
    terminal: {
      title: "Install and run",
      lines: [
        { k: "cmd", s: "pip install slimpdf" },
        { k: "cmd", s: "slimpdf compress big-scan.pdf --target 3mb -o small.pdf" },
        { k: "out", s: "# nothing leaves your machine. No account, no network calls" },
      ],
    },
    role: "Solo builder",
    started: "June 2026",
    status: "Alpha on PyPI. Used at Nova Benefits.",
    facts: [
      { value: "19.1 to 0.17 MB", label: "the best case in my own set of about 60 scans, with similarity (SSIM) 0.977. Self-reported" },
      { value: "79%", label: "average size cut on files over the 3 MB limit in that set. Across the whole set it was 11.6%" },
      { value: "0 bytes", label: "uploaded. It runs fully offline" },
    ],
    how: [
      "A lossless pass with pikepdf. If that is enough, stop.",
      "Re-encode the images. Binary-search a quality and resolution ladder for the gentlest step that fits the target.",
      "As a last resort, and only if asked, rasterise the pages. This loses text.",
      "Validate every candidate: it reopens, keeps the page count and keeps at least 95% of the text. Otherwise copy the original through.",
    ],
    decisions: [
      { title: "The gentlest result that fits", text: "Output size only shrinks along the ladder, so a binary search finds the first step under the limit in a handful of renders." },
      { title: "Validate before writing", text: "A smaller file that is broken is useless. Each candidate is reopened and checked, and the original is never replaced by something worse." },
      { title: "No copyleft dependencies", text: "Ghostscript and PyMuPDF are AGPL. A CI guard fails the build on GPL, AGPL or LGPL dependencies." },
      { title: "Local only", text: "Hospital bills and ID scans are exactly what people should not upload to a stranger's server." },
    ],
    limits: [
      "Alpha, and lossy by design.",
      "Any rewrite breaks digital signatures.",
      "The benchmark is one self-collected set, compared only with Ghostscript and mutool. At the 3 MB target slimpdf matched Ghostscript /ebook on size with higher similarity (SSIM 0.991 against 0.979), a proxy score.",
      "There are no tests yet for the CLI or the similarity compare, and the repo has only a day of history.",
    ],
    shot: { src: "/assets/shots/slimpdf.png", alt: "The slimpdf project site" },
  },
};
