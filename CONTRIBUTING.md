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

The **Sketch** tab is a calm reward built from the existing practice hooks — there's nothing new to "play." Each drawing is a single connected SVG path in the `SKETCHES` array near the top: `{ name, d }`. The path uses `pathLength="100"` so it can be revealed a fraction at a time with `stroke-dashoffset`, no length measurement needed. `STROKES_PER` is how many clean lines/streaks complete one drawing; `addStroke()` is fired from the same celebration moments as the audio milestone. Sketch state lives on the `keygarden.v1` localStorage object under `sketch` (`{ strokes, completed }`), and Reset clears it.

To add a drawing, append one `{ name, d }` to `SKETCHES` — keep `d` a **single continuous path** (one `M`, then curves) inside the `0 0 120 120` viewBox so it reveals as one unbroken line. Keep the **hard design rules**: no timers, no scores, no decay, nothing to fail — finishing a drawing simply rolls over to the next.

### The "How it works" guide

The collapsible guide is the `Guide` component (toggled by the **?** nav button, open on first visit, then remembered via `guideSeen`). Keep it to four short cards — it follows the progressive-disclosure principle of showing the 20% everyone needs and tucking the rest.

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
