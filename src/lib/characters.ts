// Offline character maker. No model, no network: words pick a theme and colours, a seed picks the details.
// Output is a 16x16 sprite with three frames (stand, step left, step right), the same shape a platformer needs.

export const SIZE = 16;
export const FRAMES = 3;
export const THEMES = ["robot", "wizard", "ninja", "cat", "astronaut", "pirate", "knight", "alien", "ghost", "dragon"] as const;
export type Theme = (typeof THEMES)[number];

type Rgba = string | null;
type Grid = Rgba[][];

const COLOURS: Record<string, string> = {
  red: "#d94a3d", blue: "#3b6fd9", green: "#3fae5a", yellow: "#f2c230", gold: "#e0a526", purple: "#8a4fd0",
  pink: "#e87aa8", orange: "#f08a2c", white: "#f2f0ea", black: "#26262e", grey: "#8c909b", gray: "#8c909b", teal: "#2aa9a0", brown: "#8a5a34",
};
const SKINS = ["#f1c9a5", "#d9a074", "#b9774a", "#8a5634", "#6b4026"];
const ALIASES: Record<Theme, string[]> = {
  robot: ["robot", "mech", "android", "bot", "cyborg"], wizard: ["wizard", "mage", "witch", "sorcerer"], ninja: ["ninja", "assassin", "shadow"],
  cat: ["cat", "kitten", "tiger", "lion", "fox"], astronaut: ["astronaut", "space", "pilot", "cosmonaut"], pirate: ["pirate", "captain", "sailor"],
  knight: ["knight", "warrior", "soldier", "paladin"], alien: ["alien", "martian", "ufo"], ghost: ["ghost", "spirit", "ghoul", "phantom"], dragon: ["dragon", "lizard", "wyvern", "dino"],
};
const BASE_COLOUR: Record<Theme, string> = { robot: "grey", wizard: "purple", ninja: "black", cat: "orange", astronaut: "white", pirate: "red", knight: "grey", alien: "green", ghost: "white", dragon: "green" };

export type Character = { name: string; theme: Theme; seed: number; main: string; accent: string; skin: string; frames: Grid[] };

const hash = (s: string) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed: number) => () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = <T,>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)];

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => ch(v).toString(16).padStart(2, "0")).join("")}`;
}

const blank = (): Grid => Array.from({ length: SIZE }, () => Array<Rgba>(SIZE).fill(null));
const put = (g: Grid, x: number, y: number, c: Rgba) => { if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) g[y][x] = c; };
const rect = (g: Grid, x: number, y: number, w: number, h: number, c: Rgba) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(g, x + i, y + j, c); };

export function parsePrompt(text: string): { theme: Theme | null; colours: string[] } {
  const words = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const theme = THEMES.find((t) => ALIASES[t].some((a) => words.includes(a))) ?? null;
  return { theme, colours: words.filter((w) => COLOURS[w]).map((w) => COLOURS[w]) };
}

function drawFrame(theme: Theme, c: { main: string; accent: string; skin: string; dark: string; light: string }, r: () => number, step: number): Grid {
  const g = blank();
  const legL = step === 1 ? 1 : 0, legR = step === 2 ? 1 : 0;
  const ink = "#1c1c24", white = "#fbfbf6";

  // legs and body: a raised leg is one pixel shorter
  rect(g, 4, 12, 3, 4 - legL, c.dark);
  rect(g, 9, 12, 3, 4 - legR, c.dark);
  rect(g, 3, 8, 10, 5, c.main);
  rect(g, 3, 8, 10, 1, c.light);
  rect(g, 2, 9, 1, 3, c.main); rect(g, 13, 9, 1, 3, c.main);
  put(g, 2, 12, c.skin); put(g, 13, 12, c.skin);

  // head
  const head = theme === "robot" ? c.light : theme === "ghost" ? white : theme === "alien" ? c.main : theme === "dragon" ? c.main : theme === "cat" ? c.main : c.skin;
  rect(g, 4, 2, 8, 7, head);
  rect(g, 3, 3, 1, 5, head); rect(g, 12, 3, 1, 5, head);

  const eyes = (y = 5, colour = ink) => { put(g, 5, y, colour); put(g, 6, y, colour); put(g, 9, y, colour); put(g, 10, y, colour); };

  switch (theme) {
    case "robot":
      eyes(5, "#35e0ff"); rect(g, 5, 7, 6, 1, c.dark); put(g, 7, 0, c.accent); rect(g, 7, 1, 2, 1, c.dark);
      rect(g, 6, 10, 4, 2, c.accent);
      break;
    case "wizard":
      eyes(5); rect(g, 4, 7, 8, 3, white); rect(g, 6, 8, 4, 1, c.skin === white ? c.light : c.skin);
      rect(g, 3, 2, 10, 1, c.accent); rect(g, 5, 0, 6, 2, c.main); put(g, 7, -1, c.main); rect(g, 6, 0, 4, 1, c.main); put(g, 8, 0, c.accent);
      break;
    case "ninja":
      rect(g, 4, 2, 8, 3, c.main); rect(g, 4, 5, 8, 2, c.skin); rect(g, 4, 7, 8, 2, c.main); put(g, 6, 5, ink); put(g, 9, 5, ink); rect(g, 4, 4, 8, 1, c.accent); put(g, 12, 5, c.accent); put(g, 13, 6, c.accent);
      break;
    case "cat":
      eyes(5, "#1c1c24"); put(g, 7, 7, "#e87aa8"); put(g, 8, 7, "#e87aa8");
      put(g, 4, 1, c.main); put(g, 4, 0, c.main); put(g, 5, 1, c.main); put(g, 11, 1, c.main); put(g, 11, 0, c.main); put(g, 10, 1, c.main);
      put(g, 3, 6, white); put(g, 2, 6, white); put(g, 12, 6, white); put(g, 13, 6, white); rect(g, 6, 8, 4, 1, white);
      break;
    case "astronaut":
      rect(g, 3, 1, 10, 9, c.light); rect(g, 4, 3, 8, 5, "#243a63"); rect(g, 5, 4, 2, 1, "#7fd0ff"); eyes(6, "#9fe3ff"); rect(g, 3, 9, 10, 1, c.accent);
      break;
    case "pirate":
      eyes(5); put(g, 5, 5, ink); rect(g, 4, 5, 3, 2, ink); put(g, 5, 5, "#3a3a46"); rect(g, 4, 1, 8, 2, ink); rect(g, 3, 2, 10, 1, ink); put(g, 7, 1, white); put(g, 8, 1, white); rect(g, 5, 8, 6, 1, "#4a2f1d");
      break;
    case "knight":
      rect(g, 4, 2, 8, 7, c.light); rect(g, 5, 5, 6, 1, ink); put(g, 7, 4, ink); put(g, 8, 4, ink); rect(g, 7, 6, 2, 3, c.dark); rect(g, 7, 0, 2, 2, c.accent);
      break;
    case "alien":
      rect(g, 3, 1, 10, 8, c.main); put(g, 2, 3, c.main); put(g, 13, 3, c.main); rect(g, 4, 4, 3, 2, ink); rect(g, 9, 4, 3, 2, ink); put(g, 5, 4, white); put(g, 10, 4, white); rect(g, 6, 7, 4, 1, c.dark);
      put(g, 4, 0, c.accent); put(g, 11, 0, c.accent); put(g, 4, -1, c.accent);
      break;
    case "ghost":
      rect(g, 3, 1, 10, 13, white); rect(g, 4, 0, 8, 1, white); for (let x = 3; x < 13; x += 2) put(g, x, 14, white);
      eyes(4); rect(g, 7, 7, 2, 2, ink); rect(g, 3, 8, 10, 4, white);
      break;
    case "dragon":
      eyes(4, "#ffe36b"); rect(g, 4, 6, 8, 3, c.light); put(g, 6, 7, ink); put(g, 9, 7, ink);
      put(g, 4, 1, c.accent); put(g, 4, 0, c.accent); put(g, 11, 1, c.accent); put(g, 11, 0, c.accent); rect(g, 7, 1, 2, 1, c.accent);
      rect(g, 1, 8, 2, 3, c.dark); rect(g, 13, 8, 2, 3, c.dark);
      break;
  }

  // a bit of seeded variety so two "wizards" are not twins
  if (theme !== "ghost" && theme !== "astronaut") {
    const mark = pick(r, ["none", "belt", "buttons", "stripe"] as const);
    if (mark === "belt") rect(g, 3, 11, 10, 1, c.accent);
    if (mark === "buttons") { put(g, 8, 9, c.accent); put(g, 8, 11, c.accent); }
    if (mark === "stripe") rect(g, 3, 9, 10, 1, c.accent);
  }
  return g;
}

const SYLLABLES = ["bor", "zik", "mo", "lun", "tar", "fen", "qua", "pip", "dra", "nex", "wob", "kel", "ru", "sha", "vi", "zo"];
const TITLES: Record<Theme, string[]> = { robot: ["Unit", "Bolt"], wizard: ["Archmage", "Old"], ninja: ["Shadow", "Silent"], cat: ["Captain", "Lady"], astronaut: ["Commander", "Cadet"], pirate: ["Captain", "Salty"], knight: ["Sir", "Dame"], alien: ["Zorp", "Glim"], ghost: ["Lord", "Little"], dragon: ["Ember", "Scale"] };

export function makeCharacter(prompt: string, seedBump = 0): Character {
  const parsed = parsePrompt(prompt);
  const seed = (hash(prompt.trim().toLowerCase() || "hello") + seedBump * 7919) >>> 0;
  const r = rng(seed);
  const theme = parsed.theme ?? pick(r, THEMES);
  const main = parsed.colours[0] ?? COLOURS[BASE_COLOUR[theme]] ?? pick(r, Object.values(COLOURS));
  const accent = parsed.colours[1] ?? pick(r, ["#f2c230", "#e0a526", "#d94a3d", "#3b6fd9", "#e87aa8", "#3fae5a"]);
  const skin = pick(r, SKINS);
  const palette = { main, accent, skin, dark: shade(main, -55), light: shade(main, 45) };
  const frames = [0, 1, 2].map((step) => drawFrame(theme, palette, rng(seed), step));
  const name = `${pick(r, TITLES[theme])} ${pick(r, SYLLABLES)}${pick(r, SYLLABLES)}`.replace(/(^|\s)\S/g, (s) => s.toUpperCase());
  return { name, theme, seed, main, accent, skin, frames };
}

/** Paints one frame, or all frames side by side, onto a canvas context at the given scale. */
export function paint(ctx: CanvasRenderingContext2D, frames: Grid[], scale: number, startX = 0) {
  frames.forEach((g, f) => g.forEach((row, y) => row.forEach((c, x) => { if (c) { ctx.fillStyle = c; ctx.fillRect(startX + (f * SIZE + x) * scale, y * scale, scale, scale); } })));
}
