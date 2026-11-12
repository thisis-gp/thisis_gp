"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FRAMES, SIZE, THEMES, makeCharacter, paint } from "@/lib/characters";

const PREVIEW_SCALE = 14;
const STEP_MS = 180;
const WALK = [0, 1, 0, 2] as const;
const STARTER = "a wizard in a blue robe";

export function CharacterLab({ onUse }: { onUse?: (sheetPng: string) => void }) {
  const [prompt, setPrompt] = useState(STARTER);
  const [bump, setBump] = useState(0);
  const preview = useRef<HTMLCanvasElement>(null);
  const character = useMemo(() => makeCharacter(prompt, bump), [prompt, bump]);

  useEffect(() => {
    const cv = preview.current, ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    let i = 0;
    const draw = (frame: number) => { ctx.clearRect(0, 0, cv.width, cv.height); paint(ctx, [character.frames[frame]], PREVIEW_SCALE); };
    draw(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => draw(WALK[++i % WALK.length]), STEP_MS);
    return () => window.clearInterval(t);
  }, [character]);

  const sheet = () => {
    const cv = document.createElement("canvas");
    cv.width = SIZE * FRAMES; cv.height = SIZE;
    const ctx = cv.getContext("2d");
    if (ctx) paint(ctx, character.frames, 1);
    return cv.toDataURL("image/png");
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = sheet(); a.download = `${character.name.toLowerCase().replace(/\s+/g, "-")}-spritesheet.png`; a.click();
  };

  const mix = (theme: string) => { setPrompt(`${theme} in ${["red", "blue", "green", "gold", "purple", "teal"][(bump + theme.length) % 6]}`); setBump(0); };

  return (
    <section className="lab" aria-labelledby="lab-title">
      <div className="labForm">
        <h2 id="lab-title">Make a character.</h2>
        <p className="lead">Describe who you want. A wizard, a robot, a ninja cat. Colours work too. Everything is made in your browser, with no AI model and no upload.</p>
        <label className="labField">
          <span className="meta">Describe your character</span>
          <input value={prompt} onChange={(e) => { setPrompt(e.target.value); setBump(0); }} maxLength={60} spellCheck={false} />
        </label>
        <div className="chips" role="group" aria-label="Quick ideas">
          {THEMES.map((t) => <button key={t} type="button" className="chip" onClick={() => mix(t)}>{t}</button>)}
        </div>
        <div className="links">
          <button type="button" className="button" onClick={() => setBump((n) => n + 1)}>Another one</button>
          <button type="button" className="link linkButton" onClick={download}>Download sprite sheet</button>
          {onUse && <button type="button" className="link linkButton" onClick={() => onUse(sheet())}>Use in the game</button>}
        </div>
      </div>
      <figure className="labCard">
        <canvas ref={preview} width={SIZE * PREVIEW_SCALE} height={SIZE * PREVIEW_SCALE} role="img" aria-label={`Pixel art of ${character.name}, a ${character.theme}`} />
        <figcaption>
          <b>{character.name}</b>
          <span className="meta">A {character.theme}</span>
          <span className="swatches" aria-hidden="true">{[character.main, character.accent, character.skin].map((c) => <i key={c} style={{ background: c }} />)}</span>
        </figcaption>
      </figure>
    </section>
  );
}
