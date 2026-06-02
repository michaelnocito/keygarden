# Contributing

Thanks for your interest in Keygarden. It's a deliberately small, single-file app — easy to read, easy to change.

## Repo layout

```
index.html             # published app (React via CDN; persists progress)
keygarden-offline.html    # generated — React inlined, fully offline (do not hand-edit)
README.md
DISCLAIMERS.md
LICENSE
/tools                 # build + test scripts (Node)
  build-offline.mjs    # regenerates keygarden-offline.html from index.html
  smoke.mjs            # headless test of the source (CDN) build
  smoke-offline.mjs    # headless test of the generated offline build
```

**Edit `index.html` only.** `keygarden-offline.html` is built from it — never edit the offline file by hand, or your change will be lost on the next build.

## Make a change

The whole app lives in the `<script type="text/babel">` block in `index.html`: data (symbols + snippets + the `SKETCHES`) at the top, then the audio engine, then the React components. No framework, no build step needed to *run* it — just open the file.

### The Sketch layer

A live charcoal drawing fills in *below the typing card* on both Drill and Type-snippets (`LiveSketch`), built from the existing practice hooks — there's nothing new to "play." Each drawing is a connected SVG path in the `SKETCHES` array near the top: `{ name, d, accent }`. The path uses `pathLength="100"` so it reveals a fraction at a time with `stroke-dashoffset` (no length measurement). The ink stroke runs through the `kf-charcoal` SVG filter (a `feTurbulence`/`feDisplacementMap` roughen, defined once in `SketchDefs`) for the pencil texture; `accent` is one or more soft, **muted** color blobs that fade in with the line — Mike's pencil-with-a-touch-of-color style (check his charcoal work at michaelnocito.github.io/art). `STROKES_PER` (≈ a 5-minute session) is how many clean lines/streaks finish a drawing; `addStroke()` fires from the same celebration moments as the audio milestone. Finishing pushes the drawing's index onto `sketch.finished` and rolls to a new **random** one. State lives on `keygarden.v1.sketch` (`{ current, strokes, finished }`); Reset clears it.

To add a drawing, append `{ name, d, accent:[{cx,cy,r,c}] }` to `SKETCHES` — keep `d` a mostly-continuous path inside the `0 0 120 120` viewBox, and keep accent colors **desaturated** so it reads as art-plus-a-hint. Keep the **hard design rules**: no timers, no grades, no decay, nothing to fail.

**Art packs.** The same drawings render in a chosen style from the `PACKS` array — each pack is a small render config (`bg, ink, w, filter, ghost, accentOp, accentScale, accentSoft, stars`) applied by `SketchArt`. Filters live in `SketchDefs` (`kf-charcoal`, `kf-wet`, `kf-glow`, `kf-soft`). To add a pack, append one config and (if needed) one filter; the picker in settings and `keygarden.v1.pack` pick it up automatically. Packs are chosen for mass appeal + restorative "soft fascination" (charcoal, watercolor, abstract, celestial).

**Save / delete.** When a drawing reaches `STROKES_PER`, `addStroke` sets `sketch.pending` (and pauses) instead of auto-collecting it; `LiveSketch` then shows a Save / Delete choice. Save pushes the index to `finished` and rolls to a new random drawing; Delete just rolls on. (A "color saved sketches later" step is a planned future add.)

### The return-streak reward

Coming back is rewarded by a gentle day-streak shown on **Progress** (`keygarden.v1.streak` = `{ lastVisit, streak, days, sessions }`). It grows on consecutive days, **restarts (never scolds) after a gap**, counts every session, and is never a timer or a leaderboard. Finished sketches also collect on Progress. Keep both calm — they reward *showing up*, not performance.

### The welcome screen + breathing break

`Welcome` is the first-run orientation (toggled by the **?** nav button, open on first visit, remembered via `welcomeSeen`). It follows the Archaeology kits' North-Star principles — orient first (what you do / next / result / what you get), top-down and scannable, with one clear CTA (`onStart` → the warm-up). The feature list is the `FEATURES` array; keep entries short.

`BreatheOverlay` is the relax prompt: a guided **3-breath** reset with the exhale longer than the inhale (the fastest parasympathetic lever) plus tension cues. It's triggered by `useRelaxCue` (misses/hesitation, never speed) and gated by the module flag `RELAX_ON`. Defaults: **sound off** (`muted` defaults true), **breathing on** (`relaxOn` defaults true, toggle in ⚙). Keep both calm — no timers, no scores.

### Add code snippets (most common change)

Find the `SNIPPETS` array near the top and add entries:

```js
{ track: "SQL", text: "SELECT col FROM t WHERE x = 1;" },
```

Keep them **short** (one clause or line). `track` must be one of the existing tracks, or add a new one to the `TRACKS` array too. Brackets and quotes you open will auto-close in practice, so write the full, correct line — the app handles the closers.

## Build the offline file

After editing `index.html`:

```bash
cd tools
npm install        # one-time: react, react-dom, @babel/standalone, jsdom
node build-offline.mjs
```

This transpiles the app, inlines React, and writes `keygarden-offline.html`.

## Run the tests (headless, no browser)

```bash
cd tools
node smoke.mjs           # tests index.html
node smoke-offline.mjs   # tests keygarden-offline.html
```

Both should report all checks passing. The smoke tests mount the app in jsdom, mock the Web Audio API, drive real keystroke events, and assert behavior: the warm-up starts on the easiest key, closers auto-fill, a clean line celebrates, the relax prompt doesn't fire on clean typing, progress persists, etc. **Run both before opening a PR.**

## Style

- Keep it dependency-free and single-file. Part of the point is that anyone can read the whole thing.
- Keep feedback gentle. No harsh error sounds, no punishing UI, no per-keystroke fanfare — the calm tone is a design principle, not an accident.
- Finger hints and spatial coaching assume US QWERTY; if you change them, note the layout.
- The look follows Mike's **calm-analyst design system** (canonical: `spreadsheet-archaeology/DESIGN_SYSTEM.md`) — light theme, CSS variables on `#root`, soft cards, blue `--accent`, system-ui chrome with monospace only for code/keys. Stay on those tokens; don't reintroduce a bespoke palette.

## Reporting issues

Open a GitHub issue with your browser, OS, and keyboard layout, plus what you expected vs. what happened.
