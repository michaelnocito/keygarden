import fs from "fs";
import * as Babel from "@babel/standalone";

const html = fs.readFileSync("../index.html", "utf8");
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const app = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/)[1];

const compiled = Babel.transform(app, { presets: ["react"] }).code;
fs.writeFileSync("./_compiled.js", compiled); // for node --check

const react = fs.readFileSync("./node_modules/react/umd/react.production.min.js", "utf8");
const reactDom = fs.readFileSync("./node_modules/react-dom/umd/react-dom.production.min.js", "utf8");

const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>keyform — symbol typing trainer (offline)</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${react}</script>
<script>${reactDom}</script>
<script>${compiled}</script>
</body>
</html>
`;
fs.writeFileSync("../keyform-offline.html", out);
console.log("built keyform-offline.html");
console.log("react umd bytes:", react.length, "| react-dom umd bytes:", reactDom.length);
console.log("compiled app bytes:", compiled.length);
console.log("total file KB:", Math.round(out.length / 1024));
