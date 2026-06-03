# Keygarden

**A calm typing trainer for the symbols data work actually runs on** — the brackets, braces, operators, colons, and quotes that slow you down in SQL, Python, Excel, Tableau, and Power BI.

Most typing tutors drill prose. But if you write queries and scripts all day, the keys that trip you up aren't letters — they're `( ) [ ] { } : = _ * # | < >`. Keygarden focuses only on those, in a way that's meant to lower tension rather than add it.

→ **[Open Keygarden](https://michaelnocito.github.io/keygarden/)** (no install, runs in your browser)

Want it as an app on your taskbar? Open the link in **Chrome or Edge**, then click the small **install icon** that appears at the right side of the address bar (or *⋯ menu → Apps → Install Keygarden*). It will get a Start Menu shortcut, run in its own window, and work offline. No download, no antivirus warnings, no GitHub navigation. Works on Windows, Mac, Linux, and Chromebook the same way.

---

## What it does

- **Drill keys** — a **structured curriculum** (not random): keys are introduced gradually in easy→hard chunks, each gets a little focused repetition, then they're **interleaved and spaced** so the ones you fumble keep coming back. A big **placement description sits above the key** ("Top number row, above the 3 — with Shift"), and a **terminal line echoes what you actually type** so you get real visual confirmation.
- **Type snippets** — short, real lines of code tagged by track (SQL / Python / Excel / Tableau / Stats / Power BI). You type **every character, closers included** — like a real terminal — so the brackets and quotes get practiced too.
- **Progress rail** — always alongside your practice (a left rail on desktop, up top on a narrow window): your **return streak**, a status report of your **most-missed keys** (ranked by miss rate) with a **"Drill just these →"** button for a focused session, the live sketch, an accuracy heatmap, and your finished sketches.
- **A live sketch** — a little hand-drawn line **unfolds with every keystroke** (more when you're correct, a little when you miss), so it literally draws as you type — type faster and it draws faster. One drawing takes about a **five-minute session**; when it finishes, a **breathing break** pops up (five slow breaths), then you **save it to your collection or delete it** and a new, random drawing begins. Choose an **art style** — **Charcoal, Watercolor, Abstract, or Celestial**. Finished sketches collect in the **progress rail**, which also greets you with a gentle **return streak**. No timers, no grades, nothing to fail.

A built-in **How it works** card (the **?** in the nav, open on your first visit) explains all of this in the app, including how to tune or silence the relax prompt.

It also gives gentle, non-punishing feedback: a soft sound and a small visual on the moments that matter (a clean line, a clean streak), a quiet "soft-no" on a miss, plain-language coaching when you slip (*"You hit P — `]` is just to the right"*), and an optional breathe-prompt if it notices you tensing up.

## How to use it (60 seconds)

1. Open the link on a computer with a **physical keyboard** (it's a typing app — phones won't work). A **welcome splash** introduces the features the first time; it minimizes to the **?** button, which reopens it anytime.
2. Start with **Drill keys** (the warm-up runs easiest keys first). The big card is your work area; your **progress rail** sits alongside it the whole time. Don't rush; there's no timer and no score.
3. Switch to **Type snippets**, pick a track (or leave it on Mixed), and type the lines through. Closers fill themselves — just type the openers and content.
4. Glance at the **progress rail** for the keys you miss most (with a **"Drill just these"** button), your sketch filling in, your return streak, and an accuracy heatmap.
5. **Sound is off to start** — tap **♪** for gentle audio. In **⚙** you can switch the breathing breaks on/off and set how often they appear, and pick an art style.

If it senses tension (a run of misses, or a long hesitation — never typing fast), it offers a **guided breathing break**: three slow breaths, exhale longer than inhale, to loosen your shoulders. It's visual-only, on by default, and you can turn it off in **⚙**.

Your progress, settings, and sound preference are saved automatically in your browser.

## What to expect

The first few sessions will feel slow and a little awkward — that's the point. You're building **motor memory** for reaches your fingers don't make often, especially the Shift-combinations. Expect the *hesitation* before a symbol to shrink before raw speed climbs; that pause disappearing is the real progress, and the Progress heatmap tracks it (latency per key).

This is a practice tool, not a course. Typing the snippets will make SQL and Python *patterns* feel familiar, but it won't teach you what they mean — and it doesn't claim to.

## Getting the most out of it (the learning-science part)

Keygarden is built around two well-supported ideas: **spaced, short repetition** and **chunking**. To work with them, not against them:

- **Short and often beats long and rare.** Two focused 5–10 minute sessions on different days build more durable motor memory than one 40-minute grind. Fatigue creates tension, and tension is what you're trying to *unlearn* here. Stop while it still feels easy.
- **Let the adaptive drill do its job.** It resurfaces your weak keys on purpose (this is *spaced retrieval* — recalling a struggling key after a gap is what strengthens it). Don't skip the repeats; they're the mechanism.
- **Move to snippets once single keys feel calm.** That's chunking: once `(` and `)` are individually easy, practicing them inside `sum(x for x in nums)` lets your brain store the whole pattern as one unit instead of separate keystrokes. The fingers start to "know" `df[...]` as a shape.
- **Mix tracks once a track feels comfortable.** Interleaving (SQL, then Python, then Excel) feels harder in the moment but transfers better than blocking one track for an hour — your brain works to re-select the pattern each time, which is what makes it stick.
- **Keep it relaxed on purpose.** Drop your shoulders, let your wrists float, don't grip. If the breathe-prompt appears, take the reset. Calm repetition is the whole design; speed is a side effect of comfort, not the goal.

A realistic rhythm: ~5–10 minutes a day, most days, for two to three weeks. The symbols you dread now should feel ordinary by the end.

## The sketch

The sketch is the quiet payoff for practicing. It lives *on the typing screens* — a small charcoal drawing on paper, drawn in a pencil-with-a-little-color style. It's deliberately not a game-within-a-game; there's nothing to fail and nothing to chase:

- **Practicing draws it.** Every clean snippet line, and every clean streak in the drill, adds one stroke to a single continuous line. Watch it fill in over a faint outline of where it's headed, right under the keys.
- **Pick your style.** Choose an art pack in settings — **Charcoal** (default), **Watercolor**, **Abstract**, or **Celestial** (a calming night-sky mood). Every drawing renders in the style you pick.
- **Save it or let it go.** Most drawings finish in about a five-minute session. When one's done you **save it to your collection or delete it**, then a new, randomly chosen drawing begins — a leaf, a wave, a sailboat, a coffee cup, a key…
- **Coming back is rewarded.** **Progress** greets you with a gentle return streak that grows each day you show up. It never punishes a gap and never puts you on a clock — showing up at all is the point.

Everything is saved alongside the rest in your browser.

## Running it locally / offline

Two builds are included:

- **`index.html`** — the published version. Loads React from a CDN (needs internet once to load), and saves your progress reliably because it runs from a real web origin.
- **`keygarden-offline.html`** — fully self-contained (React inlined, no network at all). Double-click to run anywhere, even with WiFi off.

> **Note on the offline file:** some browsers block local storage for files opened directly from disk (`file://`), so the offline build may not *save* your progress between reloads even though it runs perfectly. For progress that sticks, use the hosted `index.html`. The app fails safe either way — it never errors, it just forgets.

## Privacy

No accounts, no telemetry, no server. The app does not send any keystroke or any other data over the network. The full technical explanation is in **[PRIVACY.md](PRIVACY.md)** — short read.

## Tech

Single-file React (no build step, no dependencies to install). All audio is synthesized in the browser with the Web Audio API — no sound files. The sketch is inline SVG, no images. Installable as a Progressive Web App (PWA) for offline use and a Start Menu shortcut, with no native download required.

The visual design follows the **calm-analyst design system** shared across the analyst prep kits (Tableau Archaeology, the Analyst Prep Kit, and friends) — the same light theme, soft cards, blue accent, and system typography.

## License

MIT — see [LICENSE](LICENSE). Free to use, share, fork, and build on.
