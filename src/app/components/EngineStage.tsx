"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/site";
import { CharacterLab } from "./CharacterLab";

const CONTROLS = [
  { keys: "A D or arrows", does: "Move" },
  { keys: "Space", does: "Jump. Press again in the air to double jump" },
  { keys: "E", does: "Fireball, once you have a fire flower" },
  { keys: "Esc", does: "Pause" },
  { keys: "R", does: "Restart" },
] as const;

const isRestartKey = (e: KeyboardEvent) => (e.key === "r" || e.key === "R") && !e.ctrlKey && !e.metaKey && !e.altKey;
const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

export function EngineStage({ playable }: { playable: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const lastSprite = useRef<string | null>(null);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const [full, setFull] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const restart = useCallback(() => setRun((n) => n + 1), []);

  // R restarts whether the keyboard focus is on the page or inside the game.
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (isRestartKey(e)) restart();
      // when the page, not the game, has the focus, forward Esc so the game still pauses
      else if (e.key === "Escape" && !e.repeat) frame.current?.contentWindow?.postMessage({ type: "toggle-pause" }, window.location.origin);
    };
    window.addEventListener("keydown", onKey);
    const onFull = () => { setFull(Boolean(document.fullscreenElement)); frame.current?.focus(); frame.current?.contentWindow?.focus(); };
    document.addEventListener("fullscreenchange", onFull);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("fullscreenchange", onFull); };
  }, [started, restart]);

  // When the game frame loads: take keyboard focus, listen for R inside it, and re-send the chosen character.
  const onLoad = () => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    frame.current?.focus();
    win.focus();
    win.addEventListener("keydown", (e) => { if (isRestartKey(e)) restart(); });
    if (lastSprite.current) win.postMessage({ type: "player-sprite", png: lastSprite.current }, window.location.origin);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void box.current?.requestFullscreen?.();
  };

  const useSprite = (png: string) => {
    lastSprite.current = png;
    if (!started || !frame.current?.contentWindow) { setNote("Press Play first, then send your character."); return; }
    frame.current.contentWindow.postMessage({ type: "player-sprite", png }, window.location.origin);
    setNote("Sent. Your character is now the player.");
  };

  return (
    <>
      {playable && (
        <section className="stage" id="stage">
          <div className="container">
            <div className="stageFrame" ref={box}>
              {started ? (
                <>
                  <iframe key={run} ref={frame} src={withBase("/engine/index.html")} title="The real game engine, running in the browser" allow="autoplay; fullscreen" onLoad={onLoad} />
                  <div className="stageTools">
                    <button type="button" className="iconBtn" onClick={restart} aria-label="Restart (R)" title="Restart (R)">
                      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 5a7 7 0 1 1-6.7 9" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M12 1.5 6.5 5 12 8.5Z" fill="currentColor" /></svg>
                    </button>
                    <button type="button" className="iconBtn" onClick={toggleFullscreen} aria-label={full ? "Exit fullscreen" : "Fullscreen"} title={full ? "Exit fullscreen" : "Fullscreen"}>
                      {full
                        ? <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>
                        : <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>}
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" className="stagePlay" onClick={() => setStarted(true)}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export, local asset */}
                  <img src={withBase("/engine/preview.png")} alt="" />
                  <span>Play</span>
                </button>
              )}
            </div>
            <ul className="controls" aria-label="Controls">
              {CONTROLS.map((c) => <li key={c.keys}><kbd>{c.keys}</kbd><span>{c.does}</span></li>)}
            </ul>
          </div>
        </section>
      )}
      <CharacterLab onUse={playable ? useSprite : undefined} />
      {note && <p className="container meta labNote" role="status">{note}</p>}
    </>
  );
}
