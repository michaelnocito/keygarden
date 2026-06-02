import fs from "fs";
import { JSDOM, VirtualConsole } from "jsdom";

const html = fs.readFileSync("../keyform-offline.html", "utf8");

const vc = new VirtualConsole();
vc.on("jsdomError", (e) => console.error("JSDOM ERROR:", e.message));

const node = () => ({ connect: (d) => d || node(), start() {}, stop() {},
  gain: { value: 0, linearRampToValueAtTime() {}, setValueAtTime() {} },
  frequency: { value: 0 }, type: "" });

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
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
  },
});

const { window } = dom;
const root = window.document.getElementById("root");
const $ = (s) => [...root.querySelectorAll(s)];
const results = [];
const ok = (n, c) => results.push([c ? "PASS" : "FAIL", n]);

await new Promise((r) => setTimeout(r, 80));

ok("React present (offline, no CDN)", typeof window.React === "object" && typeof window.ReactDOM === "object");
ok("app mounted into #root", root.textContent.length > 0);
ok("opens on Progress empty-state", /No keystrokes yet/.test(root.textContent));

const clickBtn = (label) => {
  const b = $("button").find((x) => x.textContent.trim() === label);
  if (b) b.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  return !!b;
};
const key = (k) => window.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true }));

ok("enter Drill", clickBtn("Drill keys"));
await new Promise((r) => setTimeout(r, 30));
const big = $(".kf-bigkey")[0];
ok("drill target renders", !!big && big.textContent.length === 1);

key("a"); // likely wrong
await new Promise((r) => setTimeout(r, 30));
ok("miss produces coaching hint", !!$(".kf-hint")[0]);
if ($(".kf-hint")[0]) console.log("HINT SAMPLE:", JSON.stringify($(".kf-hint")[0].textContent));

ok("enter Snippet", clickBtn("Type snippets"));
await new Promise((r) => setTimeout(r, 30));
ok("snippet line renders", ($(".kf-snip")[0]?.textContent || "").trim().length > 0);

console.log("");
for (const [s, n] of results) console.log(`${s}  ${n}`);
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
