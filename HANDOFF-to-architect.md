# Keygarden — Handoff to Architect / Marketing

**Live:** https://michaelnocito.github.io/keygarden/
**Repo:** github.com/michaelnocito/keygarden
**Local:** `C:\Users\Mike\Projects\keygarden`
**Stack:** single-file React via CDN (`index.html`, ~1700 lines), inline-React offline twin (`keygarden-offline.html`), PWA (`manifest.json` + `sw.js`), no build step
**Tests:** 61/61 source smoke + 10/10 offline smoke (jsdom-based, in `tools/`)
**Current state:** fully working, on the Nocito calm-analyst design system, all features below shipped.

Three asks for this round:
1. **Catalog everything below for marketing** — the launch-materials team will pick the standout features; we want the full surface area on the table.
2. **Market analysis** — direct + adjacent competitors, where keygarden fits, what to claim and what not to claim.
3. **Scope a progression system** — the depth gap (see §6) is real and we want it scoped before going to launch.

---

## 1. Product positioning (Mike's words, for marketing voice)

> "I've been typing fast and well for years, but once I start coding I need to learn to use different keys on the keyboard in different sequences than I did before."

The product is **not** "learn to type." It is **"improve your typing for the new sequences your job requires."** The audience is already-fluent typists who hit a wall when their tools change — analysts moving into SQL, dev-curious office workers, medical staff hitting EHR templates, finance folks living in formulas.

Key positioning lines marketing should run with:
- **"Type the words and phrases you'll actually be using for what you'll be doing."** (Mike's framing of the field-template differentiator.)
- **"Not learn to type — improve your typing for what's next."**
- **"No timer. No score. Nothing to fail."** (Already in the Welcome copy.)
- The General field is **not** kid-stuff — it's the real punctuation of professional writing (emails, scheduling, notes). Call this out: "Even the 'General' field practices the way you actually write at work — apostrophes, slashes in dates, the email-line punctuation that turns a typo into someone showing up at the wrong time."

---

## 2. Architecture at a glance

| Layer | Implementation |
|---|---|
| App | Single-file React 18 + Babel/standalone via CDN in `index.html` |
| Offline build | `keygarden-offline.html` — React UMDs + transpiled app inlined; runs from `file://` |
| PWA | `manifest.json` (standalone, theme color, icon set), `sw.js` (network-first HTML, cache-first static, auto-update on deploy) |
| Persistence | `localStorage` key `keygarden.v1` — safe-fails on private/file://, never throws |
| Tests | `tools/smoke.mjs` (jsdom + Babel transpile, runs source) and `tools/smoke-offline.mjs` (jsdom against the inlined build) |
| Design system | Nocito calm-analyst (canonical: `spreadsheet-archaeology/DESIGN_SYSTEM.md`) |

**No build step for end-users. No accounts. No tracking. No backend.** This matters for marketability — "private by design, runs offline, installable as an app, free forever" is a clean line.

---

## 3. Complete feature inventory (for marketing to pick from)

### 3.1 Field templates (the headline differentiator)
- **6 fields:** Data & Analytics · General · Healthcare · Software / Web Dev · Cybersecurity / IT · Finance / Accounting
- Each template defines its own:
  - **Symbol set** — the keys that field actually uses
  - **Snippet library** — real text from that domain
  - **Track buckets** — sub-categories within the field (e.g., Data → SQL, Python, Excel, Tableau, Stats, Power BI; Healthcare → Vitals, Meds, Notes; Finance → Formulas, Figures, Reports)
- **Per-field progress** — switching fields keeps each field's stats separate; sketches/garden/streak stay shared
- **Field switcher** — pill in the top bar opens the picker any time; current field gets a "✓ Currently active" badge; non-destructive cancel
- **Deep-link** — `?field=healthcare` lands directly in that field

### 3.2 Word → Phrase → Line progression (inside each field)
- 3 explicit difficulty levels in Snippet mode:
  - **Words** — single tokens (`SELECT`, `=SUM(`, `BP`, `Re:`)
  - **Phrases** — mid-length expressions (`COUNT(*) > 5`, `500 mg PO q8h`)
  - **Lines** — full statements (`WHERE id = 1 AND active = TRUE;`)
- User chooses level; persists across sessions
- Mike's call: **closer auto-fill removed** so users type every character including closing brackets/quotes (closer-skipping was a learning bug)

### 3.3 Drill mode (single-symbol practice)
- **Master SYMBOL_DB** with per-symbol metadata: name, finger, plain-English placement, physical key, shift-required
- **Learning-science scheduler** (not random):
  - Gradual release — symbols introduced one at a time, in pedagogical easy→hard order
  - Massed acquisition — a few reps on the newest before moving on
  - Spaced + interleaved review across everything introduced
  - Weighted by per-symbol weakness (accuracy + speed)
  - No back-to-back repeats
- **"New key" badge** when introducing a fresh symbol
- **Per-symbol stats** (per field): attempts, errors, latency median, computed weakness
- **Focused drill** — "Drill just these →" pulls weakest keys into a subset
- **Untimed, unpenalized** — no failure state

### 3.4 On-screen keyboard diagram
- Full QWERTY layout (4 rows + spacebar), CSS-grid rendered
- **Finger-zone color coding** (8 fingers, standard touch-typing palette: left pinky → right pinky)
- Current target **blue**; required Shift key **purple**; wrong key flashes **red** for 700ms
- Staggered horizontal offsets simulate physical row stagger
- Plain-English placement hint **above** the big-key display: e.g., "Top number row, above the 9 — with Shift"
- Finger label below: "right ring + Shift"
- Scales at 1100px / 1400px breakpoints for bigger displays

### 3.5 Spatial miss-coaching
- When a wrong key is pressed, generates a direction hint relative to the target:
  - **"You hit Q — equals is up and to the right."**
  - **"Right key — = just needs Shift."** (when only the modifier is missed)
- Coverage: all printable keys + all shifted variants
- Documented assumption: US-QWERTY (called out in `DISCLAIMERS.md`)

### 3.6 Voice coaching
- Web Speech API (no external service)
- Reads the **target key name** aloud when the target changes
- Reads the **coaching hint** aloud on a miss
- Toggleable via `🔊` button in topbar; off by default
- Accessibility win: no setup needed, uses OS voice

### 3.7 Audio system (custom-synth, no samples)
- All audio generated via Web Audio API at runtime — **no MP3/WAV assets, works offline**
- **Correct keystroke** — warm pentatonic note (pitched, plays a 16-note phrase as you streak, so an unbroken run sounds melodic)
- **Miss** — low dull "soft-no", quieter downward slip — quieter than correct so it never feels punitive
- **Milestone** — warm rising arpeggio (root → fifth → octave)
- **Flow pad** — quiet root + fifth drone behind a lowpass, swells with streak length, decays on miss
- **Off by default** (changed from on-by-default — users found a chiming key on a quiet page surprising)
- `♪` toggle in topbar

### 3.8 LiveSketch (reward layer — the "calm" expression of progress)
- An SVG line drawing that **completes itself as you type**, panel sits next to the keyboard
- 10 iconic blue-stroke drawings (heart, star, check, house, mountain, balloon, arrow, leaf, key, smiley)
- Pen-tip dot follows the current draw position (uses `getPointAtLength` on the path)
- Faster typing → faster drawing
- One sketch ≈ a 5-minute session (`STROKES_GOAL` = 200 key-units)
- **On finish:**
  1. A 5-cycle breathing overlay pops up (paired with the natural rest moment)
  2. After breathing, **Save / Delete** choice on the finished sketch
  3. Saved sketches appear in the collection in the progress rail
- Collection of last 24 finished sketches
- prefers-reduced-motion strips the transition

### 3.9 Biodiversity garden (the long-arc reward)
- A real ecological **succession ladder** — order is botanically accurate:
  1. 🌸 Native wildflowers → bees + butterflies
  2. 💧 Birdbath → dragonflies, frog, songbirds
  3. 🐝 Bee house → solitary bees
  4. 🌿 Bug hotel + leaf pile → ladybugs
  5. 🫐 Berry shrubs → migrating birds
  6. 🌳 Native oak + nest box → chickadees
  7. 🦇 Bat house → bats + fireflies + night sky
  8. 🏆 Certified habitat → hummingbird
- Growth from clean drill streaks (every 12 correct in a row) and clean snippet completions
- **Animated wildlife** per tier (bees, butterflies, dragonfly, frog, ladybug, robin, chickadee, bat, fireflies, hummingbird)
- Each unlock pops a toast with the wildlife + a **real ecology fact** (e.g., "Solitary bees can pollinate up to ~20× more than honeybees — and most can't sting.")
- **Ghost silhouette** of the next element hints what's coming
- **Bat house unlock activates the night sky** — moon, stars, fireflies
- **Hard rule:** nothing wilts, nothing dies. Return after weeks → garden is waiting. No guilt cycle, no streak anxiety.
- All inline SVG — no images, no fonts, runs offline
- `prefers-reduced-motion` strips animations entirely

### 3.10 Calm-first interaction design
- **No timers, no score, no WPM, no leaderboards, no decaying combos** — explicit and consistent across the whole product
- **BreatheOverlay** — guided 3-breath reset
  - Inhale 4s, **exhale 6s** (research-backed parasympathetic lever; physiological-sigh territory)
  - Phases: prep → breath n of N → "Nice"
  - Triggered by tension cue (errors + hesitation, **never speed**)
  - Sensitivity slider: Rarely → Calm → Attentive → Eager (default Calm = 0.4)
  - On/off toggle in settings (default on)
  - Visual-only (no audio) — works hearing-impaired
- **5-cycle breathing pops automatically when a sketch finishes** (natural rest moment)

### 3.11 ProgressRail (always-visible accountability without anxiety)
- Sticky left rail on desktop (≥880px), stacks above work area on mobile
- **Return-streak banner**: "X days in a row" + sessions + sketches saved — grows on consecutive days, **restarts at 1 on a gap, never scolds**
- **Most-missed keys** (collapsible, open by default): top 5 by miss rate, amber→red bars, **"Drill just these →"** CTA → focused-drill mode
- **Accuracy heatmap** (collapsible): per-symbol HSL color (red→green), tooltip with %, ms, attempts
- **Finished sketches collection** (collapsible, open by default): last 9 thumbnails
- All cards collapse independently, chevron rotates 180° on open

### 3.12 Welcome / onboarding
- Full splash overlay on first run **over the field picker** so newcomers get oriented before being asked to pick
- **8 feature cards**, scannable, "You get:" benefit on each
- Field-aware copy — uses the active template's label + a representative track in the explanation
- CTA changes based on state: "Pick your field →" before a field is chosen; "Start the warm-up →" after
- **Reopenable anytime via the `?` button** in the topbar

### 3.13 PWA / installability
- Installable via Chrome/Edge's `beforeinstallprompt` — pill button surfaces it in a place users actually see
- Standalone window, Start Menu shortcut, runs offline
- Service worker:
  - **HTML / navigation** → network-first (so deploys appear on the next refresh — no incognito needed)
  - **Static assets** (icons, manifest, CDN React/Babel) → cache-first with background revalidation
  - Auto-update on deploy: skipWaiting + controllerchange reload
- Manifest hits both `any` and `maskable` icon purposes
- **Caveat for marketing:** unsigned installer triggers SmartScreen on Windows — call out "browser-native install, no .exe download" so users know it's not a sketchy download

### 3.14 Accessibility & inclusion
- `prefers-reduced-motion` honored in: garden wildlife, breathing orb, sketch transitions, celebration particles, progress bar — all strip cleanly
- **Touch-device detection** — on touch devices with no physical keyboard, a friendly "Keygarden needs a physical keyboard" notice replaces a broken experience
- Voice coaching covers blind/low-vision target identification
- High-contrast type, system-ui font stack, no Google Fonts dependency
- ARIA labels on the install dismiss button + chevrons
- Light theme everywhere, no flashing
- No personal data collected, ever — fully anonymous

### 3.15 Persistence schema (`localStorage["keygarden.v1"]`)
```jsonc
{
  "template": "data",                          // current field id
  "templates": {                               // per-field stats
    "data":      { "stats": { "<ch>": { "attempts": n, "errors": n, "lat": [ms,...] } } },
    "healthcare":{ "stats": { ... } }
  },
  "sketch":   { "current": idx, "strokes": n, "finished": [idx,...], "pending": idx|null },
  "streak":   { "lastVisit": "YYYY-MM-DD", "streak": n, "days": n, "sessions": n },
  "garden":   { "growth": n, "unlocked": [id,...], "lastVisit": null },
  "sens": 0.4, "muted": true, "relaxOn": true, "voiceOn": false,
  "welcomeSeen": true, "level": "Words", "installDismissed": false
}
```

### 3.16 Test coverage
- **`tools/smoke.mjs`** — 61 checks against source (jsdom + Babel/standalone transpile + run)
  - Welcome splash, picker, field switching, per-field persistence
  - Drill warmup easiest-first, learning-progression label, placement hint, keyboard diagram, typed-slots, miss-coaching
  - Snippet rendering, no auto-fill of closers, clean-line celebration
  - Settings panel, sensitivity slider, calm default, low-sensitivity not nagging
  - LiveSketch placement, sketch persistence, sketch advance on clean line
  - Return-streak tracking + banner
  - Collapsible cards (default-open + toggle)
  - Finished-drawing → breathing → save/delete → collection flow
  - Welcome list reachable from `?` button
  - Sound off by default
  - Most-missed report + "Drill just these" + focus bar + clear focus
  - Garden tab, view render, garden persistence, growth on milestone
  - No throw with audio muted
  - Field pill re-opens picker, cancel returns to chosen field
- **`tools/smoke-offline.mjs`** — 10 checks against the inlined offline build (no CDN dependency)

---

## 4. What's deliberately NOT in the product (and why)

| Not present | Why |
|---|---|
| WPM / speed score | "Never by speed" is a load-bearing rule. Calm is the whole wedge. |
| Leaderboard / social | Same rule — competition adds anxiety to a calm-coded tool. |
| Decaying streaks / nothing-wilts garden | Punitive return-mechanics fail the regret test. |
| Accounts / login | Privacy, offline-first, instant-on. |
| Tracking / analytics | Mike's portfolio principle. |
| Backend / sync | localStorage covers single-device; multi-device sync would require auth. |
| International keyboard layouts | US-QWERTY only; documented as a known limitation. |
| In-app payments | Free forever is the story. |

---

## 5. Direct + adjacent competitors (architect, please verify and expand)

The architect should produce a 1-page positioning grid covering at least:

**Direct typing-trainer competitors:**
- **typing.com** — broad market, alphabet-first, gamified, ads / school licensing
- **monkeytype** — speed-obsessed, leaderboard culture, race-against-yourself, dark theme
- **keybr** — smart adaptive scheduler (pure alphabet/common words), no domain content
- **typing.io** — code typing (real OSS source), speed metric, GitHub-style race
- **10fastfingers, ratatype** — speed/accuracy timed tests
- **TypeRacer** — race against other humans
- **Klavaro** — open-source, generic

**Domain-adjacent training tools (different category, similar wedge):**
- **medical scribe trainers** (Scribendi, SpeechWrite, custom EHR training tools)
- **finance keyboard shortcut trainers** (Wall Street Prep / Macabacus, but those are shortcut-only)
- **vim trainers** (Vim Adventures, vimgolf)
- **coding katas** (Codewars, Exercism — different skill, similar deliberate-practice framing)
- **hardware-bundled** trainers (Kinesis, ZSA Moonlander config tools)

**Calm-coded software (design-language references, not competitors):**
- Calm, Headspace, Insight Timer (visual + audio language references for the calm-first claim)
- One Sec, Forest (habit-anxiety tools to **avoid** being mistaken for)

**Asks for the architect's analysis:**
1. **Wedge defensibility** — domain-specific re-training for already-fluent typists is the wedge. Is anyone else credibly here? Where's the closest substitute and why is keygarden still distinguishable?
2. **Calm framing as moat** — most typing tools are speed-coded. How sticky is "the calm typing trainer" as a brand position? Comparison to Calm/Headspace's brand-as-moat play.
3. **Marketability per audience segment** — career-switcher analysts (Mike's primary), medical/finance staff doing EHR/spreadsheet work, dev-curious office workers, accessibility-driven users (reduced-motion + visual breathing is a real story). Rank by acquisition cost + LTV intuition.
4. **Distribution channels** — analyst bootcamps, code schools, EHR vendors (B2B angle), HR/wellness budgets at large employers, neurodivergent-friendly tool lists.
5. **Pricing — Mike's principle is free-forever.** But scope a *donation* / *Pro* / *sponsorship* path that doesn't break the calm story. (Possible: paid custom-template authoring, paid "your team's snippet library" for company training, white-label for bootcamps.)

---

## 6. Depth gap — Mike's concern, architect please scope

Mike's read (correct): **"right now I can see there not being much depth."** Once you've drilled through your weakest keys and finished a sketch, the loop is the same loop. The garden and streak give long-arc reward but they don't gate **skill rigor**. We need a progression system before launch.

### What's in the product today (the depth that does exist):
- Drill's learning scheduler (intro → massed → spaced+interleaved)
- 3-level Snippet ladder (Words / Phrases / Lines) — but **user picks**, no auto-advance
- Focus mode (drill your weakest 5)
- Per-symbol weakness scoring drives the next target
- Streak + garden tier-ups as long-arc

### What's missing and worth scoping (ranked by impact):

1. **Skill-ladder per field** — explicit milestones with clear thresholds, e.g.:
   - *Tier 1 — Foundation:* hit ≥95% accuracy + ≤500ms median on the 5 easiest field symbols
   - *Tier 2 — Combinations:* clean Phrase-level snippets in the field's primary track
   - *Tier 3 — Fluency:* clean Line-level across all tracks
   - *Tier 4 — Specialist:* multi-line blocks (see #4 below)
   - Each tier earns a visible badge in the rail. Counters mastery void.

2. **Mastery-gated auto-advance** — when you hit thresholds, the Snippet level advances automatically (manual override stays). Removes the "I don't know what level I should be on" friction.

3. **Boss rounds / proficiency check-ins** — periodic, untimed but stricter sequences. A long Power Query M expression, a complete charted vital block, a real-world SQL query Mike's actually written. Optional, opt-in. Feels like a milestone, not a test.

4. **"Block" level above Lines** — 3–8 lines of real code/text that have to be typed in sequence. The natural depth ceiling above "Lines."

5. **Modifier-key / shortcut drills** — Ctrl/Cmd/Alt + key combos for the field (VS Code shortcuts, Excel shortcuts, vim motions, terminal navigations). This is a **massive unfilled gap in the typing-trainer market** and natively fits keygarden's domain-specific story. Probably the single most marketable depth addition.

6. **Custom snippets / "Bring your own"** — let the user paste their actual SQL query, their team's email template, the medical chart line they keep mistyping. Opens the door to instructor mode and team customization later.

7. **"Today's practice" — the daily prompt** — one short field-specific snippet per day, like the NYT Mini. Pulls from your most-missed across all sessions, cycles old material in. Builds habit without nagging.

8. **Exportable progress report** — PDF or sharable image of: streak, time invested, weakest-key improvement curve, most-mastered symbols. **Especially valuable for Mike's audience** (career-switcher analysts can drop it in a portfolio or interview prep).

9. **Multi-device sync (post-MVP)** — only if a Pro tier is scoped. Anonymous account + sync would keep the free story intact.

10. **Career-track curricula** — "SQL Analyst Track" / "Spreadsheet Analyst Track" / "EHR Charter Track" etc. — bundles of fields + snippets + milestones aimed at a specific job. Big marketing handle.

### Architect, please produce for §6:
- A recommended **first-cut progression system** (which 2–3 of the above to ship for v1.x), with rationale
- A **schema migration plan** (current localStorage schema must extend, not break — existing users keep their stats)
- A **mastery-threshold proposal** — what counts as "mastered" for a symbol / for a tier
- **UI surface** — where the tier shows in the rail, how unlocks feel (consistent with the garden's no-anxiety pattern), where badges go
- **Test plan** — the smoke suite must extend to cover the new gates without flaking

---

## 7. Suggested marketing call-outs (for the launch-materials team to pick from)

Marketing should treat this as a menu, not a checklist — pick the 3–4 that best fit the chosen audience for launch.

- **"Improve your typing for the new sequences your job requires."** *(Headline. Sells the wedge.)*
- **"Type the words and phrases you'll actually be using."** *(Mike's framing. Sells the field templates.)*
- **"6 fields, one calm trainer."** *(Sells the breadth.)*
- **"No timer. No score. Nothing to fail."** *(Sells the calm wedge.)*
- **"Watch a garden grow as you practice."** *(Sells the long-arc reward + the design-as-feature angle.)*
- **"Built for the desk, runs offline, installs in one click."** *(Sells the privacy + PWA story.)*
- **"Real ecology facts unlock as you go."** *(Sells the unique-among-typing-tools content angle.)*
- **"Spatial coaching tells you exactly where the right key is."** *(Sells the actually-effective-practice angle.)*
- **"Three slow breaths whenever you tense up — never when you speed up."** *(Sells the wellness layer + the principled-design angle. Accessibility + ND-friendly story lives here.)*
- **"On-screen keyboard shows you which finger goes where."** *(Sells the actually-teaches-you angle.)*

The General field's professional-writing positioning Mike called out specifically belongs in the field-template section: **"Even General mode trains the real punctuation of professional writing — apostrophes, date slashes, the email-line punctuation that turns a typo into someone showing up at the wrong time."**

---

## 8. Open questions for Mike before launch

1. **Pricing model.** Free-forever is the principle; is donation / sponsor / "Pro for teams" a story we're scoping or off-the-table?
2. **Custom snippets.** v1.x or post-launch?
3. **Career-track curricula** (SQL Analyst Track, etc.) — interesting for marketing but adds curriculum scope.
4. **B2B / education angle** — bootcamps and EHR vendors are warm leads; do we want any of that pre-launch or stay consumer-only first?
5. **Sister fields** — is "Legal" (contracts, citations, case numbers) a no-brainer next field? "Customer Service" (chat shortcuts, signoffs)?

---

## 9. File map for the architect

```
keygarden/
├── index.html              ← the app (EDIT ONLY THIS)
├── keygarden-offline.html  ← generated, never hand-edit (rebuilt by tools/build-offline.mjs)
├── manifest.json           ← PWA manifest
├── sw.js                   ← service worker (network-first HTML, cache-first static)
├── icon-192.png / icon-512.png / apple-touch-icon.png / favicon-32.png
├── README.md / CONTRIBUTING.md / DISCLAIMERS.md / PRIVACY.md / LICENSE
└── tools/
    ├── package.json
    ├── build-offline.mjs   ← cd tools && node build-offline.mjs → writes keygarden-offline.html
    ├── smoke.mjs           ← cd tools && node smoke.mjs → expect 61/61
    └── smoke-offline.mjs   ← cd tools && node smoke-offline.mjs → expect 10/10
```

**Always run both suites before shipping. The offline suite is what guarantees the no-network promise holds.**
