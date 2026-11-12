import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { EngineStage } from "../components/EngineStage";
import { SiteFooter } from "../components/SiteFooter";
import { ENGINE_LIVE, withBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pixel character maker and my game engine",
  description: "Make a pixel character from a few words, and see the Java 2D game engine D A Gurupriyan built from a tutorial series and ported to the browser.",
  alternates: { canonical: "/play" },
};

// The browser port of the engine is a static bundle in public/engine. It only shows when it is switched on and present.
const playable = ENGINE_LIVE && existsSync(path.join(process.cwd(), "public", "engine", "index.html"));
const hasFootage = ENGINE_LIVE && existsSync(path.join(process.cwd(), "public", "assets", "engine", "engine-demo.mp4"));

export default function Play() {
  return (
    <main id="content">
      <section className="caseHero">
        <div className="container">
          <Link className="caseBack" href="/">Back to portfolio</Link>
          <h1>{playable ? "My game engine, in your browser." : "Make a pixel character."}</h1>
          <p className="lead">
            {playable
              ? "I built a Mario-style 2D engine in Java by following a tutorial series. It only ran on a desktop. Here it is running in a browser, with a maker for your own characters."
              : "Describe who you want and get a walking pixel character, made in your browser. It started as a way to give my Java 2D game engine new players."}
          </p>
          <div className="links">
            {playable && <a className="button" href="#stage">Play</a>}
            <a className={playable ? "link" : "button"} style={playable ? { color: "var(--color-field-ink)" } : undefined} href="#lab">Make a character</a>
            <a className="link" style={{ color: "var(--color-field-ink)" }} href="https://github.com/thisis-gp/2d-Game-Engine" target="_blank" rel="noreferrer">The Java engine</a>
          </div>
        </div>
      </section>

      <EngineStage playable={playable} />

      {hasFootage && (
        <section className="footage" id="footage">
          <div className="container">
            <h2>The desktop original.</h2>
            <p className="lead">Recorded from the Java version, which also has an editor with docking panels, a properties window and gizmos.</p>
            <video controls muted loop playsInline preload="metadata" poster={withBase("/assets/engine/poster.png")}>
              <source src={withBase("/assets/engine/engine-demo.webm")} type="video/webm" />
              <source src={withBase("/assets/engine/engine-demo.mp4")} type="video/mp4" />
            </video>
          </div>
        </section>
      )}

      <section className="engineNotes">
        <div className="container caseCols">
          <h2>What is real here.</h2>
          <ul className="limits">
            <li><p>The Java 2D engine is mine to read on GitHub: scenes, game objects and components, a batch renderer, physics through JBox2D, and an editor.</p></li>
            <li><p>I followed a public Java game-engine tutorial series to build it, so the design is not original. {playable ? "The browser port and the character maker are my own work." : "The character maker is my own work."}</p></li>
            <li><p>The character maker is a small program that picks parts and colours from your words. It is not an AI model, and nothing is uploaded.</p></li>
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
