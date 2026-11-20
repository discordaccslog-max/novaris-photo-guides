/*
  Renders the catalog products (catalog/content/*.js) and their add-ons as PDFs.
  Usage: node tools/make-catalog-pdfs.js [slug-filter]
  Output: pdf-guides/catalog/<NN>-<slug>/ (kept out of git and off the website).
*/
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { lightingSvg, poseSvg } from "../field-kit/diagrams.js";
import { aperture } from "./site-svg.js";
import { startServer } from "./serve.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8675;
const OUT = path.join(ROOT, "pdf-guides", "catalog");
const filter = process.argv[2] || "";
const load = (rel) => { const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), ctx); return ctx.window; };
const { NOVARIS_SITE: SITE } = load("js/site-config.js");
const CATALOG = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog/new-products.json"), "utf8"));

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const box = '<span class="box" aria-hidden="true"></span>';
const fname = (s) => s.replace(/&/g, "and").replace(/[^A-Za-z0-9 -]/g, "").trim().replace(/\s+/g, "-");

/* ---------- Blocks ---------- */

function head(b) {
  return `${b.title ? `<p class="kicker">${esc(b.kicker)}</p><h2>${esc(b.title)}</h2>` : ""}${b.description ? `<p class="lede">${esc(b.description)}</p>` : ""}`;
}

const R = {
  shotlist(b) {
    const fields = b.fields ? `<div class="fields">${b.fields.map((f) => `<div><span>${esc(f)}</span></div>`).join("")}</div>` : "";
    const secs = b.sections.map((s) => `<h3>${esc(s.title)}</h3><ul class="checks">${s.items.map((it) => {
      const [t, n] = Array.isArray(it) ? it : [it];
      return `<li>${box}<div><strong>${esc(t)}</strong>${n ? `<span class="note">${esc(n)}</span>` : ""}</div></li>`;
    }).join("")}</ul>`).join("");
    const blank = b.blank ? `<h3>Added on the day</h3><ul class="checks blank">${Array.from({ length: b.blank }, () => `<li>${box}<div class="line"></div></li>`).join("")}</ul>` : "";
    return head(b) + fields + secs + blank;
  },
  worksheet(b) {
    const items = b.fields.map((f) => {
      const multi = f.startsWith("+");
      const label = multi ? f.slice(1) : f;
      return `<div class="wf${multi ? " multi" : ""}"><span>${esc(label)}</span>${multi ? '<div class="line"></div><div class="line"></div><div class="line"></div>' : '<div class="line"></div>'}</div>`;
    }).join("");
    return head(b) + `<div class="wgrid cols-${b.columns}">${items}</div>`;
  },
  table(b) {
    const w = b.widths ? `<colgroup>${b.widths.map((x) => `<col style="width:${(x * 100).toFixed(1)}%">`).join("")}</colgroup>` : "";
    const body = [...b.rows, ...Array.from({ length: b.blank }, () => b.columns.map(() => ""))]
      .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th>${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join("")}</tr>`).join("");
    return head(b) + `<table class="grid${b.small ? " small" : ""}">${w}<thead><tr>${b.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table>`;
  },
  cards(b) {
    return head(b) + `<div class="cards cols-${b.cols}">${b.items.map((c) => `<article class="card"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></article>`).join("")}</div>`;
  },
  templates(b) {
    return head(b) + b.items.map((t) => `<article class="tpl"><h3>${esc(t.title)}</h3><pre>${esc(t.text)}</pre></article>`).join("");
  },
  settings(b) {
    return head(b) + `<table class="grid settings"><thead><tr><th>Situation</th><th>Aperture</th><th>Shutter</th><th>ISO</th><th>Notes</th></tr></thead><tbody>${b.rows.map((r) => `<tr><th>${esc(r.situation)}</th><td>${esc(r.aperture)}</td><td>${esc(r.shutter)}</td><td>${esc(r.iso)}</td><td>${esc(r.notes)}</td></tr>`).join("")}</tbody></table>`
      + (b.rules && b.rules.length ? `<div class="tips"><h3>Rules of thumb</h3><ul>${b.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>` : "");
  },
  setup(b) {
    return head({ ...b, description: b.summary }) + `<div class="diagram">${lightingSvg(b, { palette: "print", interactive: false })}</div>`
      + `<table class="parts"><thead><tr><th>Part</th><th>Role</th><th>Setup notes</th></tr></thead><tbody>${b.elements.map((e) => `<tr><th>${esc(e.label)}</th><td class="role">${esc(e.role)}</td><td>${esc(e.notes)}</td></tr>`).join("")}</tbody></table>`
      + (b.tips && b.tips.length ? `<div class="tips"><h3>Tips</h3><ul>${b.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` : "");
  },
  questionnaire(b) {
    return `<p class="kicker">${esc(b.kicker)}</p><h2>${esc(b.title)}</h2><p class="lede">${esc(b.intro)}</p>`
      + `<div class="fields"><div><span>Name</span></div><div><span>Date</span></div></div>`
      + `<ol class="qs">${b.questions.map((q) => `<li><strong>${esc(q)}</strong><div class="line"></div><div class="line"></div></li>`).join("")}</ol>`;
  },
  text(b) {
    return head(b) + b.paras.map((p) => `<p>${esc(p)}</p>`).join("") + (b.bullets.length ? `<ol class="steps">${b.bullets.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : "");
  },
  storyboard(b) {
    const frame = () => `<div class="frame"><div class="frame-box"></div><div class="frame-meta"><span>Shot</span><span>Duration</span></div><div class="line"></div><div class="line"></div></div>`;
    return Array.from({ length: b.pages }, (_, p) => `<section class="page">${p === 0 ? head(b) : `<p class="kicker">${esc(b.kicker)}</p><h2>${esc(b.title)} (continued)</h2>`}<div class="frames">${Array.from({ length: b.frames }, frame).join("")}</div></section>`).join("");
  },
  notes(b) {
    return `<p class="kicker">${esc(b.kicker)}</p><h2>${esc(b.title)}</h2><div class="lines">${Array.from({ length: 26 }, () => '<div class="line"></div>').join("")}</div>`;
  },
  calendar(b) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = (m) => `<h3>${m}</h3><table class="grid cal"><thead><tr><th>Date</th><th>Client</th><th>Session</th><th>Location</th><th>Notes</th></tr></thead><tbody>${Array.from({ length: 8 }, () => "<tr><th></th><td></td><td></td><td></td><td></td></tr>").join("")}</tbody></table>`;
    const pages = [];
    for (let i = 0; i < 12; i += 2) pages.push(`<section class="page">${i === 0 ? head(b) : `<p class="kicker">${esc(b.kicker)}</p><h2>${esc(b.title)}</h2>`}${month(months[i])}${month(months[i + 1])}</section>`);
    return pages.join("");
  },
  poses(b) {
    const pages = [];
    for (let i = 0; i < b.items.length; i += 2) {
      const pair = b.items.slice(i, i + 2);
      pages.push(`<section class="page">${i === 0 ? head(b) : `<p class="kicker">${esc(b.kicker)}</p>`}${pair.map((p) => `<div class="pose"><div class="pose-art">${poseSvg(p, { palette: "print" })}</div><div><h3>${esc(p.title)}</h3><ul>${p.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div></div>`).join("")}</section>`);
    }
    return pages.join("");
  }
};

const MULTI_PAGE = new Set(["storyboard", "calendar", "poses"]);
const renderBlock = (b) => (MULTI_PAGE.has(b.type) ? R[b.type](b) : `<section class="page">${R[b.type](b)}</section>`);

/* Diagram key, shown in guides that contain lighting diagrams. */
function diagramKey(types) {
  const NAMES = { softbox: "Softbox", flash: "Flash or light", umbrella: "Umbrella", strip: "Strip box", light: "Continuous light", diffusion: "Diffusion panel", card: "White card", flag: "Black card or flag", reflector: "Reflector", product: "Product or subject", subject: "Person (from above)", audience: "Group of people", camera: "Camera", "camera-flash": "Camera with flash", window: "Window", sun: "Sun", sky: "Open sky", backdrop: "Background", table: "Surface", shade: "Shade", wall: "Wall", ceiling: "Ceiling" };
  const wide = new Set(["backdrop", "table", "shade", "ceiling", "audience", "wall"]);
  const items = [...types].filter((t) => NAMES[t]).map((t) => {
    const svg = lightingSvg({ title: NAMES[t], elements: [{ id: "k", type: t, x: 180, y: 150, rot: 0, label: "" }], beams: [] }, { palette: "print", interactive: false })
      .replace('viewBox="0 0 360 300"', wide.has(t) ? 'viewBox="80 95 200 110"' : 'viewBox="140 115 80 70"');
    return `<div class="key-item"><div class="key-art">${svg}</div><span>${NAMES[t]}</span></div>`;
  });
  const arrow = (c, d, l) => `<div class="key-item"><div class="key-art"><svg viewBox="0 0 70 60"><line x1="8" y1="30" x2="54" y2="30" stroke="${c}" stroke-width="2.4" stroke-dasharray="${d}" stroke-linecap="round"/><path d="M52 24 L64 30 L52 36 Z" fill="${c}"/></svg></div><span>${l}</span></div>`;
  return `<div class="key-grid">${items.join("")}${arrow("#c77d16", "7 5", "Direct light")}${arrow("#6b645a", "2 5", "Bounced light")}</div>`;
}

/* ---------- Documents ---------- */

const CSS = (pocket, cover) => `
  @page { size: ${pocket ? "4in 6in" : "var(--size)"}; margin: ${pocket ? "8mm 7mm 11mm" : "16mm 15mm 18mm"}; }
  ${cover ? "@page :first { margin: 0; }" : ""}
  :root { --ink: #1f1d1a; --muted: #5b554d; --line: #d9cfbe; --soft: #f4efe6; --amber: #e09a2c; --amber-ink: #8f4a06; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font: ${pocket ? "7.6pt/1.4" : "10.2pt/1.5"} Inter, system-ui, sans-serif; color: var(--ink); }
  h1, h2, h3 { font-family: Fraunces, Georgia, serif; font-weight: 500; line-height: 1.15; margin: 0 0 6pt; break-after: avoid; }
  h2 { font-size: ${pocket ? "13pt" : "21pt"}; } h3 { font-size: ${pocket ? "9pt" : "12.5pt"}; margin-top: ${pocket ? "6pt" : "11pt"}; }
  p { margin: 0 0 7pt; }
  .page { break-before: page; }
  .page.first { break-before: auto; }
  .kicker { font-size: ${pocket ? "6pt" : "7.5pt"}; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--amber-ink); margin-bottom: 3pt; }
  .lede { color: var(--muted); font-size: ${pocket ? "7.6pt" : "10.6pt"}; max-width: 46em; }
  .cover { height: var(--h); background: #1f1d1a; color: #f4efe6; padding: 26mm 22mm; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .cover::after { content: ""; position: absolute; width: 170mm; height: 170mm; right: -50mm; top: -40mm; background: radial-gradient(closest-side, rgba(224,154,44,.28), rgba(224,154,44,0)); }
  .cover .brand { font-size: 8.5pt; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #f2a948; }
  .cover h1 { font-size: 40pt; margin: 16mm 0 6mm; max-width: 11em; }
  .cover .sub { font-size: 12.5pt; color: #d6cdbd; max-width: 30em; }
  .cover .ap { width: 86mm; height: 86mm; margin: auto 0 0 auto; position: relative; z-index: 1; }
  .cover .ap svg { width: 100%; height: 100%; } .cover .ap .ap-ring { color: #f4efe6; }
  .cover .foot { font-size: 9pt; color: #b0a796; border-top: 1px solid #3a342d; padding-top: 6mm; margin-top: 8mm; position: relative; z-index: 1; }
  .addon-head { border-bottom: 2px solid var(--amber); padding-bottom: ${pocket ? "4pt" : "10pt"}; margin-bottom: ${pocket ? "6pt" : "12pt"}; }
  .addon-head h1 { font-size: ${pocket ? "14pt" : "26pt"}; margin: 2pt 0 4pt; }
  .addon-head p { color: var(--muted); margin: 0; }
  .toc { list-style: none; padding: 0; margin: 8pt 0 0; border-top: 1px solid var(--line); columns: 2; column-gap: 10mm; }
  .toc li { padding: 4pt 0; border-bottom: 1px solid var(--line); break-inside: avoid; font-size: 9.6pt; }
  .toc li span { color: var(--muted); font-size: 8pt; margin-right: 6pt; }
  .intro p { font-size: 10pt; }
  .key-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6pt 4pt; padding: 9pt; background: #fbf8f2; border: 1px solid var(--line); border-radius: 6pt; }
  .key-item { text-align: center; font-size: 7.5pt; color: var(--muted); }
  .key-art { height: 13mm; display: flex; align-items: center; justify-content: center; }
  .key-art svg { height: 100%; width: auto; max-width: 100%; display: block; }
  .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 6pt 14pt; margin: 4pt 0 6pt; }
  .fields div { border-bottom: 1px solid var(--ink); height: ${pocket ? "18pt" : "26pt"}; position: relative; }
  .fields span, .wf span { position: absolute; top: 0; font-size: ${pocket ? "5.5pt" : "7pt"}; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .checks { list-style: none; padding: 0; margin: 0; }
  .checks li { display: flex; gap: ${pocket ? "6pt" : "10pt"}; align-items: flex-start; padding: ${pocket ? "3pt" : "5.5pt"} 0; border-bottom: 1px solid var(--line); break-inside: avoid; }
  .box { flex: none; width: ${pocket ? "8pt" : "12pt"}; height: ${pocket ? "8pt" : "12pt"}; border: 1.3pt solid var(--ink); border-radius: 2pt; margin-top: 1pt; }
  .checks strong { font-weight: 500; }
  .note { display: block; font-size: 8.5pt; color: var(--muted); }
  .checks.blank .line { flex: 1; border-bottom: 1px solid var(--line); height: 13pt; }
  .wgrid { display: grid; gap: 4pt 14pt; } .wgrid.cols-2 { grid-template-columns: 1fr 1fr; } .wgrid.cols-1 { grid-template-columns: 1fr; }
  .wf { position: relative; padding-top: 12pt; break-inside: avoid; } .wf.multi { grid-column: 1 / -1; }
  .wf .line, .lines .line, .qs .line, .frame .line { border-bottom: 1px solid var(--line); height: 20pt; }
  .wf:not(.multi) .line { border-bottom-color: var(--ink); }
  table { border-collapse: collapse; width: 100%; }
  .grid th, .grid td { text-align: left; vertical-align: top; padding: ${pocket ? "3pt 4pt" : "6pt 7pt"}; border: 1px solid var(--line); font-size: ${pocket ? "7pt" : "9pt"}; height: ${pocket ? "14pt" : "22pt"}; }
  .grid.small th, .grid.small td { font-size: 8.3pt; padding: 4pt 5pt; height: auto; }
  .grid thead th { font-size: ${pocket ? "5.5pt" : "7pt"}; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); background: var(--soft); height: auto; }
  .grid tbody th { font-weight: 600; }
  .settings tbody tr:nth-child(odd) { background: #fbf8f2; }
  .cal th, .cal td { height: 19pt; }
  .cards { display: grid; gap: 8pt; margin-top: 8pt; } .cards.cols-2 { grid-template-columns: 1fr 1fr; } .cards.cols-3 { grid-template-columns: 1fr 1fr 1fr; } .cards.cols-1 { grid-template-columns: 1fr; }
  .card { border: 1px solid var(--line); border-radius: 6pt; padding: ${pocket ? "5pt 6pt" : "10pt 12pt"}; break-inside: avoid; }
  .card h3 { margin-top: 0; } .card p { margin: 0; color: #3b3732; }
  .tpl { border: 1px solid var(--line); border-radius: 6pt; padding: 10pt 12pt; margin-top: 8pt; break-inside: avoid; }
  .tpl h3 { margin-top: 0; } .tpl pre { white-space: pre-wrap; font: 9.4pt/1.5 Inter, system-ui, sans-serif; margin: 0; color: #3b3732; }
  .diagram svg { display: block; width: 100%; max-height: 96mm; border: 1px solid var(--line); border-radius: 6pt; }
  .diagram { margin: 6pt 0 9pt; }
  .parts th, .parts td { text-align: left; vertical-align: top; padding: 4pt 6pt; border-bottom: 1px solid var(--line); font-size: 8.5pt; line-height: 1.38; }
  .parts thead th { font-size: 7pt; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .parts tbody th { width: 21%; font-weight: 600; } .parts .role { width: 25%; color: var(--amber-ink); font-weight: 600; }
  .tips { background: var(--soft); border-left: 3pt solid var(--amber); padding: ${pocket ? "5pt 7pt" : "8pt 12pt"}; margin-top: 9pt; break-inside: avoid; }
  .tips h3 { margin-top: 0; font-size: ${pocket ? "8pt" : "11pt"}; } .tips ul { margin: 0; padding-left: 13pt; } .tips li { margin-bottom: 3pt; }
  .qs { padding-left: 16pt; } .qs li { margin-bottom: 8pt; break-inside: avoid; }
  .steps { padding-left: 16pt; } .steps li { margin-bottom: 6pt; }
  .frames { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt 14pt; margin-top: 8pt; }
  .frame-box { border: 1.2pt solid var(--ink); aspect-ratio: 16 / 9; border-radius: 2pt; }
  .frame-meta { display: flex; justify-content: space-between; font-size: 7pt; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-top: 4pt; }
  .frame .line { height: 16pt; }
  .pose { display: grid; grid-template-columns: 1.1fr 1fr; gap: 12pt; align-items: start; margin: 10pt 0 14pt; break-inside: avoid; }
  .pose-art svg { width: 100%; border: 1px solid var(--line); border-radius: 6pt; display: block; }
  .pose ul { padding-left: 14pt; margin: 0; } .pose li { margin-bottom: 4pt; }
  .back p { color: #3b3732; }
  .small { font-size: 8.5pt; color: var(--muted); }
`;

function backPage(guideName) {
  return `<section class="page back">
  <p class="kicker">About this guide</p><h2>License, notes, and support</h2>
  <h3>Using these pages</h3><p>You may use ${esc(guideName)} in your own photography work, including paid client sessions, and print it as often as you need for your own use. Worksheets and questionnaires designed for clients may be shared with your own clients. Please don't resell, share, or redistribute the files, or upload them to file-sharing or template sites.</p>
  <h3>Starting points, not guarantees</h3><p>Settings, setups, and plans in this guide are starting points. Gear, light, venues, and subjects vary, so adjust for your situation. You are responsible for using equipment safely and for any permits, permissions, or releases your work requires.</p>
  <h3>Independence</h3><p>Novaris Photo Guides is independent and not affiliated with or endorsed by any camera, lens, lighting, drone, or software maker. Equipment is described by type, never by brand.</p>
  <h3>Questions</h3><p>${esc(SITE.supportEmail)} · We reply within two business days.</p>
  <p class="small">© ${new Date().getFullYear()} Novaris Photo Guides. All text and diagrams are original.</p>
</section>`;
}

function guideHtml(g, paper) {
  const setupTypes = new Set(g.blocks.filter((b) => b.type === "setup").flatMap((b) => b.elements.map((e) => e.type)));
  const contents = g.blocks.map((b) => `<li><span>${esc(b.kicker)}</span>${esc(b.title)}</li>`).join("");
  return `
<section class="cover">
  <p class="brand">Novaris Photo Guides</p>
  <h1>${esc(g.name)}</h1>
  <p class="sub">${esc(g.subtitle)}</p>
  <div class="ap">${aperture()}</div>
  <p class="foot">Reference and planning material for photographers · ${paper === "A4" ? "A4" : "US Letter"} edition</p>
</section>
<section class="page">
  <p class="kicker">Contents</p><h2>In this guide</h2>
  <div class="intro">${g.intro.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
  <ol class="toc">${contents}<li><span>About</span>License, notes, and support</li></ol>
  ${setupTypes.size ? `<h3>Diagram key</h3><p class="small">Lighting diagrams are drawn from above, with the background at the top and the camera at the bottom.</p>${diagramKey(setupTypes)}` : ""}
</section>
${g.blocks.map(renderBlock).join("\n")}
${backPage(g.name)}`;
}

function addonHtml(g, a) {
  const [first0, ...rest] = a.blocks;
  const first = first0.title === a.name ? { ...first0, title: "" } : first0;
  const firstHtml = MULTI_PAGE.has(first.type) ? R[first.type](first).replace('<section class="page">', '<section class="page first">') : `<section class="page first">${R[first.type](first)}</section>`;
  return `<header class="addon-head"><p class="kicker">Novaris Photo Guides · Add-on for the ${esc(g.name)}</p><h1>${esc(a.name)}</h1><p>${esc(a.subtitle)}</p></header>
${firstHtml}
${rest.map(renderBlock).join("\n")}`;
}

function documentHtml(title, body, paper, pocket, cover = false) {
  const h = paper === "A4" ? "297mm" : "279.4mm";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="stylesheet" href="/fonts/fonts.css"><style>:root{--h:${h}} ${CSS(pocket, cover).replace("var(--size)", paper)}</style></head><body>${body}</body></html>`;
}

/* ---------- Run ---------- */

export async function loadGuides() {
  const dir = path.join(ROOT, "catalog/content");
  const parts = fs.readdirSync(dir).filter((f) => /^part\d+\.js$/.test(f)).sort();
  const guides = [];
  for (const p of parts) guides.push(...(await import(pathToFileURL(path.join(dir, p)).href)).default);
  return guides;
}

function validate(guides) {
  const errors = [];
  for (const g of guides) {
    const c = CATALOG.find((x) => x.slug === g.slug);
    if (!c) { errors.push(`${g.slug}: not in catalog`); continue; }
    if (c.name !== g.name) errors.push(`${g.slug}: name differs from catalog`);
    const want = c.options.map((o) => o.name).sort().join("|");
    const have = g.addons.map((a) => a.name).sort().join("|");
    if (want !== have) errors.push(`${g.slug}: add-ons differ from catalog\n  catalog: ${want}\n  content: ${have}`);
    for (const b of [...g.blocks, ...g.addons.flatMap((a) => a.blocks)]) if (!R[b.type]) errors.push(`${g.slug}: unknown block ${b.type}`);
  }
  return errors;
}

async function main() {
  const guides = (await loadGuides()).filter((g) => !filter || g.slug.includes(filter));
  const errors = validate(guides);
  if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer(PORT);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const tmp = path.join(ROOT, "pdf-guides", "_catalog-layout.html");
  const footer = (label) => `<div style="width:100%;font:7pt Helvetica,Arial,sans-serif;color:#7a7368;padding:0 12mm;display:flex;justify-content:space-between"><span>Novaris Photo Guides · ${esc(label)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
  const render = async (html, file, paper, pocket, label) => {
    fs.writeFileSync(tmp, html);
    await page.goto(`http://localhost:${PORT}/pdf-guides/_catalog-layout.html`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const opts = { path: file, printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: footer(label) };
    if (pocket) Object.assign(opts, { width: "4in", height: "6in" }); else opts.format = paper;
    await page.pdf(opts);
  };
  let count = 0;
  for (const g of guides) {
    const n = String(CATALOG.findIndex((c) => c.slug === g.slug) + 1).padStart(2, "0");
    const dir = path.join(OUT, `${n}-${g.slug}`);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(path.join(dir, "add-ons"), { recursive: true });
    if (g.render) { count += await g.render({ render, dir, documentHtml, guideHtml, addonHtml, fname }); }
    else {
      await render(documentHtml(g.name, guideHtml(g, "Letter"), "Letter", false, true), path.join(dir, `${fname(g.name)}.pdf`), "Letter", false, g.name);
      count++;
    }
    for (const a of g.addons) {
      if (a.render) { count += await a.render({ render, dir, documentHtml, guideHtml, addonHtml, fname }); continue; }
      const pocket = a.size === "pocket";
      await render(documentHtml(a.name, addonHtml(g, a), "Letter", pocket), path.join(dir, "add-ons", `${fname(a.name)}.pdf`), "Letter", pocket, a.name);
      count++;
    }
    console.log(`  ${n} ${g.name}: guide + ${g.addons.length} add-ons`);
  }
  await browser.close();
  server.close();
  fs.rmSync(tmp, { force: true });
  console.log(`Rendered ${count} PDFs to ${OUT}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
export { guideHtml, addonHtml, documentHtml, fname };
