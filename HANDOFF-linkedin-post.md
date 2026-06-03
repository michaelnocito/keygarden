# Keygarden — LinkedIn Post Handoff to Architect

**Goal:** one LinkedIn post announcing Keygarden — a public artifact Mike can pin to his profile to support an active **junior data analyst** job hunt. Architect picks the angle; this doc gives every piece needed to write it well.

**Live:** https://michaelnocito.github.io/keygarden/
**Repo:** github.com/michaelnocito/keygarden
**Mike's portfolio hub:** https://michaelnocito.github.io/

---

## 1. Primary audience (read in order)

1. **Hiring managers + recruiters for data-analyst roles.** They'll skim the post and click through to one or two things. The post must do double duty: be interesting on its own *and* leave a hire-worthy impression.
2. **Other career-switchers / aspiring analysts.** Reshares from this group put the post in front of audience #1.
3. **General professional network** (former colleagues, learners, friends). They'll like and comment — algorithmic lift.

---

## 2. Job-hunt positioning rules (non-negotiable)

Mike is positioning as a **junior data analyst**, not as an educator or teacher. He has a research / training background — that's a *transferable analyst strength* (finding signal, defining problems clearly, communicating findings), **not** a competing identity. The post must read like a thoughtful analyst's side project, not a teacher's product launch.

**Frame Keygarden as evidence of analyst skills, specifically:**
- **User research** — Mike identified a real workflow pain (already-fluent typists hitting a wall with new symbol-heavy tools — SQL, Python, formulas).
- **Problem scoping** — narrowed an "everything for everyone" problem into 6 specific field-tuned trainers.
- **Shipping** — moved from idea to a tested, deployed, installable product. Public artifact.
- **Iteration with measurement** — per-symbol stats, mastery thresholds, a progression system that responds to behavior.
- **Communicating clearly** — calm-by-design copy, plain-English placement hints, no jargon.

**Avoid:**
- "As a teacher who…" framing
- "Educational app" as the category
- "I love teaching X" sentiments
- Anything that reads like a course or curriculum business
- Speed/race language (it's not Monkeytype, it's not typing.com)

---

## 3. Mike's voice (so the post sounds like him)

- **Direct, no fluff.** First sentence does work. No "I'm excited to share…"
- **First-person, lowercase chill** is fine.
- **Specifics over abstractions** — name the symbol, name the field, name the workflow.
- **Self-aware but not self-deprecating.** "I built this because I needed it" beats "I'm just a beginner."
- **Calm, never hype.** No 🚀, no "game-changer," no "thrilled to announce."
- **Personality-OK humor** if it lands; never mean.
- **Brevity wins** — LinkedIn posts ≤ 1,300 chars perform best. Shorter is fine.

**He does say things like:**
> "I've been typing fast and well for years, but once I start coding I need to learn to use different keys on the keyboard in different sequences than I did before."
>
> "Type the words and phrases you'll actually be using for what you'll be doing."

**He does not write things like:**
- "I'm thrilled to announce…"
- "We've reimagined typing for the modern age."
- "Game-changer." "Unlock your potential." "Level up."
- Anything with hashtag stacks longer than 3.

---

## 4. Product in 30 seconds (for the architect)

Keygarden is a calm typing trainer for **the symbols your job actually uses** — brackets, operators, punctuation. Pick one of six fields (Data & Analytics, General, Healthcare, Software / Web Dev, Cybersecurity / IT, Finance / Accounting) and you drill *only* what that field types. Real snippets — SQL, Python, charts, formulas, shell commands — at three difficulty levels (Words → Phrases → Lines).

It teaches *and* coaches: an on-screen keyboard shows you which finger goes where; spatial coaching tells you exactly where the right key is when you miss it ("you hit Q — equals is up and to the right"); optional natural-voice readback (uses your OS's best neural voice — Microsoft Aria, Samantha, etc.).

No timer. No score. No leaderboard. Instead: a sketch that draws itself as you type, a biodiversity garden that grows tier-by-tier as you practice (wildflowers → birdbath → bee house → bug hotel → berry shrubs → oak → bat house → certified habitat), and a 3-breath reset that pops up only when it senses tension (never speed).

Just shipped: a **4-tier skill ladder** (Foundation → Combinations → Fluency → Specialist) with **three mastery presets** (Fast Track / Normal / Set in Stone) and **auto-advance** between Words / Phrases / Lines.

Free. No signup. Runs offline. Installable as a desktop app from the browser.

---

## 5. Headline angles (architect picks ONE)

### A — The wedge: career-switcher reality check
**Lead:** "I've been typing for 25 years. I'm slow at SQL. Turns out those are different skills."
**Body:** explains the gap, shows the field-template idea, points to keygarden.
**Best when:** the audience is hiring managers + other career-switchers. Highest job-hunt signal.

### B — The build-in-public ship
**Lead:** "Shipped a typing trainer this weekend." Or: "Keygarden is live."
**Body:** the 30-second product description + one or two design decisions (e.g., "I removed the timer entirely. Speed is a side effect of fluency, not the goal.")
**Best when:** signaling shipping velocity / engineering judgment.

### C — Calm tech POV
**Lead:** "Most software wants you anxious. I tried building something that doesn't."
**Body:** the design principles (no timer / no score / nothing wilts / breathing breaks only on tension, never speed) → reveal the product.
**Best when:** the audience overlaps with calm-tech / ND-friendly tool circles. Broader resonance, slightly less job-hunt-direct.

### D — Specific user pain
**Lead:** "Every time I write a SQL query I lose a few seconds on the brackets."
**Body:** specific, concrete, shows analyst's eye for friction. Reveal product.
**Best when:** speaking to analysts directly. Strong reshare potential within the field.

### E — Anti-leaderboard
**Lead:** "I deleted every metric except one: did you show up today."
**Body:** the design philosophy, then reveal. Garden + return-streak as proof.
**Best when:** going for engagement on the design-decisions angle.

**Recommended default: A.** It's the strongest job-hunt signal and the most Mike-shaped quote.

---

## 6. Substance the architect can pull from

(Pick 2–3; don't pile them all in.)

- **6 fields:** Data & Analytics, General, Healthcare, Software / Web Dev, Cybersecurity / IT, Finance / Accounting.
- **3-level snippet progression:** Words → Phrases → Lines, per field.
- **4-tier skill ladder:** Foundation → Combinations → Fluency → Specialist (per field).
- **3 mastery difficulties:** Fast Track / Normal / Set in Stone.
- **No timer, no score, no leaderboard.** Speed is never measured, never displayed.
- **On-screen keyboard** with finger-zone colors and target highlighting.
- **Spatial miss-coaching:** "You hit Q — equals is up and to the right."
- **Voice coaching** with the OS's natural voice (Microsoft Aria / Jenny Online, Apple Samantha, Google US English).
- **LiveSketch:** a small line drawing that completes itself as you type (~5 min = 1 finished drawing).
- **Biodiversity garden** that grows as you practice. Nothing wilts. Real ecology facts on unlock.
- **3-breath reset** that pops up when it senses tension (never speed). Inhale 4s, exhale 6s.
- **Per-field stats persist independently** in localStorage.
- **Free. No signup. No tracking. Runs offline. Installable as a PWA.**
- **Built solo, in vanilla React via CDN, single HTML file (~1700 lines).**

---

## 7. Suggested links + CTA inside the post

- **Try it:** https://michaelnocito.github.io/keygarden/
- (Optional) **Source:** github.com/michaelnocito/keygarden
- (Optional) **Portfolio:** https://michaelnocito.github.io/

Pick at most two clickable surfaces — LinkedIn truncates and the link preview eats a lot of space.

**CTA voice:** never "click here." Try: "Live link in the comments" / "Try a field" / "Pick a field. See what your fingers know."

---

## 8. Format constraints

- **≤ 1,300 characters** (LinkedIn shows the "see more" cut around 210 chars on desktop; first 2 lines must hook).
- **First 2 lines do the heavy lifting** — that's all most people see in the feed.
- **Line breaks generously** — LinkedIn rewards scannable paragraphs. Walls of text get scrolled past.
- **One link, in the post itself OR in a first-comment** — LinkedIn slightly de-prioritizes posts with outbound links; the comment trick is fine but optional.
- **Hashtags:** 0–3 max. Suggested only if used: `#dataanalytics #typing` plus maybe `#sideproject`. Avoid hashtag stacks.
- **Image / GIF strongly recommended** — feed posts with media get ~2× the impressions. See §9.

---

## 9. Media suggestion (pick one)

**Best option — short GIF (≤ 6s):**
- Screen-record typing one snippet in the Data field with audio on.
- Show: the on-screen keyboard lighting up the next key, the LiveSketch drawing in real time, the tier badge ticking up.
- That GIF tells the whole story without sound.

**Easier option — single screenshot:**
- The Drill screen with: the big "=" symbol, the placement hint, the keyboard with the blue target, the garden tier badge in the rail.
- Caption it nothing — let the image speak.

**Backup option — carousel (LinkedIn document):**
- Slide 1: hook + screenshot
- Slide 2: "6 fields" with the picker
- Slide 3: "Type code mode" with the keyboard + drawing
- Slide 4: "The garden grows as you practice"
- Slide 5: link + portfolio

Carousels are higher-effort but stick longer.

---

## 10. What NOT to include

- **No AI attribution anywhere.** Mike's public artifacts are solely authored by him. No "built with Claude / Copilot / GPT" mentions; no "AI-powered" claims (Keygarden uses no LLMs — only Web Speech for voice, which is OS-native).
- **No false originality claims.** Don't say "the first" or "the only." It's a well-built thing in a known category — let it be.
- **No "I taught myself to code" arc.** Stay in analyst voice.
- **No price ladder / "Pro version coming" tease.** Free-forever is the position.
- **No metrics theater.** Don't claim user counts, install counts, etc. Don't have them; don't fake them.
- **No competitor name-drops** unless it's a clean contrast that flatters us without disparaging them. "Most typing trainers race; this one doesn't" is fine. "Better than X" is not.

---

## 11. Draft prompts the architect can use (pick whichever fits the chosen angle)

**For angle A (career-switcher reality check):**
> Hook: a one-line truth about analyst-typing being a different skill than ordinary typing. Body: name the friction (brackets, operators, formulas) without complaining; introduce the field-template idea; one specific feature that proves the product thought about the problem (e.g., spatial miss-coaching or per-field tracks); close with the link. Tone: dry, observational. Sign off without flourish.

**For angle B (build-in-public ship):**
> Hook: "Shipped keygarden this weekend." Body: 3-line product description (what it is, what makes it specifically *yours*, what's free about it), one design decision worth defending (e.g., "no speed metric"), and a single technical credibility line (e.g., "single HTML file, runs offline, free forever"). Close with the link.

**For angle C (calm tech POV):**
> Hook: a contrarian one-liner about typical software design (anxiety as feature). Body: name the design rules ("no timer, no score, no leaderboard"); describe the calm reward layer (sketch + garden); the breathing-break sensitivity that triggers on errors, never on speed. Close: the link, and an invitation to try a field.

---

## 12. Followup posts (optional, post-launch sequence)

If the architect wants to plan a 3-post sequence over a few weeks (job-hunt asset compounding):

1. **Launch post** — this one.
2. **Design-decision post (1–2 weeks later)** — e.g., "Why I deleted the timer." Pulls one principle and explains it deeply. Demonstrates judgment for hiring audience.
3. **Numbers / takeaway post (3–4 weeks later)** — what Mike learned shipping it. Soft analyst-voice (cohort behavior observations, design tradeoffs). Closes the loop on the "thinks like an analyst" signal.

The architect doesn't have to write all three now; flagging the sequence helps them choose what *not* to put in post #1.

---

## 13. One-line elevator pitch (steal this freely)

> Keygarden — a calm typing trainer for the symbols your job actually uses. Six fields, no timer, no score, garden grows as you practice. Free, runs offline, no signup.
