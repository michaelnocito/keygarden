# Keygarden

**A calm typing trainer for the symbols data work actually runs on** — the brackets, braces, operators, colons, and quotes that slow you down in SQL, Python, Excel, Tableau, and Power BI.

Most typing tutors drill prose. But if you write queries and scripts all day, the keys that trip you up aren't letters — they're `( ) [ ] { } : = _ * # | < >`. Keygarden focuses only on those, in a way that's meant to lower tension rather than add it.

→ **[Open Keygarden](https://michaelnocito.github.io/keygarden/)** (no install, runs in your browser)

---

## What it does

- **Drill keys** — one symbol at a time, easiest to hardest, with a finger-placement hint. The order adapts to *you*: the keys you miss or hesitate on come back more often.
- **Type snippets** — short, real lines of code tagged by track (SQL / Python / Excel / Tableau / Stats / Power BI). Closing brackets auto-fill the way your editor does, so you practice the keys you actually press, not phantom closers.
- **Progress** — a heatmap of your accuracy and speed per symbol, and the two keys to focus on next.
- **Garden** — a calm reward that grows as you practice. Clean lines and clean streaks quietly grow a garden, and as it gets more biodiverse, real wildlife arrives. Each step teaches one true fact about backyard ecology. No timers, no scores, nothing wilts — it just waits for you.

It also gives gentle, non-punishing feedback: a soft sound and a small visual on the moments that matter (a clean line, a clean streak), a quiet "soft-no" on a miss, plain-language coaching when you slip (*"You hit P — `]` is just to the right"*), and an optional breathe-prompt if it notices you tensing up.

## How to use it (60 seconds)

1. Open the link on a computer with a **physical keyboard** (it's a typing app — phones won't work).
2. Start with **Drill keys**. Let it walk you through the warm-up once — easiest keys first. Don't rush; there's no timer and no score.
3. Switch to **Type snippets**, pick a track (or leave it on Mixed), and type the lines through. Closers fill themselves — just type the openers and content.
4. Check **Progress** to see which keys are still slow, then drill those.
5. Tap **⚙** to set how often the relax prompt appears, or to mute sound. Tap **♪** to toggle sound quickly.

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

## The garden

The **Garden** tab is the emotional payoff for coming back. It's deliberately not a game-within-a-game — there's nothing to fail and nothing to chase:

- **Practicing grows it.** Every clean snippet line and clean drill streak adds a little growth. Turning a key you used to struggle with into a calm, accurate one grows it faster.
- **Biodiversity unlocks in real ecological order** — native wildflowers, then water, a bee house, a bug hotel and leaf pile, berry shrubs, a native oak with a nest box, a bat house, and finally a certified habitat. Each tier brings new ambient wildlife (bees, butterflies, dragonflies, songbirds, ladybugs, bats, fireflies, hummingbirds) and shows one short, **true** fact about why it matters.
- **It rests with you.** The breathe-prompt is reframed as the garden settling for a moment — same gentle trigger. Plants close at night; nothing ever dies. Come back after days away and the garden simply waited for you.

Garden progress is saved alongside everything else in your browser.

## Running it locally / offline

Two builds are included:

- **`index.html`** — the published version. Loads React from a CDN (needs internet once to load), and saves your progress reliably because it runs from a real web origin.
- **`keygarden-offline.html`** — fully self-contained (React inlined, no network at all). Double-click to run anywhere, even with WiFi off.

> **Note on the offline file:** some browsers block local storage for files opened directly from disk (`file://`), so the offline build may not *save* your progress between reloads even though it runs perfectly. For progress that sticks, use the hosted `index.html`. The app fails safe either way — it never errors, it just forgets.

## Tech

Single-file React (no build step, no dependencies to install). All audio is synthesized in the browser with the Web Audio API — no sound files. The garden and wildlife are inline SVG, no images. No accounts, no tracking, no data leaves your machine; "progress" is just a value in your own browser's local storage.

The visual design follows the **calm-analyst design system** shared across the analyst prep kits (Tableau Archaeology, the Analyst Prep Kit, and friends) — the same light theme, soft cards, blue accent, and system typography.

## License

MIT — see [LICENSE](LICENSE). Free to use, share, fork, and build on.
