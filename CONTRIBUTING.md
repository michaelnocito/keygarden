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

The whole app lives in the `<script type="text/babel">` block in `index.html`: data (symbols + snippets + the garden `LADDER`) at the top, then the audio engine, then the React components. No framework, no build step needed to *run* it — just open the file.

### The Garden layer

The **Garden** tab is an ambient, calm reward built from the existing practice hooks — there's nothing new to "play." The biodiversity ladder is the `LADDER` array near the top of the script: each entry is `{ id, icon, name, wild, cost, fact, critters }`, in real ecological unlock order. `cost` is cumulative **growth** (clean lines, clean streaks, and newly-mastered weak keys all add growth). Garden state lives on the existing `keygarden.v1` localStorage object under `garden`, and Reset clears it.

If you add or edit a tier, keep the **hard design rules**: no timers, no scores, no decay, nothing wilts, wildlife is ambient-only, and every `fact` must be **true** (cite a real source — don't invent ecology). Wildlife is inline SVG in `critterArt()`; keep counts modest so the scene stays calm.

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
