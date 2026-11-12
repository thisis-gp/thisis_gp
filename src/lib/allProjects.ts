// Every project, one place. Update this file (and PROFILE.md) when something ships.
// Rules: no invented metrics; a demo link only if it was opened and loaded; private repos get no link.
// The 2D Game Engine card gets its screenshot and featured slot only when NEXT_PUBLIC_ENGINE_LIVE=1 (see site.ts).
// Descriptions were checked against the repos on 12 Nov 2026 (see PROFILE.md changelog).

import { ENGINE_LIVE } from "./site";

export const CATEGORIES = ["AI & agents", "Data & ML", "Web & APIs", "Mobile", "Tools", "Games", "Coursework"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Entry = {
  name: string;
  year: number;
  category: Category;
  line: string;
  stack: string;
  repo?: string;
  demo?: { label: string; href: string };
  extra?: { label: string; href: string };
  shot?: { src: string; alt: string; fit?: "cover" | "contain" };
  note?: string;
  featured?: boolean;
};

const gh = (name: string) => `https://github.com/thisis-gp/${name}`;

export const allProjects: Entry[] = [
  { name: "ctxd", year: 2026, category: "AI & agents", featured: true, line: "A reviewed, versioned context layer between AI agents and Metabase. Agents draft read-only SQL from approved metrics and joins instead of guessing from the raw schema.", stack: "TypeScript, MCP, SQLite", repo: gh("ctxd"), demo: { label: "Project site", href: "https://thisis-gp.github.io/ctxd/" }, extra: { label: "npm", href: "https://www.npmjs.com/package/@dagurupriyan/ctxd" }, shot: { src: "/assets/shots/ctxd.png", alt: "The ctxd project site" } },
  { name: "Kanoon", year: 2025, category: "AI & agents", featured: true, line: "Search and cited Q&A over 924 Supreme Court judgments. Keyword and vector search, reranked with a cross-encoder, on a 2-core CPU-only VM.", stack: "Python, FastAPI, PostgreSQL, React", repo: gh("kanoon"), demo: { label: "Live demo", href: "https://kanoon-two.vercel.app" }, extra: { label: "IEEE paper", href: "https://ieeexplore.ieee.org/document/11407722" }, shot: { src: "/assets/kanoon-logo.svg", alt: "Kanoon logo", fit: "contain" } },
  { name: "Slate", year: 2026, category: "AI & agents", line: "A kanban board for AI agents: CLI, HTTP API, MCP server and React UI, with run logging, approval requests and Jira sync.", stack: "Python, FastAPI, React, SQLite", repo: gh("slate") },
  { name: "Loom", year: 2026, category: "AI & agents", line: "A runtime for coding agents: git-worktree sandboxes, an event log, a retry policy and Anthropic and OpenAI providers.", stack: "Python", repo: gh("loom"), note: "Early stage." },
  { name: "Cortex", year: 2026, category: "AI & agents", line: "One folder of Markdown workflows and skills that Cursor, Claude, Gemini and Copilot all read. No code.", stack: "Markdown", repo: gh("cortex") },
  { name: "Packlight", year: 2026, category: "AI & agents", line: "An experiment in giving an agent only the skills it needs for each request. So far a skill scanner and baseline scorers, with no results.", stack: "Python", repo: gh("packlight"), note: "Early stage." },
  { name: "Gemini CLI eval dataset", year: 2026, category: "AI & agents", line: "A GSoC 2026 proof of concept: seven coding-evaluation tasks with a runner and a scorer. No baseline results yet.", stack: "Python", repo: gh("gemini-cli-eval-dataset-poc") },
  { name: "GenAI Project Builder", year: 2024, category: "AI & agents", line: "Gemini generates up to 20 project files from a description and offers them as a zip.", stack: "Python, Streamlit, Gemini API", repo: gh("GenAI-Project-Builder") },

  { name: "Namma Vahana", year: 2026, category: "Data & ML", featured: true, line: "Hotspot maps, a next-shift forecast and a patrol plan from 298,443 Bengaluru parking tickets. Built for Flipkart Gridlock 2.0. The impact score is a proxy.", stack: "Python, H3, LightGBM, FastAPI, Next.js", repo: gh("namma-vahana"), demo: { label: "Live", href: "https://namma-vahana.vercel.app" }, shot: { src: "/assets/shots/namma-vahana.png", alt: "The Namma Vahana parking intelligence site with a route map" } },
  { name: "Clinical Data Standardization Environment", year: 2026, category: "Data & ML", line: "A benchmark where AI agents standardize clinical-trial data to CDISC formats. Four graded tasks, ten cases each.", stack: "Python, FastAPI, Docker", repo: gh("clinical-data-env") },
  { name: "Supreme Court RAG", year: 2025, category: "Data & ML", line: "Upload Supreme Court judgment PDFs and ask questions answered by Gemini from their text.", stack: "Python, Streamlit, LangChain, FAISS, Gemini", repo: gh("supreme_court_rag_model") },
  { name: "LII of India scraper", year: 2025, category: "Data & ML", line: "Scripts that download 2024 Supreme Court judgments from LII of India, extract the text and clean it.", stack: "Python, Selenium, PyMuPDF", repo: gh("liiofindia-scrapper") },
  { name: "Fake News Detector", year: 2024, category: "Data & ML", line: "A fake or real news classifier: TF-IDF and logistic regression, 98% accuracy on a held-out set of 38,639 articles. A dataset quirk inflates that score, and the README says so.", stack: "Python, scikit-learn, JavaScript, Vercel", repo: gh("Fake-News-Detector"), demo: { label: "Live", href: "https://fake-news-detector-alpha-red.vercel.app" } },
  { name: "Content Engine", year: 2024, category: "Data & ML", line: "A Colab notebook for question answering over three company PDFs, with a local Llama-2 and Chroma retrieval.", stack: "Python, LangChain, Chroma, Colab", repo: gh("content-engine") },
  { name: "ASL to Text", year: 2024, category: "Data & ML", line: "A webcam script: MediaPipe landmarks go to a pre-trained TFLite model that predicts signs.", stack: "Python, OpenCV, MediaPipe, TensorFlow Lite", repo: gh("ASL_to_Text") },
  { name: "Face Swap", year: 2024, category: "Data & ML", line: "A Streamlit app that swaps faces between two uploaded images with InsightFace.", stack: "Python, InsightFace, Streamlit", repo: gh("face-swap") },
  { name: "Tesla stock notebooks", year: 2024, category: "Data & ML", line: "Coursework notebooks that try to predict Tesla's next-day direction with XGBoost. Accuracy is about chance (0.52 to 0.55): a classroom experiment, not a forecast.", stack: "Python, XGBoost, Colab", repo: gh("Tesla-Stock-Price-Prediction") },

  { name: "MindSpace", year: 2024, category: "Web & APIs", featured: true, line: "A student mental-health chat app: React front end, FastAPI and Gemini back end, replies in text and speech. Won Best Intervention Award at the TYCL Mental Health Exhibition 2024.", stack: "React, Vite, Firebase, FastAPI, Gemini", repo: gh("MindSpace"), demo: { label: "Live", href: "https://mind-space-phi.vercel.app" }, shot: { src: "/assets/shots/mindspace.png", alt: "The MindSpace landing page" }, extra: { label: "Chatbot version", href: "https://mindspace-chatbot-iota.vercel.app" }, note: "A second version adds journaling and distress flagging. Its chat needs API keys, so it is not fully working yet." },
  { name: "Clearfund", year: 2026, category: "Web & APIs", line: "An accountability platform for CSR spending and NGOs. Pre-launch.", stack: "TypeScript, Next.js, Prisma", note: "Private repo. Demo on request." },
  { name: "TripGenie", year: 2025, category: "Web & APIs", line: "Gemini drafts trip itineraries with weather and map views. Built for the Google AI Exchange Hackathon.", stack: "Next.js, TypeScript, Gemini API", repo: gh("Personalized-AI-Trip-Planner"), note: "Live demo is offline." },
  { name: "Student Query Ticketing", year: 2025, category: "Web & APIs", line: "A Django API that answers student questions from an FAQ by embedding similarity and escalates low-confidence tickets to a department head.", stack: "Python, Django REST, sentence-transformers", repo: gh("AI-Powered-Student-Query-Ticketing-System") },
  { name: "LexiScope", year: 2024, category: "Web & APIs", line: "A legal research prototype: search and chat over Supreme Court judgments with retrieval and Gemini.", stack: "React, FastAPI, Qdrant, Gemini", repo: gh("lexiscope") },
  { name: "IMF Gadget API", year: 2025, category: "Web & APIs", line: "A Node, Express and PostgreSQL CRUD API for fictional spy gadgets, with soft delete and a mock self-destruct.", stack: "Node.js, Express, PostgreSQL, Sequelize", repo: gh("IMF-Gadget-API") },
  { name: "MEAN task app", year: 2025, category: "Web & APIs", line: "The classic tutorials CRUD sample on the MEAN stack, containerised with Docker and deployed to EC2 by GitHub Actions.", stack: "MongoDB, Express, Angular, Node.js", repo: gh("crud-task-mean-app") },
  { name: "Django APIs", year: 2025, category: "Web & APIs", line: "Two small Django REST APIs: a multilingual FAQ service and a courses service.", stack: "Python, Django REST, Redis", repo: gh("django_faq_api") },
  { name: "First portfolio", year: 2022, category: "Web & APIs", line: "My first personal site, with a blog.", stack: "HTML, CSS, JavaScript", repo: gh("thisis_gp"), demo: { label: "Live", href: "https://thisis-gp.github.io/thisis_gp/" } },

  { name: "NILA", year: 2026, category: "Mobile", featured: true, line: "An Android launcher prototype. On-device Gemma and a fine-tuned FunctionGemma router pick a tool, and anything that commits waits for your confirmation. Team of three; I led.", stack: "Kotlin, Jetpack Compose, LiteRT", repo: gh("nila"), demo: { label: "Project site", href: "https://nila-vercel-site.vercel.app" }, shot: { src: "/assets/shots/nila.png", alt: "The NILA project site" } },
  { name: "Jimi", year: 2026, category: "Mobile", line: "An on-device voice mental-health app with a safety-first triage layer. Team of three; I led and reviewed.", stack: "Kotlin, on-device LLM", note: "Private repo." },
  { name: "TalkTalk", year: 2024, category: "Mobile", line: "A Flutter prototype for sign-to-voice and voice-to-sign. It captures video and audio. Translation is not built.", stack: "Flutter, Dart", repo: gh("TalkTalk") },
  { name: "CRED stack views", year: 2025, category: "Mobile", line: "A Flutter clone of CRED's credit-amount, EMI-plan and bank-selection screens.", stack: "Flutter, Dart", repo: gh("cred_ui_stack_views") },

  { name: "slimpdf", year: 2026, category: "Tools", featured: true, line: "Shrinks a PDF below a size limit fully offline. No upload, no account. CLI and Python library.", stack: "Python, PyPI", repo: gh("slimpdf"), demo: { label: "Project site", href: "https://thisis-gp.github.io/slimpdf/" }, extra: { label: "PyPI", href: "https://pypi.org/project/slimpdf/" }, shot: { src: "/assets/shots/slimpdf.png", alt: "The slimpdf project site" } },
  { name: "Tkinter calculator", year: 2024, category: "Tools", line: "A desktop calculator with square and square root.", stack: "Python, Tkinter", repo: gh("tkinter_calculator") },

  { name: "2D Game Engine", year: 2023, category: "Games", ...(ENGINE_LIVE ? { featured: true } : {}), line: "A Mario-style Java 2D engine with an editor, physics and sprites, built by following a game-engine tutorial series. I ported its play mode to the browser and added a character maker.", stack: "Java, LWJGL, JBox2D, TeaVM, WebGL2", repo: gh("2d-Game-Engine"), demo: { label: "Play", href: "/play/" }, ...(ENGINE_LIVE ? { shot: { src: "/assets/shots/engine.png", alt: "The Java game engine running in a browser: Mario and a goomba on the original level" } } : {}) },
  { name: "Cube Runner 84", year: 2025, category: "Games", line: "A retro arcade game with neon effects, built almost entirely by chatting with Amazon Q Developer CLI.", stack: "Python, Pygame", repo: gh("Cube-Runner-84"), demo: { label: "Play", href: "https://thisis-gp.github.io/Cube-Runner-84/" } },

  { name: "IPL Cricket Management", year: 2024, category: "Coursework", line: "A console management system for IPL cricket data, stored in text files.", stack: "Python", repo: gh("IPL-Cricket-Management-System") },
  { name: "Lab work", year: 2024, category: "Coursework", line: "Lab experiments: advanced databases in SQL, operating-system algorithms in C and C++, and networks with Packet Tracer and Flask.", stack: "SQL, C, C++, Python, Packet Tracer", repo: gh("ADBMS_LAB") },
  { name: "DSA practice", year: 2024, category: "Coursework", line: "Data structures and algorithms solutions.", stack: "Python", repo: gh("DSA") },
];
