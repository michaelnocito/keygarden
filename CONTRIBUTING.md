# Contributing

Thanks for your interest in Keygarden. It's a deliberately small, single-file app — easy to read, easy to change.

## Repo layout

```
index.html             # published app (React via CDN; persists progress)
keygarden-offline.html # generated — React inlined, fully offline (do not hand-edit)
manifest.json          # PWA manifest (name, icons, theme color)
sw.js                  # service worker — caches the shell so installed PWA works offline
icon-192.png           # PWA icon (192x192) — used by installed-app shortcut
icon-512.png           # PWA icon (512x512) — used by splash screens on Android/iOS
apple-touch-icon.png   # iOS home-screen icon (180x180)
favicon-32.png         # browser tab favicon (32x32)
README.md
PRIVACY.md             # plain-English data + permissions explainer
DISCLAIMERS.md
LICENSE
/tools                 # build + test scripts (Node)
  build-offline.mjs    # regenerates keygarden-offline.html from index.html
  smoke.mjs            # headless test of the source (CDN) build
  smoke-offline.mjs    # headless test of the generated offline build
```

**PWA notes.** The published site is installable: when a visitor opens `index.html` in Chrome or Edge, the address bar offers an "install" button that creates a Start Menu shortcut and caches the page for offline use. The cache lives in `sw.js`. **Bump `CACHE` in `sw.js`** to a new value (`keygarden-v2`, `v3`...) whenever you ship a change you need users to see immediately — otherwise the old cached version may persist.

**Edit `index.html` only.** `keygarden-offline.html` is built from it — never edit the offline file by hand, or your change will be lost on the next build.

**Drill orientation + focus.** Each `SYMBOLS` entry has a `where` field (row + landmark, e.g. "Top number row, above the 3 — with Shift"); the drill shows it **big, above the symbol**, with a calming lead line. **Progress** ranks the most-missed keys (`attempts >= 3 && errors > 0`, by miss rate) and a **"Drill just these"** button calls `onFocus(chars)` → App `focusKeys` → `Drill` practices only those (no warm-up, weighted toward the weaker ones); "drill all keys" clears it.

## Make a change

The whole app lives in the `<script type="text/babel">` block in `index.html`: data (symbols + snippets + the `SKETCHES`) at the top, then the audio engine, then the React components. No framework, no build step needed to *run* it — just open the file.

### Layout (desktop shell)

`App` renders a sticky **top bar** (brand · mode nav · `? ♪ ⚙` controls) over a two-column **`.kf-stage`**: a sticky **`.kf-rail`** (the always-visible `ProgressRail` — streak, most-missed report, live sketch, heatmap, collection) on the left, and the **`.kf-work`** area (the active `Drill`/`Snippet`) on the right. Below ~880px it collapses to one column with the rail on top. The **welcome** is a first-run overlay (`.kf-welcome-backdrop`) that minimizes to the `?` button; **settings** is a top-right dropdown overlay. Avoid `backdrop-filter` (it stalls some renderers — the top bar uses a solid background).

### The Sketch layer

A live drawing sits in the **progress rail** (`LiveSketch`) and unfolds as you type. Each drawing is a connected SVG path in `SKETCHES`: `{ name, d, accent }`, with `pathLength="100"` so `stroke-dashoffset` reveals a fraction (no length measurement). The render style comes from the chosen `PACKS` entry (see Art packs). **Progress is per keystroke:** App's `addProgress(ok)` adds `STEP_OK` when correct / `STEP_MISS` when wrong, so it draws live (faster typing → faster drawing) and finishes at `STROKES_GOAL` (~5 min). Finishing sets `sketch.pending` (which pops a breathing break, then a save/delete choice). State lives on `keygarden.v1.sketch` (`{ current, strokes, finished, pending }`); Reset clears it.

To add a drawing, append `{ name, d, accent:[{cx,cy,r,c}] }` to `SKETCHES` — keep `d` a mostly-continuous path inside the `0 0 120 120` viewBox, and keep accent colors **desaturated** so it reads as art-plus-a-hint. Keep the **hard design rules**: no timers, no grades, no decay, nothing to fail.

**Art packs.** The same drawings render in a chosen style from the `PACKS` array — each pack is a small render config (`bg, ink, w, filter, ghost, accentOp, accentScale, accentSoft, stars`) applied by `SketchArt`. Filters live in `SketchDefs` (`kf-charcoal`, `kf-wet`, `kf-glow`, `kf-soft`). To add a pack, append one config and (if needed) one filter; the picker in settings and `keygarden.v1.pack` pick it up automatically. Packs are chosen for mass appeal + restorative "soft fascination" (charcoal, watercolor, abstract, celestial).

**Save / delete.** Reaching `STROKES_GOAL` sets `sketch.pending` (and pauses progress). An App effect pops a 5-cycle breathing break; once dismissed, `LiveSketch` shows the Save / Delete choice. Save pushes the index to `finished` and rolls to a new random drawing; Delete just rolls on.

### The return-streak reward

Coming back is rewarded by a gentle day-streak shown on **Progress** (`keygarden.v1.streak` = `{ lastVisit, streak, days, sessions }`). It grows on consecutive days, **restarts (never scolds) after a gap**, counts every session, and is never a timer or a leaderboard. Finished sketches also collect on Progress. Keep both calm — they reward *showing up*, not performance.

### The welcome screen + breathing break

`Welcome` is the first-run orientation (toggled by the **?** nav button, open on first visit, remembered via `welcomeSeen`). It follows the Archaeology kits' North-Star principles — orient first (what you do / next / result / what you get), top-down and scannable, with one clear CTA (`onStart` → the warm-up). The feature list is the `FEATURES` array; keep entries short.

`BreatheOverlay` is App-level (`breathe` = cycle count; `triggerBreathe`/`closeBreathe`): a guided breathing reset, exhale longer than inhale (the fastest parasympathetic lever), starting with a small **"prepare"** circle that grows on each inhale. It's triggered two ways: **tension** via `useRelaxCue(onTrigger)` → 3 breaths (misses/hesitation, never speed; gated by `RELAX_ON`), and **finishing a drawing** → 5 breaths. Defaults: **sound off** (`muted` defaults true), **breathing on** (`relaxOn` defaults true, toggle in ⚙).

Also: the drill is a learning-science scheduler (gradual release + massed acquisition + spaced/interleaved review) with a `.kf-term` terminal echo of typed keys; snippets have **no auto-close** (type every character). See the components for details.

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
