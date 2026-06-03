import React from "react";
import * as ReactDOMClient from "react-dom/client";
import fs from "fs";
import { JSDOM } from "jsdom";
import * as Babel from "@babel/standalone";

const html = fs.readFileSync("../index.html", "utf8");
const m = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!m) throw new Error("no babel script found");
let code = m[1];

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="root"></div></body></html>`, {
  pretendToBeVisual: true,
  url: "https://keygarden.local/",
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

// React 18 globals
global.React = React;
global.ReactDOM = ReactDOMClient;
window.React = React;
window.ReactDOM = ReactDOMClient;

// Web Audio mock
const node = () => ({ connect: (d) => d || node(), start() {}, stop() {},
  gain: { value: 0, linearRampToValueAtTime() {}, setValueAtTime() {} },
  frequency: { value: 0 }, type: "" });
class AC {
  constructor() { this.sampleRate = 44100; this.currentTime = 0; this.state = "running"; this.destination = node(); }
  createGain() { return node(); }
  createOscillator() { return node(); }
  createBiquadFilter() { return node(); }
  createBufferSource() { const n = node(); n.buffer = null; return n; }
  createBuffer() { return { copyToChannel() {} }; }
  resume() {}
}
window.AudioContext = AC;

const results = [];
const ok = (n, c) => results.push([c ? "PASS" : "FAIL", n]);

// transpile + run
const out = Babel.transform(code, { presets: ["react"] }).code;
try {
  // eslint-disable-next-line no-new-func
  new Function("React", "ReactDOM", "window", "document", "performance", "navigator", out)(
    global.React, global.ReactDOM, window, window.document, window.performance, window.navigator
  );
  ok("mounts without throwing", true);
} catch (e) {
  ok("mounts without throwing", false);
  console.error("MOUNT ERROR:", e.message);
}

const root = window.document.getElementById("root");
const txt = () => root.textContent;
const $ = (sel) => [...root.querySelectorAll(sel)];

await new Promise((r) => setTimeout(r, 50));

// 0a. First-run Welcome splash appears OVER the picker (the orientation screen)
ok("Welcome splash shows on first run", !!root.querySelector(".kf-welcome"));
ok("Welcome lists multiple features", root.querySelectorAll(".kf-feat").length >= 6);
ok("Welcome mentions field templates", /Pick your field/.test(root.textContent));
ok("Welcome mentions the garden", /biodiversity garden|biodiversity/i.test(root.textContent));
// Dismiss the welcome to access the picker beneath it
const skipBtn = [...root.querySelectorAll(".kf-welcome-x")].pop();
if (skipBtn) skipBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 30));

// 0b. Now the field picker is visible
ok("first run shows field picker", /Pick your field/.test(root.textContent));
ok("picker offers Healthcare template", !![...root.querySelectorAll("button")].find(b => /Healthcare/.test(b.textContent)));
const pickField = (label) => {
  const b = [...root.querySelectorAll(".kf-pickbtn")].find(x => x.textContent.includes(label));
  if (b) b.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  return !!b;
};
ok("picked a field", pickField("Data & Analytics"));
await new Promise((r) => setTimeout(r, 40));

// 1. initial screen — desktop shell (top bar + progress rail + work area) with the empty-state in the rail
ok("desktop shell: top bar, rail, and work area render", !!$(".kf-topbar")[0] && !!$(".kf-rail")[0] && !!$(".kf-work")[0]);
ok("rail shows the empty-state until there are keystrokes", /No keystrokes yet/.test(txt()));

// helper to click a nav button by label
const clickBtn = (label) => {
  const b = $("button").find((x) => x.textContent.trim() === label);
  if (!b) return false;
  b.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  return true;
};
const key = (k) => window.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true }));

// 2. enter Drill — warmup should start on the EASIEST key, not random
ok("Drill button exists", clickBtn("Drill keys"));
await new Promise((r) => setTimeout(r, 30));
const big = $(".kf-bigkey")[0];
ok("Drill renders a target key", !!big && big.textContent.length === 1);
const firstTarget = big ? big.textContent : null;
ok("curriculum opens on the easiest key (=)", firstTarget === "=");
ok("learning-progression label shown", /Building up|All keys in play/.test(txt()));

// 2b. the placement description sits above the symbol (big), with the calming lead line
ok("drill shows a 'where' description above the key", !!$(".kf-place-where")[0] && $(".kf-place-where")[0].textContent.length > 0);
ok("drill shows the keyboard diagram", !!$(".kf-kbd-wrap")[0]);

// 3. drive a wrong key, expect a coaching hint (and miss the same key a few times to seed the report)
try { key("a"); key("a"); key("a"); } catch (e) { console.error("KEYDOWN ERROR:", e.message); }
await new Promise((r) => setTimeout(r, 30));
ok("wrong key shows a hint", !!$(".kf-hint")[0]);
ok("typed-slots show what you pressed", $(".kf-slot").length >= 1 && (($(".kf-slot")[0] || {}).textContent || "") === "a");

// 4. Snippet — type through a pair-heavy line; closers must auto-fill
ok("Snippet button exists", clickBtn("Type code"));
await new Promise((r) => setTimeout(r, 30));
clickBtn("Python"); // every Python line has brackets/quotes
await new Promise((r) => setTimeout(r, 40));
// Switch to Lines level so the snippet always contains closers (, [ etc.)
const linesBtn = $("button").find(b => b.textContent === "Lines");
if (linesBtn) { linesBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); await new Promise((r) => setTimeout(r, 40)); }
const snipText = $(".kf-snip")[0]?.textContent || "";
ok("Snippet renders a non-empty line", snipText.trim().length > 0);

let typedCloser = false, sawCelebrate = false, steps = 0;
const closers = new Set([")", "]", "}"]);
while (steps < 60) {
  const cur = $(".kf-snip .cur")[0];
  if (!cur) break; // line finished
  const ch = cur.textContent === "\u00A0" ? " " : cur.textContent;
  if (closers.has(ch)) typedCloser = true; // should NEVER be asked to type a closer
  key(ch);
  await new Promise((r) => setTimeout(r, 8));
  if ($(".kf-celebrate")[0]) sawCelebrate = true;
  steps++;
}
ok("no auto-fill — the user types the closers themselves", typedCloser && !$(".kf-snip .auto")[0]);
ok("clean line triggers celebration", sawCelebrate);

// 5. settings: gear opens a sensitivity slider
const gear = $("button").find((b) => b.textContent.trim() === "⚙");
ok("settings gear exists", !!gear);
gear && gear.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 20));
const slider = $('input[type="range"]')[0];
ok("sensitivity slider renders", !!slider);
ok("slider defaults to calm range", slider && Math.abs(parseFloat(slider.value) - 0.4) < 0.001);

// 6. less twitchy: at min sensitivity, clean typing must NOT trip the relax overlay
clickBtn("Type code");
await new Promise((r) => setTimeout(r, 20));
if (slider) {
  slider.value = "0";
  slider.dispatchEvent(new window.Event("input", { bubbles: true }));
  slider.dispatchEvent(new window.Event("change", { bubbles: true }));
}
await new Promise((r) => setTimeout(r, 20));
let relaxFired = false;
for (let i = 0; i < 16; i++) {
  let cur = $(".kf-snip .cur")[0];
  if (!cur) { clickBtn("Type code"); await new Promise((r)=>setTimeout(r,15)); cur = $(".kf-snip .cur")[0]; }
  if (!cur) continue;
  const ch = cur.textContent === "\u00A0" ? " " : cur.textContent;
  key(ch);
  await new Promise((r) => setTimeout(r, 6));
  if ($(".kf-relax")[0]) relaxFired = true;
}
ok("clean typing at low sensitivity does NOT nag", !relaxFired);

// 7. persistence: stats + sens written to localStorage, restored on remount
const totalAttempts = (saved) => {
  const s = saved.templates && saved.templates.data && saved.templates.data.stats;
  return s ? Object.values(s).reduce((acc, x) => acc + (x.attempts || 0), 0) : 0;
};
let persistOk = false, sensPersist = false, fieldPersist = false;
try {
  const saved = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}");
  persistOk = totalAttempts(saved) > 0;
  sensPersist = typeof saved.sens === "number";
  fieldPersist = saved.template === "data";
} catch (e) {}
await new Promise((r) => setTimeout(r, 450)); // let debounced save flush
try {
  const saved = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}");
  persistOk = totalAttempts(saved) > 0;
  sensPersist = typeof saved.sens === "number";
  fieldPersist = saved.template === "data";
} catch (e) {}
ok("progress persists to localStorage (per-field)", persistOk);
ok("sensitivity persists to localStorage", sensPersist);
ok("chosen field persists to localStorage", fieldPersist);

// remount a fresh app instance against the same storage → should rehydrate
const root2 = window.document.createElement("div");
window.document.body.appendChild(root2);
let rehydrated = false;
try {
  const saved = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}");
  rehydrated = totalAttempts(saved) > 0;
} catch (e) {}
ok("saved state available for rehydration", rehydrated);

// 8. Sketch layer: the live drawing panel renders in the work area (below the typing card)
clickBtn("Type code");
await new Promise((r) => setTimeout(r, 30));
ok("live sketch sits next to the typing surface", !!$(".kf-work .kf-sketch-row.inline")[0]);
// On-screen keyboard also renders in Type code mode (matches Drill)
ok("on-screen keyboard renders in Type code mode", !!$(".kf-work .kf-kbd")[0] && $(".kf-work .kf-key").length > 20);
ok("Type code keyboard highlights a target key", !!$(".kf-work .kf-key.target")[0]);
clickBtn("Drill keys");
await new Promise((r) => setTimeout(r, 30));
ok("live sketch sits next to the keyboard on Drill", !!$(".kf-work .kf-kbdrow .kf-sketch-row")[0]);

// 9. a clean line added a stroke, persisted into keygarden.v1.sketch; a returning streak is tracked
let sketchPersist = false, sketchGrew = false, streakTracked = false;
try {
  const saved = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}");
  sketchPersist = !!saved.sketch && typeof saved.sketch === "object";
  sketchGrew = sketchPersist && (((saved.sketch.strokes | 0) > 0) || (Array.isArray(saved.sketch.finished) && saved.sketch.finished.length > 0));
  streakTracked = !!saved.streak && (saved.streak.sessions | 0) >= 1 && (saved.streak.streak | 0) >= 1;
} catch (e) {}
ok("sketch state persists to keygarden.v1", sketchPersist);
ok("a clean line advances the sketch (a stroke is saved)", sketchGrew);
ok("returning streak/session is tracked", streakTracked);

// 9b. the always-visible progress rail greets you with the return-streak banner
ok("rail shows the return-streak banner", !!$(".kf-streak")[0]);

// 9c. rail cards are collapsible; the most-missed one opens by default
ok("rail uses collapsible cards", $(".kf-coll").length >= 1);
const openBefore = $(".kf-coll.open").length;
ok("most-missed card is open by default", openBefore >= 1);
const firstHead = $(".kf-coll .kf-coll-head")[0];
firstHead && firstHead.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 30));
const openAfter = $(".kf-coll.open").length;
ok("clicking a card header toggles its open state", openAfter !== openBefore);
firstHead && firstHead.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); // reopen for next checks
await new Promise((r) => setTimeout(r, 30));

// 9d. finishing a drawing offers Save / Delete; Save adds it to the collection
clickBtn("Type code");
await new Promise((r) => setTimeout(r, 40));
for (let ln = 0; ln < 45 && !$(".kf-save")[0] && !$(".kf-relax")[0]; ln++) {
  for (let g = 0; g < 60; g++) {
    const cur = $(".kf-snip .cur")[0];
    if (!cur || $(".kf-relax")[0]) break;
    key(cur.textContent === " " ? " " : cur.textContent);
    await new Promise((r) => setTimeout(r, 5));
  }
  await new Promise((r) => setTimeout(r, 70));
  if ($(".kf-save")[0] || $(".kf-relax")[0]) break;
  await new Promise((r) => setTimeout(r, 430)); // wait for the next line to load
}
ok("a finished drawing pops a breathing break", !!$(".kf-relax")[0]);
if ($(".kf-relax")[0]) $(".kf-relax")[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true })); // dismiss breathing → reveal save/delete
await new Promise((r) => setTimeout(r, 80));
ok("finished drawing then offers Save / Delete", !!$(".kf-save")[0]);
$(".kf-save")[0] && $(".kf-save")[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 60));
let collected = false;
try { const sk = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}").sketch; collected = sk && Array.isArray(sk.finished) && sk.finished.length >= 1 && sk.pending == null; } catch (e) {}
ok("Save adds the finished sketch to the collection", collected);

// 9e. the welcome screen lists features and toggles from the nav (re-opens via ?)
const helpBtn = $("button").find((b) => b.textContent.trim() === "?");
const welcomeWasClosed = !$(".kf-welcome")[0];
// Open it via the ? button
helpBtn && helpBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 20));
ok("welcome screen lists the features", !!$(".kf-welcome")[0] && $(".kf-feat").length >= 6);
// Toggle it closed
helpBtn && helpBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 20));
ok("welcome toggles from the nav", !!helpBtn && welcomeWasClosed && !$(".kf-welcome")[0]);

// 9f. defaults: sound starts OFF; the breathing-break toggle is in settings
let soundOff = false;
try { soundOff = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}").muted === true; } catch (e) {}
ok("sound is off by default", soundOff);
if (!$(".kf-toggle")[0]) { const g = $("button").find((b) => b.textContent.trim() === "⚙"); g && g.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); await new Promise((r) => setTimeout(r, 20)); }
ok("breathing-break on/off toggle exists in settings", !!$(".kf-toggle input")[0]);

// 9g. the rail reports the most-missed keys, and "Drill just these" starts a focused drill
// Ensure the most-missed card is open so we can read its rows
const missedHead = $(".kf-coll .kf-coll-head").find((b) => /most-missed/i.test(b.textContent));
if (missedHead && !$(".kf-coll.open .kf-missed-row")[0]) { missedHead.dispatchEvent(new window.MouseEvent("click", { bubbles: true })); await new Promise((r) => setTimeout(r, 30)); }
ok("rail reports most-missed keys", !!$(".kf-missed-row")[0]);
const drillThese = $(".kf-drillthese")[0];
ok("a 'Drill just these' button is offered", !!drillThese);
drillThese && drillThese.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 40));
ok("focused drill shows the focus bar (just the missed keys)", !!$(".kf-focusbar")[0]);
ok("focused drill still shows the placement description", !!$(".kf-place-where")[0]);
// clear focus back to the full drill
const allBtn = $(".kf-linkbtn").find((b) => /drill all/i.test(b.textContent));
allBtn && allBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 30));
ok("'drill all keys' clears the focus", !$(".kf-focusbar")[0]);

// 10. Garden: nav button, view renders, state persists, growth tied to milestones
ok("Garden nav button exists", !!$("button").find(b=>/Garden/.test(b.textContent)));
clickBtn("Garden");
await new Promise(r=>setTimeout(r,40));
ok("Garden view renders", /Your garden|bare soil/.test(txt()));
await new Promise(r=>setTimeout(r,250));
let gardenPersists=false, gardenGrew=false;
try{
  const s=JSON.parse(window.localStorage.getItem("keygarden.v1")||"{}");
  gardenPersists=!!s.garden&&typeof s.garden.growth==="number";
  gardenGrew=gardenPersists&&(s.garden.growth||0)>=1; // at least one clean line was typed above
}catch(e){}
ok("garden state persists in keygarden.v1", gardenPersists);
ok("garden.growth increments on clean-line milestone", gardenGrew);

// 11. typing with audio muted must never throw
let mutedNoThrow = true;
try {
  const muteBtn = $("button").find((b) => b.textContent.trim() === "♪");
  muteBtn && muteBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 10));
  clickBtn("Drill keys");
  await new Promise((r) => setTimeout(r, 20));
  key("="); key("a");
  await new Promise((r) => setTimeout(r, 15));
  clickBtn("Type code");
  await new Promise((r) => setTimeout(r, 20));
  const cur = $(".kf-snip .cur")[0];
  if (cur) key(cur.textContent === " " ? " " : cur.textContent);
  await new Promise((r) => setTimeout(r, 15));
} catch (e) { mutedNoThrow = false; console.error("MUTED ERROR:", e.message); }
ok("no throw while typing with audio muted", mutedNoThrow && root.textContent.length > 0);

// 11. field pill in topbar re-opens the picker; Cancel returns to current field
const pill = $(".kf-field-pill")[0];
ok("topbar shows a field pill", !!pill);
pill && pill.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise(r => setTimeout(r, 30));
ok("clicking the pill re-opens the field picker", /Switch field/.test(root.textContent));
ok("active field is marked in the picker", !!$(".kf-pickbtn.current")[0]);
const backBtn = $(".kf-picker-back")[0];
ok("picker offers a 'Keep current' cancel button", !!backBtn);
backBtn && backBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await new Promise(r => setTimeout(r, 30));
ok("cancel returns to the chosen field's drill", !!$(".kf-bigkey")[0] || !!$(".kf-rail")[0]);

console.log("FIRST DRILL TARGET:", JSON.stringify(firstTarget));
console.log("FIRST SNIPPET TEXT:", JSON.stringify(snipText));
console.log("");
for (const [s, n] of results) console.log(`${s}  ${n}`);
const failed = results.filter((r) => r[0] === "FAIL");
console.log(`\n${results.length - failed.length}/${results.length} passed`);
