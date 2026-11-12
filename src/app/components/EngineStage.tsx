"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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
// Phones and tablets have no keyboard. Add ?touch=1 to the address to try the touch controls on a desktop.
const hasTouch = () => window.matchMedia("(pointer: coarse)").matches || new URLSearchParams(window.location.search).has("touch");
const subscribeTouch = (cb: () => void) => { const m = window.matchMedia("(pointer: coarse)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };

type Orientation = ScreenOrientation & { lock?: (o: string) => Promise<void>; unlock?: () => void };

const PAD = {
  left: { code: "ArrowLeft", key: "ArrowLeft", label: "Left" },
  right: { code: "ArrowRight", key: "ArrowRight", label: "Right" },
  fire: { code: "KeyE", key: "e", label: "Fire" },
  jump: { code: "Space", key: " ", label: "Jump" },
} as const;
type PadKey = keyof typeof PAD;

// One on-screen button. Holding it holds the key; pointer capture keeps it pressed if the finger slides.
function PadButton({ k, label, big, onSend, children }: { k: PadKey; label: string; big?: boolean; onSend: (type: "keydown" | "keyup", k: PadKey) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={big ? "padBtn big" : "padBtn"}
      aria-label={label}
      onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); onSend("keydown", k); }}
      onPointerUp={() => onSend("keyup", k)}
      onPointerCancel={() => onSend("keyup", k)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

export function EngineStage({ playable }: { playable: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const lastSprite = useRef<string | null>(null);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const [full, setFull] = useState(false);
  const touch = useSyncExternalStore(subscribeTouch, hasTouch, () => false);
  const [note, setNote] = useState<string | null>(null);

  const restart = useCallback(() => setRun((n) => n + 1), []);
  const pause = () => frame.current?.contentWindow?.postMessage({ type: "toggle-pause" }, window.location.origin);

  // R restarts whether the keyboard focus is on the page or inside the game. Esc is forwarded to pause.
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (isRestartKey(e)) restart();
      else if (e.key === "Escape" && !e.repeat) pause();
    };
    window.addEventListener("keydown", onKey);
    const onFull = () => {
      const on = Boolean(document.fullscreenElement);
      setFull(on);
      if (!on) (screen.orientation as Orientation | undefined)?.unlock?.();
      frame.current?.focus();
      frame.current?.contentWindow?.focus();
    };
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

  // On a phone, Play goes fullscreen and asks for landscape. iPhones refuse both, so a rotate hint covers portrait.
  const start = async () => {
    setStarted(true);
    if (!touch) return;
    try { await box.current?.requestFullscreen?.(); } catch { /* fullscreen not allowed here */ }
    try { await (screen.orientation as Orientation | undefined)?.lock?.("landscape"); } catch { /* orientation lock not supported */ }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void box.current?.requestFullscreen?.();
  };

  const send = (type: "keydown" | "keyup", k: PadKey) =>
    frame.current?.contentWindow?.dispatchEvent(new KeyboardEvent(type, { code: PAD[k].code, key: PAD[k].key, bubbles: true }));

  const useSprite = (png: string) => {
    lastSprite.current = png;
    if (!started || !frame.current?.contentWindow) { setNote("Press Play first, then send your character."); return; }
    frame.current.contentWindow.postMessage({ type: "player-sprite", png }, window.location.origin);
    setNote("Sent. Your character is now the player.");
  };

  return (
    <>
      {playable && (
        <section className="stage" id="stage" data-touch={touch || undefined}>
          <div className="container">
            <div className="stageFrame" ref={box}>
              {started ? (
                <>
                  <iframe key={run} ref={frame} src={withBase("/engine/index.html")} title="The real game engine, running in the browser" allow="autoplay; fullscreen" onLoad={onLoad} />
                  <div className="stageTools">
                    {touch && (
                      <button type="button" className="iconBtn" onClick={pause} aria-label="Pause" title="Pause">
                        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor" /></svg>
                      </button>
                    )}
                    <button type="button" className="iconBtn" onClick={restart} aria-label="Restart (R)" title="Restart (R)">
                      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 5a7 7 0 1 1-6.7 9" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M12 1.5 6.5 5 12 8.5Z" fill="currentColor" /></svg>
                    </button>
                    <button type="button" className="iconBtn" onClick={toggleFullscreen} aria-label={full ? "Exit fullscreen" : "Fullscreen"} title={full ? "Exit fullscreen" : "Fullscreen"}>
                      {full
                        ? <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>
                        : <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>}
                    </button>
                  </div>
                  {touch && (
                    <div className="touchPad">
                      <div className="padGroup">
                        <PadButton k="left" label="Move left" onSend={send}><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" strokeWidth="3" /></svg></PadButton>
                        <PadButton k="right" label="Move right" onSend={send}><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="m9 4 8 8-8 8" fill="none" stroke="currentColor" strokeWidth="3" /></svg></PadButton>
                      </div>
                      <div className="padGroup">
                        <PadButton k="fire" label="Fireball" onSend={send}>{PAD.fire.label}</PadButton>
                        <PadButton k="jump" label="Jump" big onSend={send}>{PAD.jump.label}</PadButton>
                      </div>
                    </div>
                  )}
                  {touch && <p className="rotateHint" aria-live="polite">Turn your phone sideways to play</p>}
                </>
              ) : (
                <button type="button" className="stagePlay" onClick={start}>
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
