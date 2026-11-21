/* Storefront pieces for the printable PDF guides (format: "pdf" in js/products.js). */
import { lightingSvg } from "../field-kit/diagrams.js";
import * as S from "./site-svg.js";

export const CATEGORIES = [
  { id: "portraits", label: "Portraits & families", icon: "portrait" },
  { id: "weddings", label: "Weddings & couples", icon: "wedding" },
  { id: "commercial", label: "Commercial & business", icon: "product" },
  { id: "outdoors", label: "Outdoors & nature", icon: "landscape" },
  { id: "events", label: "Events, sport & video", icon: "event" }
];

const esc = (s) => String(s ?? "").replace(/&(?!amp;|#)/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const fmt = (n) => "$" + n;
export const pdfMetaLine = `Instant PDF download · <a href="/refunds.html">14-day refund policy</a> · Applicable taxes are shown at checkout.`;

export function pdfCard(p, i) {
  const cat = CATEGORIES.find((c) => c.id === p.category);
  return `      <article class="card reveal${p.slug === "wedding-portrait-pro-bundle" ? " card-featured" : ""}" style="--stagger:${i % 6}" data-product="${p.slug}" data-category="${p.category}">
        <span class="card-glow" aria-hidden="true"><span></span></span>
        <span class="card-tag">${esc(cat.label)}</span>
        ${S.icons[cat.icon]}
        <h3><a href="/${p.slug}.html">${esc(p.name)}</a></h3>
        <p>${esc(p.short)}</p>
        <p class="card-meta">PDF · ${p.pages} pages · ${p.options.length} optional add-ons</p>
        <div class="card-foot">
          <span class="card-price"><span data-price>${fmt(p.price)}</span><span class="visually-hidden"> US dollars</span></span>
          <span class="card-link" aria-hidden="true">View details &rarr;</span>
        </div>
      </article>`;
}

export function pdfLibrarySection(pdfs) {
  const chips = [`<button type="button" class="chip-filter is-on" data-filter="all" aria-pressed="true">All (${pdfs.length})</button>`]
    .concat(CATEGORIES.map((c) => `<button type="button" class="chip-filter" data-filter="${c.id}" aria-pressed="false">${esc(c.label)} (${pdfs.filter((p) => p.category === c.id).length})</button>`)).join("\n        ");
  return `<section class="section" id="pdf-guides" aria-labelledby="pdf-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow"><span class="eyebrow-num">02</span>Printable PDF guides</span>
      <h2 id="pdf-title">The PDF guide library</h2>
      <p>${pdfs.length} printable guides in US Letter, each with shot lists, diagrams, settings, worksheets, and checklists for one kind of work. Every guide has optional add-ons, such as pocket cards, planners, and templates, that you can choose when you buy.</p>
    </div>
    <div class="chip-filters" role="group" aria-label="Filter PDF guides by category" hidden>
        ${chips}
    </div>
    <div class="card-grid" data-filter-grid>
${pdfs.map(pdfCard).join("\n")}
    </div>
  </div>
</section>`;
}

/* Small previews built from the guide's own content. */
export function previews(guide) {
  const out = [];
  const setups = guide.blocks.filter((b) => b.type === "setup");
  const list = guide.blocks.find((b) => b.type === "shotlist");
  const st = guide.blocks.find((b) => b.type === "settings");
  const tbl = guide.blocks.find((b) => b.type === "table");
  const ws = guide.blocks.find((b) => b.type === "worksheet");
  if (setups[0]) out.push(diagramPreview(setups[0]));
  if (list) out.push(listPreview(list));
  if (setups[1]) out.push(diagramPreview(setups[1]));
  else if (st) out.push(settingsPreview(st));
  else if (tbl) out.push(tablePreview(tbl));
  else if (ws) out.push(worksheetPreview(ws));
  if (out.length < 3 && st && !out.some((x) => x.includes("data-kind=\"settings\""))) out.push(settingsPreview(st));
  if (out.length < 3 && ws && !out.some((x) => x.includes("data-kind=\"worksheet\""))) out.push(worksheetPreview(ws));
  return out.slice(0, 3);
}

const pageCard = (kind, kicker, title, inner, caption) => `<figure class="pdf-preview reveal" data-kind="${kind}"><div class="pdf-page"><p class="pdf-kicker">${esc(kicker)}</p><p class="pdf-title">${esc(title)}</p>${inner}</div><figcaption>${esc(caption)}</figcaption></figure>`;

function diagramPreview(b) {
  return pageCard("diagram", b.kicker, b.title, `<div class="pdf-diagram">${lightingSvg(b, { palette: "print", interactive: false })}</div>`, `Overhead diagram: ${b.title}. Each part is explained on the page.`);
}
function listPreview(b) {
  const items = b.sections.flatMap((s) => s.items).slice(0, 7).map((i) => (Array.isArray(i) ? i[0] : i));
  return pageCard("list", b.kicker, b.title, `<ul class="pdf-checks">${items.map((i) => `<li><span></span>${esc(i)}</li>`).join("")}</ul>`, `${b.kicker}: ${b.title}, with tick boxes to use on the day.`);
}
function settingsPreview(b) {
  return pageCard("settings", b.kicker, b.title, `<table class="pdf-table"><thead><tr><th>Situation</th><th>Aperture</th><th>Shutter</th><th>ISO</th></tr></thead><tbody>${b.rows.slice(0, 5).map((r) => `<tr><td>${esc(r.situation)}</td><td>${esc(r.aperture)}</td><td>${esc(r.shutter)}</td><td>${esc(r.iso)}</td></tr>`).join("")}</tbody></table>`, `Settings reference: starting points for common situations.`);
}
function tablePreview(b) {
  return pageCard("table", b.kicker, b.title, `<table class="pdf-table"><thead><tr>${b.columns.slice(0, 4).map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${(b.rows.length ? b.rows : [b.columns.map(() => "")]).slice(0, 5).map((r) => `<tr>${r.slice(0, 4).map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`, `${b.kicker}: ${b.title}.`);
}
function worksheetPreview(b) {
  return pageCard("worksheet", b.kicker, b.title, `<div class="pdf-fields">${b.fields.slice(0, 6).map((f) => `<div><span>${esc(f.replace(/^\+/, ""))}</span></div>`).join("")}</div>`, `Worksheet: ${b.title}, to fill in before the shoot.`);
}

export function pdfProductPage(p, guide, ctx) {
  const { pageDoc, write, PRODUCTS, MAIL, extra = {} } = ctx;
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const isBundle = p.slug === "wedding-portrait-pro-bundle";
  const contents = isBundle
    ? extra.bundleGuides.map((g, k) => `      <div class="contents-item reveal" style="--stagger:${k % 3}"><h3>${g.href ? `<a href="${g.href}">${esc(g.name)}</a>` : esc(g.name)}</h3><p>${esc(g.text)}</p></div>`).join("\n")
    : guide.blocks.map((b, k) => `      <div class="contents-item reveal" style="--stagger:${k % 3}"><p class="contents-kicker">${esc(b.kicker)}</p><h3>${esc(b.title)}</h3><p>${esc(b.description || b.summary || b.intro || "")}</p></div>`).join("\n");
  const pv = isBundle ? extra.bundlePreviews : previews(guide);
  const addons = guide.addons.map((a) => {
    const opt = p.options.find((o) => o.name === a.name);
    return `        <li class="addon">
          <input type="checkbox" id="addon-${opt.id}" value="${opt.id}" data-addon>
          <label for="addon-${opt.id}"><span class="addon-name">${esc(a.name)}</span><span class="addon-text">${esc(a.subtitle)}${a.size === "pocket" ? " (4 × 6 in)" : ""}</span></label>
          <span class="addon-price">+${fmt(opt.price)}</span>
        </li>`;
  }).join("\n");
  const others = PRODUCTS.filter((q) => q.format === "pdf" && q.category === p.category && q.slug !== p.slug).slice(0, 6);
  const body = `
<div class="wrap">
  <div class="page-head">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="/index.html">Home</a></li><li><a href="/index.html#pdf-guides">PDF guides</a></li><li aria-current="page">${esc(p.name)}</li></ol>
    </nav>
  </div>
  <div class="product-top">
    <div>
      ${S.icons[cat.icon]}
      <p class="eyebrow">${esc(cat.label)} · Printable PDF guide</p>
      <h1>${esc(p.name)}</h1>
      <p class="lede">${esc(guide.subtitle)}</p>
      ${(guide.intro || []).map((x) => `<p class="muted">${esc(x)}</p>`).join("")}
    </div>
    <aside class="buy-box" aria-labelledby="price-title">
      <h2 id="price-title">${esc(p.name)}</h2>
      <p class="price"><span data-price>${fmt(p.price)}</span><span class="price-currency">USD</span></p>
      <p class="price-meta">${pdfMetaLine}</p>
      <p class="addon-total" aria-live="polite">With selected add-ons: <strong data-total>${fmt(p.price)}</strong> USD</p>
      <div class="buy-slot" data-buy></div>
      <ul class="buy-facts">
        <li><span>Format</span><span>${isBundle ? "Seven PDF guides" : "PDF"}, US Letter</span></li>
        <li><span>Length</span><span>${p.pages} pages${isBundle ? " in total" : ""}</span></li>
        <li><span>Delivery</span><span>Download link right after payment</span></li>
        <li><span>Add-ons</span><span>${p.options.length} optional, chosen below</span></li>
        <li><span>Refunds</span><span>Within 14 days, no reason needed</span></li>
      </ul>
    </aside>
  </div>
</div>

<section class="section section-alt" id="add-ons" aria-labelledby="addons-title">
  <div class="wrap narrow">
    <div class="section-head reveal">
      <span class="eyebrow">Optional add-ons</span>
      <h2 id="addons-title">Add extras to your guide</h2>
      <p>Each add-on is a separate PDF delivered with your guide. Tick the ones you want; the total updates in the price box.</p>
    </div>
    <ul class="addons reveal">
${addons}
    </ul>
    <p class="muted small">Choose add-ons before you add the guide to your cart. You can change them later from your cart.</p>
  </div>
</section>

<section class="section" aria-labelledby="contents-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">What's inside</span>
      <h2 id="contents-title">${isBundle ? "The seven guides in this bundle" : "Contents of the guide"}</h2>
      <p>${isBundle ? "Each guide is delivered as its own PDF." : "Every section below is included in the PDF, along with a contents page and a license and support page."}</p>
    </div>
    <div class="contents-grid">
${contents}
    </div>
  </div>
</section>

${pv.length ? `<section class="section section-alt" aria-labelledby="preview-title">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Previews</span>
      <h2 id="preview-title">From the pages</h2>
      <p>${isBundle ? "Excerpts from three of the bundle's guides, shown here in a smaller layout." : "Excerpts drawn from the guide's own pages, shown here in a smaller layout."}</p>
    </div>
    <div class="pdf-preview-grid">
${pv.join("\n")}
    </div>
  </div>
</section>` : ""}

<section class="section" aria-labelledby="need-title">
  <div class="wrap narrow">
    <div class="section-head reveal">
      <span class="eyebrow">Good to know</span>
      <h2 id="need-title">Format, use, and delivery</h2>
    </div>
    <ul class="spec-list reveal">
      <li><span>File</span><span>PDF, US Letter (8.5 × 11 in). Prints on A4 with "fit to page."${isBundle ? " An A4 edition of every guide is available as an add-on." : ""}</span></li>
      <li><span>You need</span><span>A PDF viewer on a phone, tablet, or computer; a printer if you want paper copies</span></li>
      <li><span>Use</span><span>Reference and planning pages, not lessons or critique. Settings and setups are starting points to adjust.</span></li>
      <li><span>Gear</span><span>Any camera: equipment is described by type, never by brand</span></li>
      <li><span>License</span><span>Use in your own photography work, including paid sessions; print as often as you need; share client worksheets and questionnaires with your own clients. See the <a href="/terms.html">Terms of Service</a>.</span></li>
      <li><span>Delivery</span><span>Your download link is shown right after payment and sent to the email you use at checkout. Add-ons you choose are delivered with the guide. See the <a href="/delivery.html">Delivery Policy</a>.</span></li>
    </ul>
  </div>
</section>

<section class="section section-dark" aria-labelledby="closing-title">
  <div class="wrap">
    <div class="closing-buy">
      <div>
        <h2 id="closing-title">${esc(p.name)}</h2>
        <p class="price"><span data-price>${fmt(p.price)}</span><span class="price-currency">USD</span></p>
        <p class="price-meta">${pdfMetaLine}</p>
      </div>
      <div class="btn-row">
        <div class="buy-slot" data-buy></div>
        <a class="btn btn-ghost" href="/index.html#pdf-guides">See all PDF guides</a>
      </div>
    </div>
  </div>
</section>

${others.length ? `<section class="section" aria-labelledby="other-title">
  <div class="wrap">
    <h2 id="other-title" class="reveal">More ${esc(cat.label.toLowerCase())} guides</h2>
    <ul class="related reveal">
${others.map((q) => `      <li><a href="/${q.slug}.html">${esc(q.name)} &middot; ${fmt(q.price)}</a></li>`).join("\n")}
    </ul>
  </div>
</section>` : ""}`;
  write(`${p.slug}.html`, pageDoc({
    title: `${p.name}: printable PDF photography guide | Novaris Photo Guides`,
    desc: `${p.short} Printable PDF, ${p.pages} pages, with optional add-ons. ${fmt(p.price)}.`,
    url: `/${p.slug}.html`, current: "guides", body, mainAttrs: ` data-product="${p.slug}"`
  }));
}
