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
  url: "https://keyform.local/",
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

// helpers
const clickBtn = (label) => {
  const b = $("button").find((x) => x.textContent.trim() === label);
  if (!b) return false;
  b.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  return true;
};
const key = (k) => window.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true }));

// 0. first run shows the field picker; choose Data & Analytics to mirror prior behavior
ok("first run shows field picker", /Pick your field/.test(txt()));
ok("picker offers Healthcare template", !!$("button").find((b) => /Healthcare/.test(b.textContent)));
const pickField = (label) => {
  const b = $("button").find((x) => x.textContent.includes(label));
  if (b) b.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  return !!b;
};
ok("picked a field", pickField("Data & Analytics"));
await new Promise((r) => setTimeout(r, 40));

// 1. now on Progress empty-state for that field
ok("opens on Progress empty-state", /No keystrokes yet/.test(txt()));

// 2. enter Drill — warmup should start on the EASIEST key, not random
ok("Drill button exists", clickBtn("Drill keys"));
await new Promise((r) => setTimeout(r, 30));
const big = $(".kf-bigkey")[0];
ok("Drill renders a target key", !!big && big.textContent.length === 1);
const firstTarget = big ? big.textContent : null;
ok("warmup opens on easiest key (=)", firstTarget === "=");
ok("warmup label shown", /Warm-up/.test(txt()));

// 3. drive a wrong key, expect a coaching hint
try { key("a"); } catch (e) { console.error("KEYDOWN ERROR:", e.message); }
await new Promise((r) => setTimeout(r, 30));
ok("wrong key shows a hint", !!$(".kf-hint")[0]);

// 4. Snippet — type through a pair-heavy line; closers must auto-fill
ok("Snippet button exists", clickBtn("Type snippets"));
await new Promise((r) => setTimeout(r, 30));
clickBtn("Python"); // every Python line has brackets/quotes
await new Promise((r) => setTimeout(r, 40));
const snipText = $(".kf-snip")[0]?.textContent || "";
ok("Snippet renders a non-empty line", snipText.trim().length > 0);

let sawAuto = false, typedCloser = false, sawCelebrate = false, steps = 0;
const closers = new Set([")", "]", "}"]);
while (steps < 60) {
  const cur = $(".kf-snip .cur")[0];
  if (!cur) break; // line finished
  const ch = cur.textContent === "\u00A0" ? " " : cur.textContent;
  if (closers.has(ch)) typedCloser = true; // should NEVER be asked to type a closer
  key(ch);
  await new Promise((r) => setTimeout(r, 8));
  if ($(".kf-snip .auto")[0]) sawAuto = true;
  if ($(".kf-celebrate")[0]) sawCelebrate = true;
  steps++;
}
ok("closers auto-fill (marked .auto)", sawAuto);
ok("user never asked to type a closer", !typedCloser);
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
clickBtn("Type snippets");
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
  if (!cur) { clickBtn("Type snippets"); await new Promise((r)=>setTimeout(r,15)); cur = $(".kf-snip .cur")[0]; }
  if (!cur) continue;
  const ch = cur.textContent === "\u00A0" ? " " : cur.textContent;
  key(ch);
  await new Promise((r) => setTimeout(r, 6));
  if ($(".kf-relax")[0]) relaxFired = true;
}
ok("clean typing at low sensitivity does NOT nag", !relaxFired);

// 7. persistence: stats (per template) + sens + chosen field
const tplTotal = (saved) => {
  const t = saved.templates && saved.templates.data && saved.templates.data.stats;
  return t ? Object.values(t).reduce((s, x) => s + (x.attempts || 0), 0) : 0;
};
await new Promise((r) => setTimeout(r, 450)); // let debounced save flush
let persistOk = false, sensPersist = false, fieldPersist = false;
try {
  const saved = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}");
  persistOk = tplTotal(saved) > 0;
  sensPersist = typeof saved.sens === "number";
  fieldPersist = saved.template === "data";
} catch (e) {}
ok("progress persists per-field to localStorage", persistOk);
ok("sensitivity persists to localStorage", sensPersist);
ok("chosen field persists to localStorage", fieldPersist);

let rehydrated = false;
try {
  const saved = JSON.parse(window.localStorage.getItem("keygarden.v1") || "{}");
  rehydrated = tplTotal(saved) > 0;
} catch (e) {}
ok("saved state available for rehydration", rehydrated);

// Garden: nav button, view, state persists, growth tied to milestones
ok("Garden nav button exists", !!$("button").find(b=>/Garden/.test(b.textContent)));
clickBtn("Garden");
await new Promise(r=>setTimeout(r,40));
ok("Garden view renders", /Your garden|bare soil/.test(txt()));
await new Promise(r=>setTimeout(r,250));
let gardenPersists=false, gardenGrew=false;
try{
  const s=JSON.parse(window.localStorage.getItem("keygarden.v1")||"{}");
  gardenPersists=!!s.garden&&typeof s.garden.growth==="number";
  gardenGrew=gardenPersists&&(s.garden.growth||0)>=1;
}catch(e){}
ok("garden state persists in keygarden.v1", gardenPersists);
ok("garden.growth increments on clean-line milestone", gardenGrew);

console.log("FIRST DRILL TARGET:", JSON.stringify(firstTarget));
console.log("FIRST SNIPPET TEXT:", JSON.stringify(snipText));
console.log("");
for (const [s, n] of results) console.log(`${s}  ${n}`);
const failed = results.filter((r) => r[0] === "FAIL");
console.log(`\n${results.length - failed.length}/${results.length} passed`);
