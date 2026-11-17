/*
  Builds a printable PDF edition of a guide from its Field Kit content.
  Usage: node tools/make-guide-pdf.js [guide-slug] [letter|a4]
  Output: pdf-guides/ (kept out of git and off the website).
*/
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { lightingSvg } from "../field-kit/diagrams.js";
import { solve, formatAperture, formatShutter } from "../js/exposure.js";
import { aperture } from "./site-svg.js";
import { startServer } from "./serve.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2] || "product-photography-guide";
const paper = (process.argv[3] || "letter").toLowerCase() === "a4" ? "A4" : "Letter";
const load = (rel) => { const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), ctx); return ctx.window; };
const { NOVARIS_SITE: SITE } = load("js/site-config.js");
const guide = (await import(pathToFileURL(path.join(ROOT, "field-kit/guides", slug + ".js")).href)).default;
if (slug !== "product-photography-guide") throw new Error("This layout is written for the Product Photography Guide.");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const box = '<span class="box" aria-hidden="true"></span>';

/* Diagram key: the symbols used on every lighting page, each drawn with the same renderer. */
const KEY = [
  ["softbox", "Softbox", 0], ["flash", "Flash or light", 0], ["diffusion", "Diffusion panel", 0],
  ["card", "White bounce card", 0], ["flag", "Black card or flag", 0], ["product", "Product", 0],
  ["camera", "Camera", 0], ["backdrop", "Background sweep", 1], ["table", "Surface", 1]
];
const keySymbol = ([type, label, wide]) => {
  const svg = lightingSvg({ title: label, elements: [{ id: "k", type, x: 180, y: 150, rot: 0, label: "" }], beams: [] }, { palette: "print", interactive: false })
    .replace('viewBox="0 0 360 300"', wide ? 'viewBox="90 105 180 90"' : 'viewBox="145 120 70 60"');
  return `<div class="key-item"><div class="key-art">${svg}</div><span>${label}</span></div>`;
};
const arrow = (color, dash, label) => `<div class="key-item"><div class="key-art"><svg viewBox="0 0 70 60"><line x1="8" y1="30" x2="54" y2="30" stroke="${color}" stroke-width="2.4" stroke-dasharray="${dash}" stroke-linecap="round"/><path d="M52 24 L64 30 L52 36 Z" fill="${color}"/></svg></div><span>${label}</span></div>`;
const legend = `<div class="key-grid">${KEY.map(keySymbol).join("")}${arrow("#c77d16", "7 5", "Direct light")}${arrow("#6b645a", "2 5", "Bounced light")}</div>`;

const setupPages = guide.lighting.map((s, i) => `
<section class="page setup">
  <p class="kicker">Lighting setup ${i + 1} of ${guide.lighting.length}</p>
  <h2>${esc(s.title)}</h2>
  <p class="lede">${esc(s.summary)}</p>
  <div class="diagram">${lightingSvg(s, { palette: "print", interactive: false })}</div>
  <table class="parts">
    <thead><tr><th>Part</th><th>Role</th><th>Setup notes</th></tr></thead>
    <tbody>${s.elements.map((e) => `<tr><th>${esc(e.label)}</th><td class="role">${esc(e.role)}</td><td>${esc(e.notes)}</td></tr>`).join("")}</tbody>
  </table>
  ${s.tips && s.tips.length ? `<div class="tips"><h3>Tips</h3><ul>${s.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
</section>`).join("");

const checklistPage = (list, withFields) => `
<section class="page checklist">
  <p class="kicker">Shot list</p>
  <h2>${esc(list.title)}</h2>
  <p class="lede">${esc(list.description)}</p>
  ${withFields ? `<div class="fields"><div><span>Product</span></div><div><span>SKU / reference</span></div><div><span>Date</span></div><div><span>Background</span></div></div>` : ""}
  ${list.sections.map((sec) => `
    <h3>${esc(sec.title)}</h3>
    <ul class="checks">${sec.items.map((it) => `<li>${box}<div><strong>${esc(it.text)}</strong>${it.note ? `<span class="note">${esc(it.note)}</span>` : ""}</div></li>`).join("")}</ul>`).join("")}
  <h3>Added on the day</h3>
  <ul class="checks blank">${Array.from({ length: 4 }, () => `<li>${box}<div class="line"></div></li>`).join("")}</ul>
</section>`;

const ref = guide.references;
const refPage = `
<section class="page">
  <p class="kicker">Reference</p>
  <h2>${esc(ref.title)}</h2>
  <p class="lede">How common tabletop backgrounds and surfaces look and behave under light.</p>
  <div class="cards">${ref.items.map((r) => `<article class="card"><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></article>`).join("")}</div>
</section>`;

const st = guide.settings;
const settingsPage = `
<section class="page">
  <p class="kicker">Settings reference</p>
  <h2>${esc(st.tables[0].title)}</h2>
  <p class="lede">Starting points for common tabletop situations. Adjust for your lights, distance, and lens.</p>
  <table class="settings">
    <thead><tr><th>Situation</th><th>Aperture</th><th>Shutter</th><th>ISO</th><th>Notes</th></tr></thead>
    <tbody>${st.tables[0].rows.map((r) => `<tr><th>${esc(r.situation)}</th><td>${esc(r.aperture)}</td><td>${esc(r.shutter)}</td><td>${esc(r.iso)}</td><td>${esc(r.notes)}</td></tr>`).join("")}</tbody>
  </table>
  <div class="tips"><h3>Rules of thumb</h3><ul>${st.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
  <h3 class="mt">My adjustments</h3>
  <div class="lines">${Array.from({ length: 6 }, () => '<div class="line"></div>').join("")}</div>
</section>`;

/* Equivalent exposures, computed with the same math as the Field Kit calculator. */
const base = { aperture: 8, shutter: 1 / 125, iso: 100 };
const fullStops = [2.8, 4, 5.6, 8, 11, 16, 22];
const apRows = fullStops.map((a) => [formatAperture(a), solve(base, { aperture: a, iso: 100 }, "shutter").nearestLabel, solve(base, { aperture: a, iso: 400 }, "shutter").nearestLabel]);
const isoRows = [100, 200, 400, 800, 1600].map((iso) => [`ISO ${iso}`, solve(base, { aperture: 8, iso }, "shutter").nearestLabel, solve(base, { aperture: 11, iso }, "shutter").nearestLabel]);
const exposurePage = `
<section class="page">
  <p class="kicker">Exposure reference</p>
  <h2>Equivalent exposures</h2>
  <p class="lede">Each full stop of aperture, shutter speed, or ISO doubles or halves the light. Change one setting by a stop and move another by a stop the other way to keep the same exposure. These tables start from a metered exposure of f/8, 1/125, ISO 100, a common tabletop flash setting.</p>
  <div class="two">
    <div>
      <h3>Change the aperture</h3>
      <table class="mini"><thead><tr><th>Aperture</th><th>Shutter at ISO 100</th><th>Shutter at ISO 400</th></tr></thead>
      <tbody>${apRows.map((r) => `<tr>${r.map((c, k) => (k ? `<td>${c}</td>` : `<th>${c}</th>`)).join("")}</tr>`).join("")}</tbody></table>
    </div>
    <div>
      <h3>Change the ISO</h3>
      <table class="mini"><thead><tr><th>ISO</th><th>Shutter at f/8</th><th>Shutter at f/11</th></tr></thead>
      <tbody>${isoRows.map((r) => `<tr>${r.map((c, k) => (k ? `<td>${c}</td>` : `<th>${c}</th>`)).join("")}</tr>`).join("")}</tbody></table>
    </div>
  </div>
  <div class="tips">
    <h3>With flash</h3>
    <ul>
      <li>When flash is the main light, the flash sets the exposure of the product. The shutter speed mainly controls how much room light is recorded; keep it at or below your flash sync speed.</li>
      <li>To change depth of field with flash, change the aperture and adjust flash power by the same number of stops (one stop of aperture is a doubling or halving of power).</li>
      <li>With continuous light, use the tables directly and a tripod for slower shutter speeds.</li>
    </ul>
  </div>
  <p class="small">Shutter speeds are rounded to the nearest standard setting. Full-stop sequences: f/2.8, 4, 5.6, 8, 11, 16, 22 · 1/500, 1/250, 1/125, 1/60, 1/30, 1/15 · ISO 100, 200, 400, 800, 1600.</p>
</section>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Product Photography Guide - Novaris Photo Guides</title>
<link rel="stylesheet" href="/fonts/fonts.css">
<style>
  @page { size: ${paper}; margin: 16mm 15mm 18mm; }
  @page :first { margin: 0; }
  :root { --ink: #1f1d1a; --muted: #5b554d; --line: #d9cfbe; --soft: #f4efe6; --amber: #e09a2c; --amber-ink: #8f4a06; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font: 10.2pt/1.5 Inter, system-ui, sans-serif; color: var(--ink); }
  h1, h2, h3 { font-family: Fraunces, Georgia, serif; font-weight: 500; line-height: 1.15; margin: 0 0 6pt; }
  h2 { font-size: 22pt; } h3 { font-size: 12.5pt; margin-top: 12pt; }
  p { margin: 0 0 8pt; }
  .page { break-after: page; }
  .page:last-child { break-after: auto; }
  .kicker { font-size: 7.5pt; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--amber-ink); margin-bottom: 4pt; }
  .lede { color: var(--muted); font-size: 10.8pt; max-width: 46em; }
  .small { font-size: 8.5pt; color: var(--muted); }
  .mt { margin-top: 16pt; }

  /* Cover */
  .cover { height: ${paper === "A4" ? "297mm" : "279.4mm"}; background: #1f1d1a; color: #f4efe6; padding: 26mm 22mm; display: flex; flex-direction: column; position: relative; overflow: hidden; break-after: page; }
  .cover::after { content: ""; position: absolute; width: 170mm; height: 170mm; right: -50mm; top: -40mm; background: radial-gradient(closest-side, rgba(224,154,44,.28), rgba(224,154,44,0)); }
  .cover .brand { font-size: 8.5pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #f2a948; }
  .cover h1 { font-size: 44pt; margin: 16mm 0 6mm; max-width: 11em; letter-spacing: -.01em; }
  .cover .sub { font-size: 13pt; color: #d6cdbd; max-width: 30em; }
  .cover .ap { width: 92mm; height: 92mm; margin: auto 0 0 auto; position: relative; z-index: 1; }
  .cover .ap svg { width: 100%; height: 100%; }
  .cover .ap .ap-ring { color: #f4efe6; }
  .cover .foot { font-size: 9pt; color: #b0a796; border-top: 1px solid #3a342d; padding-top: 6mm; margin-top: 8mm; position: relative; z-index: 1; }

  /* Contents */
  .toc { list-style: none; padding: 0; margin: 10pt 0 0; border-top: 1px solid var(--line); }
  .toc li { display: flex; justify-content: space-between; gap: 12pt; padding: 3pt 0; font-size: 9.6pt; border-bottom: 1px solid var(--line); }
  .toc span:last-child { color: var(--muted); }
  .intro { columns: 2; column-gap: 9mm; margin-top: 10pt; }
  .intro h3 { break-after: avoid; margin-top: 0; }
  .intro div { break-inside: avoid; margin-bottom: 6pt; }
  .intro p { font-size: 9.2pt; margin-bottom: 4pt; }
  .intro h3 { font-size: 11pt; margin-bottom: 3pt; }
  .legend { margin-top: 12pt; border: 1px solid var(--line); border-radius: 6pt; overflow: hidden; }
  .key-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6pt 4pt; padding: 10pt; background: #fbf8f2; }
  .key-item { text-align: center; font-size: 8pt; color: var(--muted); }
  .key-art { height: 15mm; display: flex; align-items: center; justify-content: center; }
  .key-art svg { height: 100%; width: auto; max-width: 100%; display: block; }

  /* Lighting pages */
  .diagram svg { display: block; width: 100%; max-height: 98mm; border: 1px solid var(--line); border-radius: 6pt; }
  .diagram { margin: 6pt 0 10pt; }
  table { border-collapse: collapse; width: 100%; }
  .parts th, .parts td { text-align: left; vertical-align: top; padding: 4pt 6pt; border-bottom: 1px solid var(--line); font-size: 8.5pt; line-height: 1.38; }
  .parts thead th, .settings thead th, .mini thead th { font-size: 7pt; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .parts tbody th { width: 21%; font-weight: 600; }
  .parts .role { width: 25%; color: var(--amber-ink); font-weight: 600; }
  .tips { background: var(--soft); border-left: 3pt solid var(--amber); padding: 8pt 12pt; margin-top: 10pt; break-inside: avoid; }
  .tips h3 { margin-top: 0; font-size: 11pt; }
  .tips ul { margin: 0; padding-left: 14pt; } .tips li { margin-bottom: 3pt; }

  /* Reference cards */
  .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; margin-top: 10pt; }
  .card { border: 1px solid var(--line); border-radius: 6pt; padding: 10pt 12pt; break-inside: avoid; }
  .card h3 { margin-top: 0; }
  .card p { margin: 0; color: #3b3732; }

  /* Checklists */
  .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 14pt; margin: 6pt 0 4pt; }
  .fields div { border-bottom: 1px solid var(--ink); height: 26pt; position: relative; }
  .fields span { position: absolute; top: 0; font-size: 7pt; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .checks { list-style: none; padding: 0; margin: 0; }
  .checks li { display: flex; gap: 10pt; align-items: flex-start; padding: 6pt 0; border-bottom: 1px solid var(--line); break-inside: avoid; }
  .box { flex: none; width: 12pt; height: 12pt; border: 1.3pt solid var(--ink); border-radius: 2pt; margin-top: 1pt; }
  .checks strong { font-weight: 500; }
  .note { display: block; font-size: 8.5pt; color: var(--muted); }
  .checks.blank .line, .lines .line { flex: 1; border-bottom: 1px solid var(--line); height: 14pt; }
  .lines .line { height: 20pt; }

  /* Settings */
  .settings th, .settings td, .mini th, .mini td { text-align: left; padding: 6pt 7pt; border-bottom: 1px solid var(--line); font-size: 9pt; vertical-align: top; }
  .settings tbody tr:nth-child(odd), .mini tbody tr:nth-child(odd) { background: var(--soft); }
  .settings tbody th { font-weight: 600; width: 24%; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; }
  .mini tbody th { font-weight: 600; }

  /* Back page */
  .back h3 { margin-top: 14pt; }
  .back p, .back li { color: #3b3732; }
</style></head><body>

<section class="cover">
  <p class="brand">Novaris Photo Guides</p>
  <h1>Product Photography Guide</h1>
  <p class="sub">Tabletop lighting setups, a background and surface reference, shot lists for standard e-commerce angles, and settings charts.</p>
  <div class="ap">${aperture()}</div>
  <p class="foot">Reference and planning material for photographers · ${paper === "A4" ? "A4" : "US Letter"} edition</p>
</section>

<section class="page">
  <p class="kicker">Contents</p>
  <h2>In this guide</h2>
  <ol class="toc">
    <li><span>How to use this guide and diagram key</span><span>2</span></li>
    ${guide.lighting.map((s, i) => `<li><span>Lighting setup ${i + 1}: ${esc(s.title)}</span><span>${3 + i}</span></li>`).join("")}
    <li><span>${esc(ref.title)}</span><span>${3 + guide.lighting.length}</span></li>
    <li><span>Shot list: ${esc(guide.shotlists[0].title)}</span><span>${4 + guide.lighting.length}</span></li>
    <li><span>Shot list: ${esc(guide.shotlists[1].title)}</span><span>${5 + guide.lighting.length}</span></li>
    <li><span>Settings reference</span><span>${6 + guide.lighting.length}</span></li>
    <li><span>Equivalent exposures</span><span>${7 + guide.lighting.length}</span></li>
    <li><span>Notes, license, and support</span><span>${8 + guide.lighting.length}</span></li>
  </ol>
  <div class="intro">
    <div><h3>Reference, not lessons</h3><p>This guide is a set of reference and planning pages to use beside the shooting table. Print the pages you need for each shoot.</p></div>
    <div><h3>Starting points</h3><p>Lights, modifiers, lenses, and products vary. Treat every setup and setting as a place to begin, then adjust while you look at the results.</p></div>
    <div><h3>Reading the diagrams</h3><p>Every lighting diagram is drawn from above, with the background at the top and the camera at the bottom. Amber dashed arrows show direct light; grey dotted arrows show light bounced from a card or panel.</p></div>
    <div><h3>Brand-neutral</h3><p>Equipment is described by type, such as a softbox, a flash, or a diffusion panel. Any light that does the same job will work.</p></div>
  </div>
  <h3>Diagram key</h3>
  <div class="legend">${legend}</div>
</section>

${setupPages}
${refPage}
${checklistPage(guide.shotlists[0], true)}
${checklistPage(guide.shotlists[1], false)}
${settingsPage}
${exposurePage}

<section class="page back">
  <p class="kicker">About this guide</p>
  <h2>Notes, license, and support</h2>
  <h3>Shoot notes</h3>
  <div class="lines">${Array.from({ length: 8 }, () => '<div class="line"></div>').join("")}</div>
  <h3>Using these pages</h3>
  <p>You may use this guide in your own photography work, including paid client shoots, and print it as often as you need for your own use. Please don't resell, share, or redistribute the file, or upload it to file-sharing or template sites.</p>
  <h3>Responsibilities</h3>
  <p>Settings and setups are starting points, not guaranteed results. You are responsible for using equipment safely, including stands, cables, and lights, and for any permissions or releases your shoot requires.</p>
  <h3>Independence</h3>
  <p>Novaris Photo Guides is independent and not affiliated with or endorsed by any camera, lens, lighting, or software maker.</p>
  <h3>Questions</h3>
  <p>${esc(SITE.supportEmail)} · We reply within two business days.</p>
  <p class="small">© ${new Date().getFullYear()} Novaris Photo Guides. All diagrams and text are original.</p>
</section>
</body></html>`;

const outDir = path.join(ROOT, "pdf-guides");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `Novaris-Product-Photography-Guide-${paper === "A4" ? "A4" : "Letter"}.pdf`);
const server = await startServer(8673);
const browser = await chromium.launch();
const page = await browser.newPage();
const tmp = path.join(outDir, "_layout.html");
fs.writeFileSync(tmp, html);
await page.goto("http://localhost:8673/pdf-guides/_layout.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: out,
  format: paper,
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%;font:7.5pt Helvetica,Arial,sans-serif;color:#7a7368;padding:0 15mm;display:flex;justify-content:space-between"><span>Novaris Photo Guides · Product Photography Guide</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  preferCSSPageSize: true
});
const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
await browser.close();
server.close();
fs.rmSync(tmp);
console.log("fonts loaded:", [...new Set(fonts)].join(", "));
console.log(out);
